import { z } from 'zod';

/**
 * ============================================================
 *  BRIEFING SCHEMA — @remora/core
 * ============================================================
 *  Contrato canônico do formulário de briefing coletado pelo
 *  app-forms (Remora Pages). Este schema é a ÚNICA fonte de
 *  verdade compartilhada entre backend (validação de payload
 *  no controller) e frontend (validação do React Hook Form
 *  via zodResolver).
 *
 *  Regra de ouro: se um campo mudar, ele muda AQUI primeiro.
 * ============================================================
 */

// ---------------------------------------------------------------
// Regex e helpers reutilizáveis
// ---------------------------------------------------------------

/** Cor hexadecimal, com ou sem #, 3 ou 6 dígitos. */
const hexColorRegex = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

/** WhatsApp brasileiro — aceita com/sem +55, DDD, com/sem máscara. Normaliza-se depois no backend. */
const whatsappRegex = /^(\+?55\s?)?\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/;

/** Handle do Instagram — @opcional, letras, números, underline e ponto. */
const instagramRegex = /^@?[A-Za-z0-9._]{1,30}$/;

/** Slug de subdomínio — lowercase, alfanumérico e hífen, sem hífen no início/fim. */
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// ---------------------------------------------------------------
// Enums de domínio (exportados para uso no frontend em selects)
// ---------------------------------------------------------------

export const SegmentoEnum = z.enum([
  'perfumaria',
  'restaurante',
  'salao',
  'loja_roupas',
  'outro',
]);
export type Segmento = z.infer<typeof SegmentoEnum>;

export const TemaEnum = z.enum(['claro', 'escuro']);
export type Tema = z.infer<typeof TemaEnum>;

export const EstiloFonteEnum = z.enum([
  'moderno',
  'elegante',
  'bold',
  'minimalista',
]);
export type EstiloFonte = z.infer<typeof EstiloFonteEnum>;

// ---------------------------------------------------------------
// Seção 1 — Negócio
// ---------------------------------------------------------------

export const NegocioSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, 'Nome do negócio deve ter no mínimo 2 caracteres')
    .max(80, 'Nome do negócio deve ter no máximo 80 caracteres'),
  segmento: SegmentoEnum,
  descricao: z
    .string()
    .trim()
    .min(20, 'Descreva o negócio com pelo menos 20 caracteres')
    .max(500, 'Descrição deve ter no máximo 500 caracteres'),
  slogan: z
    .string()
    .trim()
    .min(3, 'Slogan deve ter no mínimo 3 caracteres')
    .max(120, 'Slogan deve ter no máximo 120 caracteres'),
});

// ---------------------------------------------------------------
// Seção 2 — Contato
// ---------------------------------------------------------------

export const ContatoSchema = z.object({
  whatsapp: z
    .string()
    .trim()
    .regex(whatsappRegex, 'Informe um WhatsApp válido (ex: (11) 91234-5678)'),
  instagram: z
    .string()
    .trim()
    .regex(instagramRegex, 'Handle do Instagram inválido'),
  email: z
    .string()
    .trim()
    .email('E-mail inválido')
    .max(120, 'E-mail muito longo')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  endereco: z
    .string()
    .trim()
    .min(5, 'Endereço muito curto')
    .max(200, 'Endereço muito longo')
    .optional()
    .or(z.literal('').transform(() => undefined)),
});

// ---------------------------------------------------------------
// Seção 3 — Identidade Visual
// ---------------------------------------------------------------

export const IdentidadeVisualSchema = z.object({
  corPrimaria: z
    .string()
    .trim()
    .regex(hexColorRegex, 'Cor primária deve ser um hex válido (ex: #1A1A1A)'),
  corSecundaria: z
    .string()
    .trim()
    .regex(hexColorRegex, 'Cor secundária deve ser um hex válido (ex: #C9A227)'),
  tema: TemaEnum,
  estiloFonte: EstiloFonteEnum,
});

// ---------------------------------------------------------------
// Seção 4 — Herói (hero section da landing)
// ---------------------------------------------------------------

