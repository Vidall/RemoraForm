import type { Briefing as BriefingRow, Prisma } from '@prisma/client';
import type {
  BriefingData,
  BriefingResponse,
  BriefingStatus,
  ProdutoData,
  ProvaSocialData,
} from '@remora/core';

/**
 * BriefingMapper — traduz entre o formato de domínio (`BriefingData`
 * do @remora/core, aninhado por seção) e a linha achatada do Prisma.
 *
 * Também produz o `BriefingResponse` (envelope enriquecido com id,
 * timestamps ISO e status) devolvido pela API.
 */
export class BriefingMapper {
  /**
   * Converte uma linha do Prisma para o envelope `BriefingResponse`
   * (formato exposto pela API e consumido pelo frontend).
   */
  static toDomain(row: BriefingRow): BriefingResponse {
    const dados: BriefingData = {
      negocio: {
        nome: row.negocioNome,
        segmento: row.negocioSegmento as BriefingData['negocio']['segmento'],
        descricao: row.negocioDescricao,
        slogan: row.negocioSlogan,
      },
      contato: {
        whatsapp: row.contatoWhatsapp,
        instagram: row.contatoInstagram ?? undefined,
        email: row.contatoEmail ?? undefined,
        endereco: row.contatoEndereco ?? undefined,
      },
      identidadeVisual: {
        corPrimaria: row.corPrimaria,
        corSecundaria: row.corSecundaria,
        tema: row.tema as BriefingData['identidadeVisual']['tema'],
        estiloFonte:
          row.estiloFonte as BriefingData['identidadeVisual']['estiloFonte'],
      },
      heroi: {
        titulo: row.heroTitulo,
        subtitulo: row.heroSubtitulo,
        textoCTA: row.heroTextoCTA,
        imagemHero: row.heroImagem,
      },
      produtos: (row.produtos as unknown as ProdutoData[]) ?? [],
      provasSociais:
        (row.provasSociais as unknown as ProvaSocialData[] | null) ?? [],
      meta: {
        nomeCliente: row.nomeCliente,
        slugSubdominio: row.slugSubdominio,
        observacoes: row.observacoes ?? undefined,
      },
    };

    return {
      id: row.id,
      criadoEm: row.criadoEm.toISOString(),
      atualizadoEm: row.atualizadoEm.toISOString(),
      status: row.status as BriefingStatus,
      dados,
    };
  }

  /**
   * Converte o payload de domínio validado para o formato de create do Prisma.
   * O POST /briefing representa a submissão final do formulário pelo cliente,
   * então o status inicial já é `submetido`. A transição `rascunho → submetido`
   * só volta a existir quando houver salvamento automático de rascunhos.
   */
  static toPrisma(data: BriefingData): Prisma.BriefingCreateInput {
    return {
      status: 'submetido',

      negocioNome: data.negocio.nome,
      negocioSegmento: data.negocio.segmento,
      negocioDescricao: data.negocio.descricao,
      negocioSlogan: data.negocio.slogan,

      contatoWhatsapp: BriefingMapper.normalizeWhatsapp(data.contato.whatsapp),
      contatoInstagram: data.contato.instagram
        ? BriefingMapper.normalizeInstagram(data.contato.instagram)
        : null,
      contatoEmail: data.contato.email ?? null,
      contatoEndereco: data.contato.endereco ?? null,

      corPrimaria: BriefingMapper.normalizeHex(data.identidadeVisual.corPrimaria),
      corSecundaria: BriefingMapper.normalizeHex(
        data.identidadeVisual.corSecundaria,
      ),
      tema: data.identidadeVisual.tema,
      estiloFonte: data.identidadeVisual.estiloFonte,

      heroTitulo: data.heroi.titulo,
      heroSubtitulo: data.heroi.subtitulo,
      heroTextoCTA: data.heroi.textoCTA,
      heroImagem: data.heroi.imagemHero,

      produtos: data.produtos as unknown as Prisma.InputJsonValue,
      provasSociais: (data.provasSociais ??
        []) as unknown as Prisma.InputJsonValue,

      nomeCliente: data.meta.nomeCliente,
      slugSubdominio: data.meta.slugSubdominio,
      observacoes: data.meta.observacoes ?? null,
    };
  }

  // -----------------------------------------------------------------
  // Normalizadores — regras leves aplicadas antes de persistir.
  // -----------------------------------------------------------------

  /** Mantém apenas dígitos e prefixa com +55 se faltar DDI. */
  private static normalizeWhatsapp(raw: string): string {
    const digits = raw.replace(/\D/g, '');
    if (digits.startsWith('55')) {
      return `+${digits}`;
    }
    return `+55${digits}`;
  }

  /** Garante o @ no início e remove espaços. */
  private static normalizeInstagram(raw: string): string {
    const trimmed = raw.trim();
    return trimmed.startsWith('@') ? trimmed : `@${trimmed}`;
  }

  /** Garante o # no início da cor hex. */
  private static normalizeHex(raw: string): string {
    const trimmed = raw.trim();
    return trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
  }
}
