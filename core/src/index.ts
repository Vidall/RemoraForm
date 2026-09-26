/**
 * ============================================================
 *  @remora/core — Barrel export
 * ============================================================
 *  Kernel de contratos do app-forms (Remora Pages).
 *  Único ponto de importação para backend e frontend.
 *
 *  Uso típico:
 *    import { BriefingSchema, BriefingData } from '@remora/core';
 * ============================================================
 */

// Schemas Zod (validação em runtime)
export {
  BriefingSchema,
  NegocioSchema,
  ContatoSchema,
  IdentidadeVisualSchema,
  HeroiSchema,
  ProdutoSchema,
  ProdutosSchema,
  ProvaSocialSchema,
  ProvasSociaisSchema,
  MetaSchema,
  SegmentoEnum,
  TemaEnum,
  EstiloFonteEnum,
  ORDEM_SECOES_BRIEFING,
} from './schemas/briefing.schema';

// Enums de domínio (tipos derivados)
export type {
  Segmento,
  Tema,
  EstiloFonte,
  SecaoBriefing,
} from './schemas/briefing.schema';

// Tipos inferidos + envelopes de resposta
export type {
  NegocioData,
  ContatoData,
  IdentidadeVisualData,
  HeroiData,
  ProdutoData,
  ProdutosData,
  ProvaSocialData,
  ProvasSociaisData,
  MetaData,
  BriefingData,
  BriefingResponse,
  BriefingStatus,
} from './types/index';
