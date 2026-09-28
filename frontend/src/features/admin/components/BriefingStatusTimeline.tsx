import type { BriefingStatus } from '@remora/core';
import { cn } from '@/lib/cn';

interface BriefingStatusTimelineProps {
  status: BriefingStatus;
  submetidoEm: string | null;
  emProducaoEm: string | null;
  publicadoEm: string | null;
  arquivadoEm: string | null;
}

interface Etapa {
  key: 'submetido' | 'em_producao' | 'publicado';
  label: string;
  timestamp: string | null;
}

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Timeline horizontal do ciclo de vida do briefing.
 * Considera 3 etapas felizes: Submetido → Em Produção → Publicado.
 * Se o briefing foi arquivado, o rótulo aparece como aviso ao lado.
 */
export function BriefingStatusTimeline({
  status,
  submetidoEm,
  emProducaoEm,
  publicadoEm,
  arquivadoEm,
}: BriefingStatusTimelineProps) {
  const etapas: Etapa[] = [
    { key: 'submetido', label: 'Submetido', timestamp: submetidoEm },
    { key: 'em_producao', label: 'Em Produção', timestamp: emProducaoEm },
    { key: 'publicado', label: 'Publicado', timestamp: publicadoEm },
  ];

  const currentIndex = etapas.findIndex((e) => e.key === status);
  const isArquivado = status === 'arquivado';

  function estadoDe(idx: number): 'done' | 'current' | 'future' {
    if (isArquivado) {
      // Considera as etapas com timestamp preenchido como concluídas.
      return etapas[idx].timestamp ? 'done' : 'future';
    }
    if (idx < currentIndex) return 'done';
    if (idx === currentIndex) return 'current';
    return 'future';
  }

  return (
    <div className="w-full">
      <ol className="flex w-full items-start justify-between gap-2">
        {etapas.map((etapa, idx) => {
          const estado = estadoDe(idx);
          const data = formatDate(etapa.timestamp);
          return (
            <li key={etapa.key} className="flex flex-1 flex-col items-center text-center">
              <div className="flex w-full items-center">
                {/* Linha esquerda */}
                <div
                  className={cn(
                    'h-px flex-1 transition-colors',
                    idx === 0 && 'opacity-0',
                    estado === 'future' ? 'bg-border' : 'bg-accent/60',
                  )}
                />
                {/* Bolinha */}
                <span
                  className={cn(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                    estado === 'done' && 'border-accent bg-accent text-bg',
                    estado === 'current' && 'border-accent bg-bg text-accent',
                    estado === 'future' && 'border-border bg-bg text-fg-subtle',
                  )}
                  aria-current={estado === 'current' ? 'step' : undefined}
                >
                  {estado === 'done' ? (
                    <svg
                      className="h-3 w-3"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
                  )}
                </span>
                {/* Linha direita */}
                <div
                  className={cn(
                    'h-px flex-1 transition-colors',
                    idx === etapas.length - 1 && 'opacity-0',
                    estado === 'done' ? 'bg-accent/60' : 'bg-border',
                  )}
                />
              </div>

              <p
                className={cn(
                  'mt-2 text-xs font-medium',
                  estado === 'future' ? 'text-fg-subtle' : 'text-fg',
                  estado === 'current' && 'text-accent',
                )}
              >
                {etapa.label}
              </p>
              {data && (
                <p className="mt-0.5 font-mono text-[10px] text-fg-subtle">{data}</p>
              )}
            </li>
          );
        })}
      </ol>

      {isArquivado && (
        <p className="mt-4 rounded-lg border border-fg-muted/30 bg-fg-muted/5 px-3 py-2 text-xs text-fg-muted">
          Briefing arquivado{arquivadoEm ? ` em ${formatDate(arquivadoEm)}` : ''}.
        </p>
      )}
    </div>
  );
}
