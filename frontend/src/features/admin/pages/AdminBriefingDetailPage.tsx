import { useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { BriefingResponse } from '@remora/core';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { useBriefing } from '../hooks/useBriefings';
import { BriefingStatusBadge } from '../components/BriefingStatusBadge';
import { BriefingStatusTimeline } from '../components/BriefingStatusTimeline';
import { ChangeStatusButton } from '../components/ChangeStatusButton';

const SEGMENTO_LABEL: Record<string, string> = {
  perfumaria: 'Perfumaria',
  restaurante: 'Restaurante',
  salao: 'Salão',
  loja_roupas: 'Loja de roupas',
  outro: 'Outro',
};

const TEMA_LABEL: Record<string, string> = {
  claro: 'Claro',
  escuro: 'Escuro',
};

const ESTILO_FONTE_LABEL: Record<string, string> = {
  moderno: 'Moderno',
  elegante: 'Elegante',
  bold: 'Bold',
  minimalista: 'Minimalista',
};

export function AdminBriefingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token, logout } = useAdminAuth();

  const handleUnauthorized = useCallback(() => {
    logout();
    navigate('/admin/login', { replace: true });
  }, [logout, navigate]);

  const { briefing, isLoading, error, setBriefing } = useBriefing(
    token,
    id,
    handleUnauthorized,
  );

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border bg-bg-card/60 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <Link
            to="/admin/briefings"
            className="inline-flex items-center gap-2 text-sm text-fg-muted transition-colors hover:text-fg"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Voltar
          </Link>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-subtle">
            — Painel Admin
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {isLoading && <DetailSkeleton />}

        {!isLoading && error && (
          <div className="rounded-xl border border-danger/40 bg-danger/10 p-4">
            <p className="text-sm text-danger">{error}</p>
          </div>
        )}

        {!isLoading && !error && briefing && (
          <DetailContent briefing={briefing} token={token} onUpdated={setBriefing} onUnauthorized={handleUnauthorized} />
        )}
      </main>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-32 animate-pulse rounded-2xl border border-border bg-bg-card" />
      <div className="h-64 animate-pulse rounded-2xl border border-border bg-bg-card" />
    </div>
  );
}

interface DetailContentProps {
  briefing: BriefingResponse;
  token: string | null;
  onUpdated: (b: BriefingResponse) => void;
  onUnauthorized: () => void;
}

