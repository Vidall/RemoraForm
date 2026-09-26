import type { Segmento } from '@remora/core';

/**
 * Metadados visuais por segmento — usados no StepNegocio para
 * feedback interativo ao selecionar. Fonte única de labels/ícones.
 */
export interface SegmentoMeta {
  value: Segmento;
  label: string;
  emoji: string;
  /** Cor de destaque no tema do formulário (Tailwind arbitrary). */
  colorClass: string;
  hint: string;
}

export const SEGMENTOS_META: readonly SegmentoMeta[] = [
  {
    value: 'perfumaria',
    label: 'Perfumaria',
    emoji: '✨',
    colorClass: 'text-segmento-perfumaria',
    hint: 'Fragrâncias, cosméticos, essências.',
  },
  {
    value: 'restaurante',
    label: 'Restaurante',
    emoji: '🍽️',
    colorClass: 'text-segmento-restaurante',
    hint: 'Bar, cafeteria, delivery, gastronomia.',
  },
  {
    value: 'salao',
    label: 'Salão / Estética',
    emoji: '💇',
    colorClass: 'text-segmento-salao',
    hint: 'Cabelo, unhas, estética, barbearia.',
  },
  {
    value: 'loja_roupas',
    label: 'Loja de roupas',
    emoji: '👗',
    colorClass: 'text-segmento-loja_roupas',
    hint: 'Moda, acessórios, calçados.',
  },
  {
    value: 'outro',
    label: 'Outro',
    emoji: '🏷️',
    colorClass: 'text-segmento-outro',
    hint: 'Detalhe o segmento na descrição.',
  },
] as const;

export function findSegmentoMeta(segmento: Segmento | undefined): SegmentoMeta | undefined {
  if (!segmento) return undefined;
  return SEGMENTOS_META.find((s) => s.value === segmento);
}
