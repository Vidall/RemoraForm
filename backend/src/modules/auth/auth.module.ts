import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtStrategy } from './strategies/jwt.strategy';

/**
 * AuthModule — encapsula autenticação JWT com senha única.
 *
 * Dependências:
 *  - ConfigModule (global) fornece ADMIN_PASSWORD, JWT_SECRET, JWT_EXPIRES_IN.
 *  - PassportModule + JwtModule configurados de forma assíncrona para ler o
 *    segredo/expiração do ConfigService.
 *
 * Exporta AuthService e JwtAuthGuard para uso por outros módulos.
 */
@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): JwtModuleOptions => {
        const secret = configService.get<string>('JWT_SECRET');
        const expiresIn = configService.get<string>('JWT_EXPIRES_IN') ?? '7d';

        if (!secret) {
          throw new Error(
            'JWT_SECRET não configurado. Defina a variável no arquivo .env.',
          );
        }

        return {
          secret,
          // `expiresIn` aceita string com sufixo (ex.: "7d", "12h") ou número
          // em segundos. O cast é necessário porque @nestjs/jwt v12 tipa via
          // `StringValue` do pacote `ms`, que não é exportado publicamente.
          signOptions: { expiresIn: expiresIn as unknown as number },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard, PassportModule, JwtModule],
})
export class AuthModule {}
