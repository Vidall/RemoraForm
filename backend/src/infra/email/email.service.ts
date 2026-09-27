import {
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import {
  renderAdminNotificationEmail,
} from './templates/admin-notification.template';
import {
  renderClientConfirmationEmail,
} from './templates/client-confirmation.template';

/**
 * EmailService — camada de infraestrutura responsável pelo envio de
 * e-mails transacionais via Resend.
 *
 * Contrato importante:
 *  - Nenhum método público lança exceção. Falhas são logadas e absorvidas
 *    para não interromper o fluxo principal (ex.: submissão de briefing).
 *  - Configuração é lida via ConfigService (API_KEY_RESEND, RESEND_FROM,
 *    ADMIN_EMAIL).
 */
@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger = new Logger(EmailService.name);
  private resend!: Resend;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit(): void {
    const apiKey = this.configService.get<string>('API_KEY_RESEND');

    if (!apiKey) {
      this.logger.warn(
        'API_KEY_RESEND não configurada — envios de e-mail vão falhar silenciosamente',
      );
    }

    // Resend aceita string vazia sem lançar; o erro só aparece no send().
    this.resend = new Resend(apiKey ?? '');
  }

  /**
   * Envia o e-mail de confirmação ao cliente.
   * Só deve ser chamado quando o cliente informou um e-mail no briefing.
   */
  async sendBriefingConfirmationToClient(params: {
    clienteEmail: string;
    clienteNome: string;
    briefingId: string;
  }): Promise<void> {
    const { clienteEmail, clienteNome, briefingId } = params;

    try {
      const from = this.getFrom();
      const replyTo = this.getAdminEmail();
      const { subject, html, text } = renderClientConfirmationEmail({
        clienteNome,
        briefingId,
      });

      const result = await this.resend.emails.send({
        from,
        to: clienteEmail,
        subject,
        html,
        text,
        replyTo,
      });

      if (result.error) {
        this.logger.error(
          `Falha ao enviar confirmação para cliente (${clienteEmail}) — briefingId=${briefingId}: ${JSON.stringify(result.error)}`,
        );
        return;
      }

      this.logger.log(
        `Confirmação enviada ao cliente ${clienteEmail} (briefingId=${briefingId}, resendId=${result.data?.id ?? 'unknown'})`,
      );
    } catch (err) {
      this.logger.error(
        `Erro ao enviar confirmação para cliente (${clienteEmail}) — briefingId=${briefingId}`,
        err instanceof Error ? err.stack : String(err),
      );
    }
  }

  /**
   * Envia o e-mail de notificação ao admin com os dados-chave do briefing.
   */
  async sendBriefingNotificationToAdmin(params: {
    briefingId: string;
    clienteNome: string;
    negocioNome: string;
    clienteEmail?: string;
    whatsapp: string;
  }): Promise<void> {
    const {
      briefingId,
      clienteNome,
      negocioNome,
      clienteEmail,
      whatsapp,
    } = params;

    try {
      const from = this.getFrom();
      const adminEmail = this.getAdminEmail();

      if (!adminEmail) {
        this.logger.error(
          `ADMIN_EMAIL não configurado — notificação admin descartada (briefingId=${briefingId})`,
        );
        return;
      }

      const { subject, html, text } = renderAdminNotificationEmail({
        briefingId,
        clienteNome,
        negocioNome,
        clienteEmail,
        whatsapp,
      });

      const result = await this.resend.emails.send({
        from,
        to: adminEmail,
        subject,
        html,
        text,
        replyTo: clienteEmail ?? undefined,
      });

      if (result.error) {
        this.logger.error(
          `Falha ao enviar notificação admin (briefingId=${briefingId}): ${JSON.stringify(result.error)}`,
        );
        return;
      }

      this.logger.log(
        `Notificação admin enviada (briefingId=${briefingId}, resendId=${result.data?.id ?? 'unknown'})`,
      );
    } catch (err) {
      this.logger.error(
        `Erro ao enviar notificação admin (briefingId=${briefingId})`,
        err instanceof Error ? err.stack : String(err),
      );
    }
  }

  private getFrom(): string {
    const from = this.configService.get<string>('RESEND_FROM');
    return from && from.length > 0 ? from : 'onboarding@resend.dev';
  }

  private getAdminEmail(): string | undefined {
    const admin = this.configService.get<string>('ADMIN_EMAIL');
    return admin && admin.length > 0 ? admin : undefined;
  }
}
