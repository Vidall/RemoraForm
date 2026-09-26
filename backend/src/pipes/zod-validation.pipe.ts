import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ZodSchema, ZodIssue } from 'zod';

/**
 * Formato do payload de erro 400 quando a validação Zod falha.
 * O frontend usa `issues` para mapear mensagens por campo (RHF).
 */
export interface ZodValidationErrorPayload {
  statusCode: 400;
  error: 'ValidationError';
  message: string;
  issues: ZodIssue[];
}

/**
 * ZodValidationPipe — valida o body do request usando um ZodSchema
 * do `@remora/core`. Falha → 400 com o array `issues` do Zod.
 *
 * Uso:
 *   @Body(new ZodValidationPipe(BriefingSchema)) data: BriefingData
 */
@Injectable()
export class ZodValidationPipe<T> implements PipeTransform<unknown, T> {
  constructor(private readonly schema: ZodSchema<T>) {}

  transform(value: unknown, _metadata: ArgumentMetadata): T {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      const payload: ZodValidationErrorPayload = {
        statusCode: 400,
        error: 'ValidationError',
        message: 'Payload inválido',
        issues: result.error.issues,
      };
      throw new BadRequestException(payload);
    }

    return result.data;
  }
}
