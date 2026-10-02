import type { z } from 'zod';
import {
  BriefingSchema,
  DonoSchema,
  NegocioSchema,
  ContatoSchema,
  IdentidadeVisualSchema,
  HeroiSchema,
  ProdutoSchema,
  ProdutosSchema,
  ProvaSocialSchema,
  ProvasSociaisSchema,
  MetaSchema,
} from '../schemas/briefing.schema';

/**
 * ============================================================
 *  TIPOS INFERIDOS — @remora/core
 * ============================================================
 *  Tipos TypeScript derivados dos schemas Zod. Estes tipos são
 *  o contrato consumido por:
 *   - backend (DTOs de entrada, entidades de domínio, Prisma)
 *   - frontend (React Hook Form generics, props de componentes)
 *
 *  NUNCA declarar estes tipos manualmente em outro lugar — sempre
 *  importar de `@remora/core`.
 * ============================================================
 */

// -------- Seção 0 — Dono
export type DonoData = z.infer<typeof DonoSchema>;

// -------- Seção 1 — Negócio
export type NegocioData = z.infer<typeof NegocioSchema>;

// -------- Seção 2 — Contato
export type ContatoData = z.infer<typeof ContatoSchema>;

// -------- Seção 3 — Identidade Visual
export type IdentidadeVisualData = z.infer<typeof IdentidadeVisualSchema>;

// -------- Seção 4 — Herói
export type HeroiData = z.infer<typeof HeroiSchema>;

// -------- Seção 5 — Produtos
export type ProdutoData = z.infer<typeof ProdutoSchema>;
export type ProdutosData = z.infer<typeof ProdutosSchema>;

// -------- Seção 6 — Provas Sociais
export type ProvaSocialData = z.infer<typeof ProvaSocialSchema>;
export type ProvasSociaisData = z.infer<typeof ProvasSociaisSchema>;

// -------- Seção 7 — Meta
export type MetaData = z.infer<typeof MetaSchema>;

// -------- Briefing completo (payload do POST /briefing)
export type BriefingData = z.infer<typeof BriefingSchema>;

/**
 * Envelope de resposta padronizado do backend após criar/consultar
 * um briefing. O backend enriquece o payload com id, timestamps
 * e status de processamento.
 */
export interface BriefingResponse {
  id: string;
  criadoEm: string; // ISO 8601
  atualizadoEm: string; // ISO 8601
  status: BriefingStatus;
  /** Timestamps de transição — preenchidos na primeira ocorrência de cada status. */
  submetidoEm: string | null; // ISO 8601 | null
  emProducaoEm: string | null; // ISO 8601 | null
  publicadoEm: string | null; // ISO 8601 | null
  arquivadoEm: string | null; // ISO 8601 | null
  dados: BriefingData;
}

export type BriefingStatus =
  | 'rascunho'
  | 'submetido'
  | 'em_producao'
  | 'publicado'
  | 'arquivado';
