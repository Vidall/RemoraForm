import type { BriefingStatus } from '@remora/core';
import { cn } from '@/lib/cn';

interface BriefingStatusBadgeProps {
  status: BriefingStatus;
  className?: string;
}

const STATUS_LABEL: Record<BriefingStatus, string> = {
  rascunho: 'Rascunho',
  submetido: 'Submetido',
  em_producao: 'Em produção',
  publicado: 'Publicado',
  arquivado: 'Arquivado',
};

const STATUS_CLASSES: Record<BriefingStatus, string> = {
  rascunho:
    'bg-fg-subtle/10 text-fg-subtle border-fg-subtle/20',
  submetido:
    'bg-sky-500/10 text-sky-500 border-sky-500/30 dark:text-sky-300',
  em_producao:
    'bg-amber-500/10 text-amber-600 border-amber-500/30 dark:text-amber-300',
  publicado:
    'bg-success/10 text-success border-success/30',
  arquivado:
    'bg-fg-muted/10 text-fg-muted border-fg-muted/20',
};

/**
 * Badge visual do status do briefing. Usado na lista e no detalhe.
 */
export function BriefingStatusBadge({ status, className }: BriefingStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5',
        'font-mono text-[11px] uppercase tracking-[0.14em]',
        STATUS_CLASSES[status],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {STATUS_LABEL[status]}
    </span>
  );
}
