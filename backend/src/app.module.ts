import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { EmailModule } from './infra/email/email.module';
import { AuthModule } from './modules/auth/auth.module';
import { BriefingModule } from './modules/briefing/briefing.module';
import { PrismaModule } from './prisma/prisma.module';

/**
 * Módulo raiz. Agrega infraestrutura (ConfigModule, PrismaModule,
 * EmailModule, ThrottlerModule) e módulos de domínio (AuthModule,
 * BriefingModule).
 *
 * ConfigModule é registrado com `isGlobal: true` para que o ConfigService
 * fique disponível em toda a aplicação sem imports repetidos.
 *
 * ThrottlerGuard é registrado como guard global (APP_GUARD) para aplicar
 * rate limit em toda a API — os controllers podem sobrescrever com
 * `@Throttle(...)` em rotas sensíveis (ex.: /auth/login).
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 10 }]),
    PrismaModule,
    EmailModule,
    AuthModule,
    BriefingModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
