import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Envelope padrão de erro retornado pelo backend.
 * Erros de validação Zod já vêm com `issues` populado pelo ZodValidationPipe.
 */
export interface ErrorEnvelope {
  statusCode: number;
  error: string;
  message: string;
  path: string;
  timestamp: string;
  issues?: unknown;
}

/**
 * Filtro global de exceções — normaliza qualquer erro HTTP ou inesperado
 * para o envelope acima. Loga stack de erros 500 para observabilidade.
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = this.resolveStatus(exception);
    const envelope = this.buildEnvelope(exception, status, request.url);

    if (status >= 500) {
      this.logger.error(
        `Erro ${status} em ${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(status).json(envelope);
  }

  private resolveStatus(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private buildEnvelope(
    exception: unknown,
    status: number,
    path: string,
  ): ErrorEnvelope {
    const timestamp = new Date().toISOString();

    if (exception instanceof HttpException) {
      const response = exception.getResponse();

      // Quando lançamos BadRequestException(payload) com objeto, ele vem aqui.
      if (typeof response === 'object' && response !== null) {
        const asRecord = response as Record<string, unknown>;
        return {
          statusCode: status,
          error:
            typeof asRecord.error === 'string'
              ? asRecord.error
              : this.defaultErrorName(status),
          message:
            typeof asRecord.message === 'string'
              ? asRecord.message
              : exception.message,
          issues: asRecord.issues,
          path,
          timestamp,
        };
      }

      return {
        statusCode: status,
        error: this.defaultErrorName(status),
        message: typeof response === 'string' ? response : exception.message,
        path,
        timestamp,
      };
    }

    return {
      statusCode: status,
      error: 'InternalServerError',
      message: 'Erro interno inesperado',
      path,
      timestamp,
    };
  }

  private defaultErrorName(status: number): string {
    switch (status) {
      case 400:
        return 'BadRequest';
      case 404:
        return 'NotFound';
      case 409:
        return 'Conflict';
      case 422:
        return 'UnprocessableEntity';
      default:
        return 'HttpError';
    }
  }
}
