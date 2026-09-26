import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';

/**
 * Bootstrap do backend @remora/backend.
 *
 * Responsabilidades:
 *  - Sobe o NestJS na porta definida em PORT (default 3333).
 *  - Habilita CORS para origens definidas em CORS_ORIGINS.
 *  - Registra filtro global de exceções (formato de erro consistente).
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  // CORS — libera frontend (Vite/CRA/etc.). "*" apenas se explicitamente configurado.
  const rawOrigins = process.env.CORS_ORIGINS ?? '*';
  const origin =
    rawOrigins.trim() === '*'
      ? true
      : rawOrigins
          .split(',')
          .map((o) => o.trim())
          .filter((o) => o.length > 0);

  app.enableCors({
    origin,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // Filtro global — normaliza erros (400 Zod, 409 conflito, 500 inesperado).
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = Number(process.env.PORT ?? 3333);
  await app.listen(port);

  const logger = new Logger('Bootstrap');
  logger.log(`Remora backend rodando em http://localhost:${port}`);
}

void bootstrap();
