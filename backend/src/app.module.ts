import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './infra/email/email.module';
import { BriefingModule } from './modules/briefing/briefing.module';
import { PrismaModule } from './prisma/prisma.module';

/**
 * Módulo raiz. Agrega infraestrutura (ConfigModule, PrismaModule,
 * EmailModule) e módulos de domínio (BriefingModule).
 *
 * ConfigModule é registrado com `isGlobal: true` para que o ConfigService
 * fique disponível em toda a aplicação sem imports repetidos.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    EmailModule,
    BriefingModule,
  ],
})
export class AppModule {}
