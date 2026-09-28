import type { Segmento } from '@remora/core';

interface SegmentPlaceholders {
  negocioNome: string;
  heroTitulo: string;
  heroSubtitulo: string;
  produtoNome: string;
  produtoDescricao: string;
  produtoPreco: string;
}

export const SEGMENT_PLACEHOLDERS: Record<Segmento, SegmentPlaceholders> = {
  perfumaria: {
    negocioNome: 'Ex.: Perfumaria da Ana',
    heroTitulo: 'Ex.: Perfumes que contam histórias',
    heroSubtitulo: 'Ex.: Encontre a fragrância perfeita para cada momento da sua vida',
    produtoNome: 'Ex.: Perfume Iris Boire 100ml',
    produtoDescricao: 'Ex.: Fragrância floral com notas de baunilha e âmbar, duração de 8h',
    produtoPreco: 'Ex.: R$ 189,90',
  },
  restaurante: {
    negocioNome: 'Ex.: Restaurante do Zé',
    heroTitulo: 'Ex.: Sabores que ficam na memória',
    heroSubtitulo: 'Ex.: Culinária artesanal feita com ingredientes frescos todos os dias',
    produtoNome: 'Ex.: Picanha na brasa 400g',
    produtoDescricao: 'Ex.: Corte nobre grelhado na hora, acompanha farofa e vinagrete',
    produtoPreco: 'Ex.: R$ 89,00',
  },
  salao: {
    negocioNome: 'Ex.: Salão da Carla',
    heroTitulo: 'Ex.: Realce sua beleza, transforme seu dia',
    heroSubtitulo: 'Ex.: Cortes, colorações e tratamentos para você se sentir incrível',
    produtoNome: 'Ex.: Corte feminino + escova',
    produtoDescricao: 'Ex.: Corte personalizado com escova modeladora e finalização',
    produtoPreco: 'Ex.: R$ 120,00',
  },
  loja_roupas: {
    negocioNome: 'Ex.: Boutique Estilo Próprio',
    heroTitulo: 'Ex.: Vista-se com estilo e confiança',
    heroSubtitulo: 'Ex.: Peças exclusivas para todas as ocasiões e todos os estilos',
    produtoNome: 'Ex.: Vestido midi floral',
    produtoDescricao: 'Ex.: Tecido leve, disponível nos tamanhos P ao GG, lavagem à mão',
    produtoPreco: 'Ex.: R$ 219,90',
  },
  outro: {
    negocioNome: 'Ex.: Nome do seu negócio',
    heroTitulo: 'Ex.: O título principal da sua landing page',
    heroSubtitulo: 'Ex.: Uma frase que apresenta o que você oferece',
    produtoNome: 'Ex.: Nome do produto ou serviço',
    produtoDescricao: 'Ex.: Descreva brevemente o que está sendo oferecido',
    produtoPreco: 'Ex.: R$ 99,00',
  },
};

export const DEFAULT_PLACEHOLDERS: SegmentPlaceholders = SEGMENT_PLACEHOLDERS.outro;
