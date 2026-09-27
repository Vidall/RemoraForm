import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email.service';

/**
 * EmailModule global — expõe o EmailService para toda a aplicação
 * sem precisar reimportar em cada feature module.
 *
 * ConfigModule é importado explicitamente para garantir que o
 * ConfigService esteja disponível ao construir o EmailService, mesmo
 * quando a ordem de resolução dos módulos globais variar.
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
