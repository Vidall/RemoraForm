import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import type { BriefingData, BriefingResponse, BriefingStatus } from '@remora/core';
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

  constructor(private readonly prisma: PrismaService) {}

  async create(data: BriefingData): Promise<BriefingResponse> {
    try {
      const row = await this.prisma.briefing.create({
        data: BriefingMapper.toPrisma(data),
      });
      this.logger.log(
        `Briefing criado id=${row.id} slug=${row.slugSubdominio}`,
      );
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
    try {
      const row = await this.prisma.briefing.update({
        where: { id },
        data: { status },
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
}
