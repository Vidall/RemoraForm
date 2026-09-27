import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import type { BriefingData, BriefingResponse, BriefingStatus } from '@remora/core';
import { EmailService } from '../../infra/email/email.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BriefingMapper } from './briefing.mapper';

/**
 * BriefingService — camada de aplicação da feature Briefing.
 *
 * Responsabilidades:
 *  - Persistir briefings validados vindos do controller.
 *  - Traduzir erros de constraint do Prisma em exceções HTTP semânticas
 *    (P2002 em slugSubdominio → 409 Conflict).
 *  - Listar e recuperar briefings existentes.
 *  - Atualizar status (transição de rascunho → submetido → ...).
 */
@Injectable()
export class BriefingService {
  private readonly logger = new Logger(BriefingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async create(data: BriefingData): Promise<BriefingResponse> {
    try {
      const row = await this.prisma.briefing.create({
        data: BriefingMapper.toPrisma(data),
      });
      this.logger.log(
        `Briefing criado id=${row.id} slug=${row.slugSubdominio}`,
      );

      await this.dispatchSubmissionEmails(row.id, data);

      return BriefingMapper.toDomain(row);
    } catch (err) {
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        // Unique constraint. Único índice único do modelo é slugSubdominio.
        throw new ConflictException({
          statusCode: 409,
          error: 'Conflict',
          message: `Slug de subdomínio '${data.meta.slugSubdominio}' já está em uso`,
          field: 'meta.slugSubdominio',
        });
      }
      throw err;
    }
  }

  async findAll(): Promise<BriefingResponse[]> {
    const rows = await this.prisma.briefing.findMany({
      orderBy: { criadoEm: 'desc' },
    });
    return rows.map((r: (typeof rows)[number]) => BriefingMapper.toDomain(r));
  }

  async findOne(id: string): Promise<BriefingResponse> {
    const row = await this.prisma.briefing.findUnique({ where: { id } });
    if (!row) {
      throw new NotFoundException({
        statusCode: 404,
        error: 'NotFound',
        message: `Briefing ${id} não encontrado`,
      });
    }
    return BriefingMapper.toDomain(row);
  }

  async updateStatus(
    id: string,
    status: BriefingStatus,
  ): Promise<BriefingResponse> {
    const existing = await this.prisma.briefing.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException({
        statusCode: 404,
        error: 'NotFound',
        message: `Briefing ${id} não encontrado`,
      });
    }

    // Preenche o timestamp correspondente ao novo status apenas na primeira
    // ocorrência (idempotente): se o campo já tem valor, preserva o original.
    // Para status 'rascunho' nenhum timestamp é tocado.
    const now = new Date();
    const timestampPatch: Prisma.BriefingUpdateInput = {};
    switch (status) {
      case 'submetido':
        timestampPatch.submetidoEm = existing.submetidoEm ?? now;
        break;
      case 'em_producao':
        timestampPatch.emProducaoEm = existing.emProducaoEm ?? now;
        break;
      case 'publicado':
        timestampPatch.publicadoEm = existing.publicadoEm ?? now;
        break;
      case 'arquivado':
        timestampPatch.arquivadoEm = existing.arquivadoEm ?? now;
        break;
      case 'rascunho':
      default:
        break;
    }

    try {
      const row = await this.prisma.briefing.update({
        where: { id },
        data: { status, ...timestampPatch },
      });
      this.logger.log(`Briefing ${id} → status=${status}`);
      return BriefingMapper.toDomain(row);
    } catch (err) {
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        throw new NotFoundException({
          statusCode: 404,
          error: 'NotFound',
          message: `Briefing ${id} não encontrado`,
        });
      }
      throw err;
    }
  }

  /**
   * Dispara em paralelo os e-mails de pós-submissão:
   *  - Notificação para o admin (sempre).
   *  - Confirmação para o cliente (somente se `contato.email` estiver preenchido).
   *
   * Usa `Promise.allSettled` para garantir que uma falha em qualquer canal
   * não interrompa o outro nem propague erro ao endpoint. Os métodos do
   * EmailService já absorvem erros internamente — este loop só existe para
   * dar visibilidade adicional caso um deles retorne rejected inesperadamente.
   */
  private async dispatchSubmissionEmails(
    briefingId: string,
    data: BriefingData,
  ): Promise<void> {
    const clienteEmail = data.contato.email;

    const tasks: Array<{ label: string; promise: Promise<void> }> = [
      {
        label: 'admin-notification',
        promise: this.emailService.sendBriefingNotificationToAdmin({
          briefingId,
          clienteNome: data.meta.nomeCliente,
          negocioNome: data.negocio.nome,
          clienteEmail: clienteEmail ?? undefined,
          whatsapp: data.contato.whatsapp,
        }),
      },
    ];

    if (clienteEmail && clienteEmail.length > 0) {
      tasks.push({
        label: 'client-confirmation',
        promise: this.emailService.sendBriefingConfirmationToClient({
          clienteEmail,
          clienteNome: data.meta.nomeCliente,
          briefingId,
        }),
      });
    }

    const results = await Promise.allSettled(tasks.map((t) => t.promise));

    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        this.logger.error(
          `E-mail ${tasks[index].label} falhou inesperadamente (briefingId=${briefingId}): ${String(result.reason)}`,
        );
      }
    });
  }
}