function DetailContent({ briefing, token, onUpdated, onUnauthorized }: DetailContentProps) {
  const { dados } = briefing;

  return (
    <div className="space-y-6">
      {/* Bloco superior — nome do negócio, status e timeline */}
      <section className="rounded-2xl border border-border bg-bg-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-subtle">
              — {dados.meta.slugSubdominio}.remoralink.com
            </p>
            <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight text-fg md:text-3xl">
              {dados.negocio.nome}
            </h1>
            <p className="mt-1 text-sm text-fg-muted">{dados.meta.nomeCliente}</p>
          </div>
          <BriefingStatusBadge status={briefing.status} />
        </div>

        <div className="mt-6">
          <BriefingStatusTimeline
            status={briefing.status}
            submetidoEm={briefing.submetidoEm}
            emProducaoEm={briefing.emProducaoEm}
            publicadoEm={briefing.publicadoEm}
            arquivadoEm={briefing.arquivadoEm}
          />
        </div>

        {token && (
          <div className="mt-6 flex justify-end">
            <ChangeStatusButton
              briefingId={briefing.id}
              token={token}
              currentStatus={briefing.status}
              onStatusChanged={onUpdated}
              onUnauthorized={onUnauthorized}
            />
          </div>
        )}
      </section>

      {/* Seção — Negócio */}
      <Section title="Negócio">
        <Field label="Nome">{dados.negocio.nome}</Field>
        <Field label="Segmento">
          {SEGMENTO_LABEL[dados.negocio.segmento] ?? dados.negocio.segmento}
        </Field>
        <Field label="Público-alvo" span={2}>{dados.negocio.publicoAlvo}</Field>
        <Field label="Descrição" span={2}>
          <p className="whitespace-pre-wrap text-fg">{dados.negocio.descricao}</p>
        </Field>
        <Field label="Diferenciais" span={2}>
          <ul className="list-disc list-inside space-y-1">
            {dados.negocio.diferenciais.map((d, i) => <li key={i} className="text-sm text-fg">{d}</li>)}
          </ul>
        </Field>
      </Section>

      {/* Seção — Contato */}
      <Section title="Contato">
        <Field label="WhatsApp">{dados.contato.whatsapp}</Field>
        <Field label="Instagram">{dados.contato.instagram ?? '—'}</Field>
        <Field label="E-mail">{dados.contato.email ?? '—'}</Field>
        <Field label="Endereço">{dados.contato.endereco ?? '—'}</Field>
      </Section>

      {/* Seção — Identidade Visual */}
      <Section title="Identidade Visual">
        <Field label="Cor primária">
          <span className="inline-flex items-center gap-2">
            <span
              className="h-4 w-4 rounded border border-border"
              style={{ backgroundColor: dados.identidadeVisual.corPrimaria }}
              aria-hidden="true"
            />
            <span className="font-mono text-xs">{dados.identidadeVisual.corPrimaria}</span>
          </span>
        </Field>
        <Field label="Cor secundária">
          <span className="inline-flex items-center gap-2">
            <span
              className="h-4 w-4 rounded border border-border"
              style={{ backgroundColor: dados.identidadeVisual.corSecundaria }}
              aria-hidden="true"
            />
            <span className="font-mono text-xs">{dados.identidadeVisual.corSecundaria}</span>
          </span>
        </Field>
        <Field label="Tema">
          {TEMA_LABEL[dados.identidadeVisual.tema] ?? dados.identidadeVisual.tema}
        </Field>
        <Field label="Estilo tipográfico">
          {ESTILO_FONTE_LABEL[dados.identidadeVisual.estiloFonte] ??
            dados.identidadeVisual.estiloFonte}
        </Field>
      </Section>

      {/* Seção — Herói */}
      <Section title="Herói">
        <Field label="Título" span={2}>
          {dados.heroi.titulo}
        </Field>
        <Field label="Subtítulo" span={2}>
          <p className="whitespace-pre-wrap text-fg">{dados.heroi.subtitulo}</p>
        </Field>
        <Field label="Texto do CTA">{dados.heroi.textoCTA}</Field>
        <Field label="Galeria" span={2}>
          <div className="flex flex-wrap gap-2">
            {dados.heroi.galeria.map((img, i) => (
              <span key={i} className="font-mono text-xs text-fg-muted bg-bg-elevated border border-border rounded px-2 py-1">{img}</span>
            ))}
          </div>
        </Field>
      </Section>

      {/* Seção — Produtos */}
      <Section title={`Produtos (${dados.produtos.length})`}>
        <div className="col-span-full space-y-2">
          {dados.produtos.map((produto, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-border bg-bg p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-fg">{produto.nome}</p>
                  <p className="mt-1 text-sm text-fg-muted">{produto.descricao}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm text-accent">{produto.preco}</p>
                  {produto.destaque && (
                    <span className="mt-1 inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-accent">
                      Destaque
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Seção — Provas Sociais */}
      <Section title={`Provas Sociais (${dados.provasSociais.length})`}>
        {dados.provasSociais.length === 0 ? (
          <p className="col-span-full text-sm text-fg-subtle">
            Nenhum depoimento cadastrado.
          </p>
        ) : (
          <div className="col-span-full space-y-2">
            {dados.provasSociais.map((prova, idx) => (
              <div key={idx} className="rounded-xl border border-border bg-bg p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-fg">{prova.nomeCliente}</p>
                  <span className="font-mono text-xs text-accent">
                    {'★'.repeat(prova.avaliacao)}
                    <span className="text-fg-subtle">
                      {'★'.repeat(5 - prova.avaliacao)}
                    </span>
                  </span>
                </div>
                <p className="mt-2 text-sm text-fg-muted">{prova.depoimento}</p>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Seção — Meta */}
      <Section title="Meta (interno)">
        <Field label="Nome do cliente">{dados.meta.nomeCliente}</Field>
        <Field label="Slug do subdomínio">
          <span className="font-mono text-xs">
            {dados.meta.slugSubdominio}.remoralink.com
          </span>
        </Field>
        <Field label="Observações" span={2}>
          {dados.meta.observacoes ? (
            <p className="whitespace-pre-wrap text-fg">{dados.meta.observacoes}</p>
          ) : (
            <span className="text-fg-subtle">—</span>
          )}
        </Field>
      </Section>

      {/* Exportar dados */}
      <div className="flex justify-end pb-2">
        <button
          type="button"
          onClick={() => exportJson(briefing)}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-bg-card px-4 py-2.5 text-sm font-medium text-fg-muted transition-all duration-200 hover:border-accent/40 hover:bg-accent/10 hover:text-accent"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Exportar JSON
        </button>
      </div>
    </div>
  );
}

function exportJson(briefing: BriefingResponse): void {
  const payload = JSON.stringify(briefing, null, 2);
  const blob = new Blob([payload], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `briefing-${briefing.dados.meta.slugSubdominio}-${briefing.id.slice(0, 8)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <section className="rounded-2xl border border-border bg-bg-card p-6">
      <h2 className="mb-4 font-serif text-lg font-semibold tracking-tight text-fg">
        {title}
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

interface FieldProps {
  label: string;
  children: React.ReactNode;
  span?: 1 | 2;
}

function Field({ label, children, span = 1 }: FieldProps) {
  return (
    <div className={span === 2 ? 'md:col-span-2' : undefined}>
      <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
        {label}
      </p>
      <div className="text-sm text-fg">{children}</div>
    </div>
  );
}