export const HeroiSchema = z.object({
  titulo: z
    .string()
    .trim()
    .min(5, 'Título da hero deve ter no mínimo 5 caracteres')
    .max(120, 'Título da hero deve ter no máximo 120 caracteres'),
  subtitulo: z
    .string()
    .trim()
    .min(10, 'Subtítulo deve ter no mínimo 10 caracteres')
    .max(220, 'Subtítulo deve ter no máximo 220 caracteres'),
  textoCTA: z
    .string()
    .trim()
    .min(2, 'Texto do botão muito curto')
    .max(40, 'Texto do botão deve ter no máximo 40 caracteres'),
  imagemHero: z
    .string()
    .trim()
    .min(1, 'Nome do arquivo da imagem hero é obrigatório')
    .max(200, 'Nome do arquivo muito longo'),
});

// ---------------------------------------------------------------
// Seção 5 — Produtos / Serviços em destaque
// ---------------------------------------------------------------

export const ProdutoSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, 'Nome do produto muito curto')
    .max(80, 'Nome do produto muito longo'),
  descricao: z
    .string()
    .trim()
    .min(5, 'Descrição do produto muito curta')
    .max(300, 'Descrição do produto muito longa'),
  preco: z
    .string()
    .trim()
    .min(1, 'Preço é obrigatório')
    .max(40, 'Preço muito longo'),
  destaque: z.boolean(),
});

export const ProdutosSchema = z
  .array(ProdutoSchema)
  .min(1, 'Cadastre pelo menos 1 produto')
  .max(10, 'Máximo de 10 produtos por landing');

// ---------------------------------------------------------------
// Seção 6 — Provas Sociais / Depoimentos
// ---------------------------------------------------------------

export const ProvaSocialSchema = z.object({
  nomeCliente: z
    .string()
    .trim()
    .min(2, 'Nome do cliente muito curto')
    .max(80, 'Nome do cliente muito longo'),
  depoimento: z
    .string()
    .trim()
    .min(10, 'Depoimento muito curto')
    .max(400, 'Depoimento muito longo'),
  avaliacao: z
    .number()
    .int('Avaliação deve ser um número inteiro')
    .min(1, 'Avaliação mínima é 1')
    .max(5, 'Avaliação máxima é 5'),
});

export const ProvasSociaisSchema = z
  .array(ProvaSocialSchema)
  .max(5, 'Máximo de 5 depoimentos')
  .optional()
  .default([]);

// ---------------------------------------------------------------
// Seção 7 — Meta (dados internos, não aparecem na landing)
// ---------------------------------------------------------------

export const MetaSchema = z.object({
  nomeCliente: z
    .string()
    .trim()
    .min(2, 'Nome do cliente interno muito curto')
    .max(120, 'Nome do cliente interno muito longo'),
  slugSubdominio: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, 'Slug do subdomínio muito curto')
    .max(40, 'Slug do subdomínio muito longo')
    .regex(
      slugRegex,
      'Slug inválido: use apenas letras minúsculas, números e hífens (ex: perfumaria1)',
    ),
  observacoes: z
    .string()
    .trim()
    .max(1000, 'Observações muito longas')
    .optional()
    .or(z.literal('').transform(() => undefined)),
});

// ---------------------------------------------------------------
// Schema RAIZ do briefing
// ---------------------------------------------------------------

export const BriefingSchema = z.object({
  negocio: NegocioSchema,
  contato: ContatoSchema,
  identidadeVisual: IdentidadeVisualSchema,
  heroi: HeroiSchema,
  produtos: ProdutosSchema,
  provasSociais: ProvasSociaisSchema,
  meta: MetaSchema,
});

/**
 * Ordem canônica das seções — usar no frontend para renderizar
 * o wizard/stepper. O backend também pode usar para validar
 * transições parciais de rascunho no futuro.
 */
export const ORDEM_SECOES_BRIEFING = [
  'negocio',
  'contato',
  'identidadeVisual',
  'heroi',
  'produtos',
  'provasSociais',
  'meta',
] as const;

export type SecaoBriefing = (typeof ORDEM_SECOES_BRIEFING)[number];
