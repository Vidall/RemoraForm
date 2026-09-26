import type { BriefingData } from '@remora/core';

/**
 * DTO de entrada do POST /briefing.
 *
 * Não usamos class-validator aqui: a validação é feita pelo
 * ZodValidationPipe(BriefingSchema) diretamente no controller,
 * garantindo que o contrato canônico do `@remora/core` seja
 * respeitado sem duplicação de regras.
 */
export type CreateBriefingDto = BriefingData;
