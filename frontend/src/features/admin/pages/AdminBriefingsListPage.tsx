import { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { BriefingResponse } from '@remora/core';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { useBriefingsList } from '../hooks/useBriefings';
import { BriefingStatusBadge } from '../components/BriefingStatusBadge';

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function AdminBriefingsListPage() {
  const navigate = useNavigate();
  const { token, logout } = useAdminAuth();

  const handleUnauthorized = useCallback(() => {
    logout();
    navigate('/admin/login', { replace: true });
  }, [logout, navigate]);

  const { briefings, isLoading, error, refetch } = useBriefingsList(
    token,
    handleUnauthorized,
  );

  function handleLogout() {
    logout();
    navigate('/admin/login', { replace: true });
  }

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border bg-bg-card/60 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-subtle">
              — Painel Admin
            </p>
            <h1 className="font-serif text-xl font-semibold tracking-tight text-fg md:text-2xl">
              Briefings recebidos
            </h1>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-border bg-bg-card px-3 py-1.5 text-sm text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {isLoading && <ListSkeleton />}

        {!isLoading && error && (
          <div className="rounded-xl border border-danger/40 bg-danger/10 p-4">
            <p className="text-sm text-danger">{error}</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-2 text-xs underline hover:no-underline"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!isLoading && !error && briefings && briefings.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-bg-card p-10 text-center">
            <p className="text-sm text-fg-muted">Nenhum briefing recebido ainda.</p>
          </div>
        )}

        {!isLoading && !error && briefings && briefings.length > 0 && (
          <BriefingsTable briefings={briefings} />
        )}
      </main>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="space-y-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-16 animate-pulse rounded-xl border border-border bg-bg-card"
        />
      ))}
    </div>
  );
}

interface BriefingsTableProps {
  briefings: BriefingResponse[];
}

function BriefingsTable({ briefings }: BriefingsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-bg-card">
      {/* Cabeçalho — só em md+ */}
      <div className="hidden grid-cols-[2fr_2fr_1.2fr_1.4fr] gap-4 border-b border-border bg-bg-elevated px-5 py-3 text-[11px] font-medium uppercase tracking-widest text-fg-subtle md:grid">
        <span>Negócio</span>
        <span>Cliente</span>
        <span>Status</span>
        <span>Submetido em</span>
      </div>

      <ul className="divide-y divide-border">
        {briefings.map((briefing) => (
          <li key={briefing.id}>
            <Link
              to={`/admin/briefings/${briefing.id}`}
              className="grid grid-cols-1 gap-2 px-5 py-4 transition-colors hover:bg-bg-elevated md:grid-cols-[2fr_2fr_1.2fr_1.4fr] md:items-center md:gap-4"
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium text-fg">
                  {briefing.dados.negocio.nome}
                </span>
                <span className="text-xs text-fg-subtle md:hidden">
                  {briefing.dados.meta.nomeCliente}
                </span>
              </div>
              <span className="hidden text-sm text-fg-muted md:inline">
                {briefing.dados.meta.nomeCliente}
              </span>
              <div>
                <BriefingStatusBadge status={briefing.status} />
              </div>
              <span className="font-mono text-xs text-fg-muted">
                {formatDate(briefing.submetidoEm)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
