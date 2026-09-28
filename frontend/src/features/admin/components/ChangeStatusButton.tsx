import { useState } from 'react';
import type { BriefingResponse, BriefingStatus } from '@remora/core';
import { Button } from '@/components/ui';
import { adminService } from '../services/admin.service';

interface ChangeStatusButtonProps {
  currentStatus: BriefingStatus;
  briefingId: string;
  token: string;
  onStatusChanged: (updated: BriefingResponse) => void;
  onUnauthorized?: () => void;
}

interface NextTransition {
  status: BriefingStatus;
  label: string;
  variant: 'primary' | 'secondary';
}

/**
 * Determina as transições válidas a partir do status atual.
 * Regras (do enunciado):
 *  - submetido → em_producao | arquivado
 *  - em_producao → publicado | arquivado
 *  - publicado | arquivado → sem ações
 *  - rascunho → sem ações (é um estado do cliente, não do admin)
 */
function nextTransitions(status: BriefingStatus): NextTransition[] {
  switch (status) {
    case 'submetido':
      return [
        { status: 'em_producao', label: 'Iniciar produção', variant: 'primary' },
        { status: 'arquivado', label: 'Arquivar', variant: 'secondary' },
      ];
    case 'em_producao':
      return [
        { status: 'publicado', label: 'Marcar como publicado', variant: 'primary' },
        { status: 'arquivado', label: 'Arquivar', variant: 'secondary' },
      ];
    default:
      return [];
  }
}

export function ChangeStatusButton({
  currentStatus,
  briefingId,
  token,
  onStatusChanged,
  onUnauthorized,
}: ChangeStatusButtonProps) {
  const [pending, setPending] = useState<BriefingStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const transitions = nextTransitions(currentStatus);

  if (transitions.length === 0) return null;

  async function handleChange(nextStatus: BriefingStatus) {
    setPending(nextStatus);
    setError(null);
    const result = await adminService.updateStatus(token, briefingId, nextStatus);
    setPending(null);
    if (result.ok) {
      onStatusChanged(result.data);
      return;
    }
    if (result.status === 401) {
      onUnauthorized?.();
    }
    const message =
      (result.data as { message?: string })?.message ??
      `Erro ${result.status} ao atualizar status.`;
    setError(message);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {transitions.map((t) => (
          <Button
            key={t.status}
            variant={t.variant}
            size="md"
            onClick={() => handleChange(t.status)}
            isLoading={pending === t.status}
            disabled={pending !== null}
          >
            {t.label}
          </Button>
        ))}
      </div>
      {error && (
        <p className="text-xs text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
