import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

/**
 * Payload assinado no JWT emitido pelo AuthService.
 * `sub` identifica o principal (aqui: sempre "admin", pois o modelo é
 * de senha única sem múltiplos usuários).
 */
export interface JwtPayload {
  sub: string;
  role: 'admin';
  iat?: number;
  exp?: number;
}

/**
 * Resultado da validação do JWT, anexado a `request.user` pelo Passport.
 */
export interface AuthenticatedUser {
  sub: string;
  role: 'admin';
}

/**
 * JwtStrategy — valida tokens Bearer no header Authorization.
 *
 *  - Extrai o token de `Authorization: Bearer <jwt>`.
 *  - Verifica assinatura com JWT_SECRET.
 *  - Rejeita tokens expirados (ignoreExpiration: false).
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new Error(
        'JWT_SECRET não configurado. Defina a variável no arquivo .env.',
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  validate(payload: JwtPayload): AuthenticatedUser {
    if (!payload?.sub || payload.role !== 'admin') {
      throw new UnauthorizedException('Token inválido');
    }

    return { sub: payload.sub, role: payload.role };
  }
}
