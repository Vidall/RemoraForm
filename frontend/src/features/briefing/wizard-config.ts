/**
 * Configuração declarativa dos steps do wizard. Cada seção do
 * BriefingSchema vira 1 step principal, alguns quebrados em
 * sub-steps quando têm >3 campos (regra do UX).
 *
 * A ordem aqui é a ORDEM_SECOES_BRIEFING enriquecida com
 * metadados de apresentação. Título e subtítulo curtos —
 * o subtítulo é lido por leitores de tela.
 */

export interface WizardStepMeta {
  /** Numeral romano exibido no stepper desktop. */
  numeral: string;
  /** Título da tela — Playfair. */
  title: string;
  /** Subtítulo curto — contexto para o usuário. */
  subtitle: string;
  /** Identificador estável (uso em keys/aria). */
  id: string;
}

export const WIZARD_STEPS: readonly WizardStepMeta[] = [
  {
    id: 'negocio-1',
    numeral: 'I',
    title: 'Sobre o seu negócio',
    subtitle: 'Comece pelo essencial: nome e segmento.',
  },
  {
    id: 'negocio-2',
    numeral: 'II',
    title: 'Descreva a marca',
    subtitle: 'Slogan e descrição em poucas linhas.',
  },
  {
    id: 'contato',
    numeral: 'III',
    title: 'Como te encontram',
    subtitle: 'Canais de contato que aparecem na landing.',
  },
  {
    id: 'identidade',
    numeral: 'IV',
    title: 'Identidade visual',
    subtitle: 'Cores, tema e estilo tipográfico.',
  },
  {
    id: 'heroi',
    numeral: 'V',
    title: 'Sessão de destaque',
    subtitle: 'A primeira coisa que o visitante vê.',
  },
  {
    id: 'produtos',
    numeral: 'VI',
    title: 'Produtos e serviços',
    subtitle: 'Cadastre o que aparece em destaque.',
  },
  {
    id: 'provas',
    numeral: 'VII',
    title: 'Provas sociais',
    subtitle: 'Depoimentos de clientes (opcional).',
  },
  {
    id: 'meta',
    numeral: 'VIII',
    title: 'Últimos detalhes',
    subtitle: 'Dados internos e endereço do subdomínio.',
  },
] as const;

export const TOTAL_STEPS = WIZARD_STEPS.length;
