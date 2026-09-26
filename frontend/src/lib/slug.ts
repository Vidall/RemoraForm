/**
 * Normaliza um texto livre em slug válido para subdomínio.
 * Regras: minúsculas, sem acentos, alfanumérico + hífen,
 * sem hífens em sequência nem nas bordas.
 */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
