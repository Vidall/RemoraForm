import { Module } from '@nestjs/common';
import { BriefingModule } from './modules/briefing/briefing.module';
import { PrismaModule } from './prisma/prisma.module';

/**
 * Módulo raiz. Agrega infraestrutura (PrismaModule) e módulos de domínio
 * (BriefingModule por enquanto).
 */
@Module({
  imports: [PrismaModule, BriefingModule],
})
export class AppModule {}
