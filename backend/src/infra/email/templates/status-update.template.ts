import type { RenderedEmail } from './admin-notification.template';

// ---------------------------------------------------------------
// Notificações de mudança de status — enviadas ao cliente
// ---------------------------------------------------------------

export type NotifiableStatus = 'submetido' | 'em_producao' | 'publicado';

export interface ClientStatusUpdateParams {
  clienteNome: string;
  briefingId: string;
  status: NotifiableStatus;
}

const STATUS_CONFIG: Record<
  NotifiableStatus,
  { subject: string; heading: string; body: string; label: string; color: string }
> = {
  submetido: {
    subject: 'Recebemos seu briefing — RemoraPages',
    heading: 'Briefing recebido com sucesso!',
    body: 'Sua solicitação foi registrada e nossa equipe já começou a análise. Em breve você terá novidades sobre o andamento da sua landing page.',
    label: 'Submetido',
    color: '#C9A227',
  },
  em_producao: {
    subject: 'Sua landing page entrou em produção — RemoraPages',
    heading: 'Estamos construindo sua landing page!',
    body: 'Nossa equipe recebeu seu briefing e já começou a trabalhar. Em breve você receberá uma prévia para aprovação antes da publicação.',
    label: 'Em Produção',
    color: '#2563EB',
  },
  publicado: {
    subject: 'Sua landing page está no ar! — RemoraPages',
    heading: 'Sua landing page foi publicada!',
    body: 'Tudo pronto! Sua landing page já está no ar. Nossa equipe entrará em contato com o link de acesso e os próximos passos.',
    label: 'Publicado',
    color: '#16A34A',
  },
};

export function renderClientStatusUpdateEmail(
  params: ClientStatusUpdateParams,
): RenderedEmail {
  const { clienteNome, briefingId, status } = params;
  const cfg = STATUS_CONFIG[status];
  const protocolo = briefingId.slice(0, 8).toUpperCase();

  const text = [
    `Olá, ${clienteNome}!`,
    '',
    cfg.body,
    '',
    `Protocolo: ${protocolo}`,
    '',
    'Qualquer dúvida, basta responder este e-mail.',
    '',
    'Atenciosamente,',
    'Equipe RemoraPages',
  ].join('\n');

  const html = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <title>${cfg.subject}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#ffffff;color:#111111;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#ffffff;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="560" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;width:100%;">

            <!-- Status badge -->
            <tr>
              <td style="padding:0 24px 20px 24px;">
                <span style="display:inline-block;padding:4px 12px;background-color:${cfg.color};color:#ffffff;font-size:11px;font-weight:700;border-radius:100px;letter-spacing:0.08em;text-transform:uppercase;">
                  ${cfg.label}
                </span>
              </td>
            </tr>

            <tr>
              <td style="padding:0 24px 8px 24px;font-size:20px;font-weight:700;color:#111111;line-height:1.3;">
                ${cfg.heading}
              </td>
            </tr>
            <tr>
              <td style="padding:4px 24px 16px 24px;font-size:16px;color:#333333;line-height:1.6;">
                Olá, ${escapeHtml(clienteNome)}!
              </td>
            </tr>
            <tr>
              <td style="padding:0 24px 20px 24px;font-size:15px;line-height:1.7;color:#444444;">
                ${cfg.body}
              </td>
            </tr>

            <!-- Protocolo -->
            <tr>
              <td style="padding:0 24px 24px 24px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                  style="background-color:#f5f5f5;border-radius:6px;border-left:3px solid ${cfg.color};">
                  <tr>
                    <td style="padding:14px 16px;font-size:13px;color:#555555;">
                      <strong style="color:#111111;">Protocolo:</strong>&nbsp;
                      <code style="font-family:Menlo,Consolas,monospace;font-size:13px;">${protocolo}</code>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:0 24px 8px 24px;font-size:13px;color:#888888;">
                Qualquer dúvida, basta responder este e-mail.
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px 0 24px;font-size:14px;color:#333333;">
                Atenciosamente,<br />
                <strong>Equipe RemoraPages</strong>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject: cfg.subject, html, text };
}

// ---------------------------------------------------------------
// Notificação de mudança de status — enviada ao admin
// ---------------------------------------------------------------

export interface AdminStatusUpdateParams {
  clienteNome: string;
  negocioNome: string;
  briefingId: string;
  status: NotifiableStatus;
  adminUiBaseUrl: string;
}

export function renderAdminStatusUpdateEmail(
  params: AdminStatusUpdateParams,
): RenderedEmail {
  const { clienteNome, negocioNome, briefingId, status, adminUiBaseUrl } = params;
  const cfg = STATUS_CONFIG[status];
  const linkAdmin = `${adminUiBaseUrl}/admin/briefings/${briefingId}`;

  const subject = `[RemoraPages] Status atualizado → ${cfg.label}: ${negocioNome}`;

  const text = [
    subject,
    '',
    `Cliente: ${clienteNome}`,
    `Negócio: ${negocioNome}`,
    `Novo status: ${cfg.label}`,
    `Briefing ID: ${briefingId}`,
    '',
    `Ver no admin: ${linkAdmin}`,
  ].join('\n');

  const html = `<!doctype html>
<html lang="pt-BR">
  <head><meta charset="utf-8" /><title>${escapeHtml(subject)}</title></head>
  <body style="margin:0;padding:0;background-color:#ffffff;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="560" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;width:100%;">
            <tr>
              <td style="padding:0 24px 12px 24px;">
                <span style="display:inline-block;padding:4px 12px;background-color:${cfg.color};color:#ffffff;font-size:11px;font-weight:700;border-radius:100px;letter-spacing:0.08em;text-transform:uppercase;">
                  ${cfg.label}
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding:0 24px 16px 24px;font-size:18px;font-weight:600;color:#111111;">
                Status atualizado: ${escapeHtml(negocioNome)}
              </td>
            </tr>
            <tr>
              <td style="padding:0 24px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                  style="border:1px solid #e5e5e5;border-radius:6px;border-collapse:separate;overflow:hidden;">
                  ${row('Cliente', escapeHtml(clienteNome))}
                  ${row('Negócio', escapeHtml(negocioNome))}
                  ${row('Novo status', `<span style="color:${cfg.color};font-weight:700;">${cfg.label}</span>`)}
                  ${row('Briefing ID', `<code style="font-family:Menlo,Consolas,monospace;font-size:12px;">${escapeHtml(briefingId)}</code>`)}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 24px;">
                <a href="${linkAdmin}"
                  style="display:inline-block;padding:12px 20px;background-color:#111111;color:#ffffff;text-decoration:none;border-radius:6px;font-size:14px;font-weight:600;">
                  Ver briefing no admin
                </a>
                <div style="margin-top:8px;font-size:12px;color:#888888;word-break:break-all;">
                  ${linkAdmin}
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, html, text };
}

function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:10px 14px;font-size:13px;color:#666666;background-color:#fafafa;border-bottom:1px solid #eeeeee;width:130px;vertical-align:top;">
        ${label}
      </td>
      <td style="padding:10px 14px;font-size:14px;color:#111111;border-bottom:1px solid #eeeeee;">
        ${value}
      </td>
    </tr>`;
}

function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
