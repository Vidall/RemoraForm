import type { BriefingData, BriefingResponse } from '@remora/core';
import { api, type ApiResult } from './api';

/**
 * Erro 400 do backend (Zod): lista de issues com path e message.
 * Formato compatível com o pipe `ZodValidationPipe` do NestJS.
 */
export interface BriefingValidationError {
  issues: Array<{
    path: (string | number)[];
    message: string;
  }>;
}

/** Erro 409 do backend: conflito de slug (unique constraint). */
export interface BriefingConflictError {
  field: string;
  message: string;
}

export type BriefingErrorPayload =
  | BriefingValidationError
  | BriefingConflictError
  | { message?: string };

export function submitBriefing(
  data: BriefingData,
): Promise<ApiResult<BriefingResponse, BriefingErrorPayload>> {
  return api.post<BriefingResponse, BriefingErrorPayload>('/briefing', data);
}
