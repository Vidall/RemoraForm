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
    id: 'dono',
    numeral: 'I',
    title: 'Sobre você',
    subtitle: 'Quem está por trás do negócio e como quer soar.',
  },
  {
    id: 'negocio-1',
    numeral: 'II',
    title: 'Sobre o seu negócio',
    subtitle: 'Nome e segmento.',
  },
  {
    id: 'negocio-2',
    numeral: 'III',
    title: 'Descreva a marca',
    subtitle: 'Descrição e público-alvo.',
  },
  {
    id: 'diferenciais',
    numeral: 'IV',
    title: 'Seus diferenciais',
    subtitle: 'O que te separa da concorrência.',
  },
  {
    id: 'contato',
    numeral: 'V',
    title: 'Como te encontram',
    subtitle: 'Canais de contato que aparecem na landing.',
  },
  {
    id: 'identidade',
    numeral: 'VI',
    title: 'Identidade visual',
    subtitle: 'Cores, tema e estilo tipográfico.',
  },
  {
    id: 'heroi',
    numeral: 'VII',
    title: 'Sessão de destaque',
    subtitle: 'A primeira coisa que o visitante vê.',
  },
  {
    id: 'produtos',
    numeral: 'VIII',
    title: 'Produtos e serviços',
    subtitle: 'Cadastre o que aparece em destaque.',
  },
  {
    id: 'provas',
    numeral: 'IX',
    title: 'Provas sociais',
    subtitle: 'Depoimentos de clientes (opcional).',
  },
  {
    id: 'meta',
    numeral: 'X',
    title: 'Últimos detalhes',
    subtitle: 'Dados internos e endereço do subdomínio.',
  },
] as const;

export const TOTAL_STEPS = WIZARD_STEPS.length;
