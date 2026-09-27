/**
 * Template do e-mail de confirmação enviado ao cliente após submissão do briefing.
 *
 * É uma função pura: recebe os dados necessários e devolve o trio
 * `{ subject, html, text }` pronto para o provedor. Sem framework de e-mail —
 * HTML com estilos inline simples para máxima compatibilidade.
 */

export interface ClientConfirmationTemplateParams {
  clienteNome: string;
  briefingId: string;
}

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

export function renderClientConfirmationEmail(
  params: ClientConfirmationTemplateParams,
): RenderedEmail {
  const { clienteNome, briefingId } = params;
  const protocolo = briefingId.slice(0, 8).toUpperCase();

  const subject = 'Recebemos seu briefing — RemoraPages';

  const text = [
    `Olá, ${clienteNome}!`,
    '',
    'Recebemos seu briefing com sucesso e nossa equipe já começou a analisá-lo.',
    '',
    `Protocolo: ${protocolo}`,
    'Prazo: em até 48h úteis retornamos com uma prévia da sua landing page.',
    '',
    'Se tiver qualquer informação adicional para nos enviar, basta responder este e-mail.',
    '',
    'Atenciosamente,',
    'Equipe RemoraPages',
  ].join('\n');

  const html = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <title>${subject}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#ffffff;color:#111111;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#ffffff;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="560" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;width:100%;">
            <tr>
              <td style="padding:24px 24px 8px 24px;font-size:20px;font-weight:600;color:#111111;">
                Olá, ${escapeHtml(clienteNome)}!
              </td>
            </tr>
            <tr>
              <td style="padding:8px 24px;font-size:15px;line-height:1.6;color:#333333;">
                Recebemos seu briefing com sucesso e nossa equipe já começou a analisá-lo.
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f5f5f5;border-radius:6px;">
                  <tr>
                    <td style="padding:16px;font-size:14px;color:#333333;">
                      <div style="margin-bottom:6px;"><strong>Protocolo:</strong> ${protocolo}</div>
                      <div><strong>Prazo:</strong> em até 48h úteis retornamos com uma prévia da sua landing page.</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 24px;font-size:14px;line-height:1.6;color:#555555;">
                Se tiver qualquer informação adicional para nos enviar, basta responder este e-mail.
              </td>
            </tr>
            <tr>
              <td style="padding:24px 24px 8px 24px;font-size:14px;color:#333333;">
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

  return { subject, html, text };
}

/**
 * Escapa caracteres HTML sensíveis para evitar injeção via campos de texto
 * fornecidos pelo cliente (ex.: nome com `<`, `>` ou `&`).
 */
function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
