import { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { BriefingData, BriefingResponse } from '@remora/core';
import {
  submitBriefing,
  type BriefingErrorPayload,
  type BriefingValidationError,
  type BriefingConflictError,
} from '@/services/briefing';

interface UseBriefingSubmitReturn {
  isSubmitting: boolean;
  submitError: string | null;
  successData: BriefingResponse | null;
  submit: (data: BriefingData) => Promise<void>;
}

function isValidationError(payload: BriefingErrorPayload): payload is BriefingValidationError {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'issues' in payload &&
    Array.isArray((payload as { issues?: unknown }).issues)
  );
}

function isConflictError(payload: BriefingErrorPayload): payload is BriefingConflictError {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'field' in payload &&
    typeof (payload as { field?: unknown }).field === 'string'
  );
}

/**
 * Hook que encapsula o submit do briefing:
 *  - dispara POST /briefing
 *  - mapeia 400 (Zod) para setError por field
 *  - mapeia 409 (slug tomado) para setError no meta.slugSubdominio
 *  - guarda erro genérico para exibição
 *  - guarda payload de sucesso para transição para success screen
 */
export function useBriefingSubmit(
  form: UseFormReturn<BriefingData>,
): UseBriefingSubmitReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<BriefingResponse | null>(null);

  async function submit(data: BriefingData) {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await submitBriefing(data);

      if (result.ok) {
        setSuccessData(result.data);
        return;
      }

      const payload = result.data;

      if (result.status === 400 && isValidationError(payload)) {
        payload.issues.forEach((issue) => {
          const path = issue.path.join('.') as Parameters<typeof form.setError>[0];
          form.setError(path, { type: 'server', message: issue.message });
        });
        setSubmitError('Alguns campos precisam ser corrigidos. Volte e revise os steps.');
        return;
      }

      if (result.status === 409 && isConflictError(payload)) {
        form.setError(payload.field as Parameters<typeof form.setError>[0], {
          type: 'server',
          message: payload.message,
        });
        setSubmitError(payload.message);
        return;
      }

      const fallback =
        (payload as { message?: string })?.message ??
        `Erro ${result.status} ao enviar. Tente novamente em instantes.`;
      setSubmitError(fallback);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? `Falha de rede: ${err.message}`
          : 'Falha inesperada ao enviar o briefing.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return { isSubmitting, submitError, successData, submit };
}
