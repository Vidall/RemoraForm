import { z } from 'zod';
import type { BriefingStatus } from '@remora/core';

/**
 * Schema local para PATCH /briefing/:id/status.
 * Os valores permitidos espelham o union `BriefingStatus` do @remora/core.
 */
export const UpdateStatusSchema = z.object({
  status: z.enum([
    'rascunho',
    'submetido',
    'em_producao',
    'publicado',
    'arquivado',
  ]),
});

export type UpdateStatusDto = { status: BriefingStatus };
