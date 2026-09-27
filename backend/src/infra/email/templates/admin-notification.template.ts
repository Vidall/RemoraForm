/**
 * Template do e-mail de notificação enviado ao admin quando um novo
 * briefing é submetido. Função pura: retorna `{ subject, html, text }`.
 */

export interface AdminNotificationTemplateParams {
  briefingId: string;
  clienteNome: string;
  negocioNome: string;
  clienteEmail?: string;
  whatsapp: string;
}

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

const ADMIN_UI_BASE_URL = 'http://localhost:5173';

export function renderAdminNotificationEmail(
  params: AdminNotificationTemplateParams,
): RenderedEmail {
  const {
    briefingId,
    clienteNome,
    negocioNome,
    clienteEmail,
    whatsapp,
  } = params;

  const emailInfo = clienteEmail && clienteEmail.length > 0
    ? clienteEmail
    : 'não informado';

  const linkAdmin = `${ADMIN_UI_BASE_URL}/admin/briefings/${briefingId}`;

  const subject = `[RemoraPages] Novo briefing: ${negocioNome}`;

  const text = [
    `Novo briefing recebido: ${negocioNome}`,
    '',
    `Cliente: ${clienteNome}`,
    `Negócio: ${negocioNome}`,
    `WhatsApp: ${whatsapp}`,
    `E-mail: ${emailInfo}`,
    `Briefing ID: ${briefingId}`,
    '',
    `Ver no admin: ${linkAdmin}`,
  ].join('\n');

  const html = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#ffffff;color:#111111;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#ffffff;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;width:100%;">
            <tr>
              <td style="padding:0 24px 16px 24px;font-size:20px;font-weight:600;color:#111111;">
                Novo briefing recebido
              </td>
            </tr>
            <tr>
              <td style="padding:0 24px 16px 24px;font-size:14px;color:#555555;">
                Um cliente acabou de submeter um novo briefing na plataforma.
              </td>
            </tr>
            <tr>
              <td style="padding:0 24px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border:1px solid #e5e5e5;border-radius:6px;border-collapse:separate;overflow:hidden;">
                  ${row('Cliente', escapeHtml(clienteNome))}
                  ${row('Negócio', escapeHtml(negocioNome))}
                  ${row('WhatsApp', escapeHtml(whatsapp))}
                  ${row('E-mail', escapeHtml(emailInfo))}
                  ${row('Briefing ID', `<code style="font-family:Menlo,Consolas,monospace;font-size:12px;">${escapeHtml(briefingId)}</code>`)}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;">
                <a href="${linkAdmin}" style="display:inline-block;padding:12px 20px;background-color:#111111;color:#ffffff;text-decoration:none;border-radius:6px;font-size:14px;font-weight:600;">
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
      <td style="padding:10px 14px;font-size:13px;color:#666666;background-color:#fafafa;border-bottom:1px solid #eeeeee;width:140px;vertical-align:top;">
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
