import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { timingSafeEqual } from 'node:crypto';

import type { JwtPayload } from './strategies/jwt.strategy';

/**
 * Resposta do endpoint POST /auth/login.
 */
export interface LoginResult {
  accessToken: string;
}

/**
 * AuthService — autenticação por senha única (modelo administrativo simples,
 * sem múltiplos usuários).
 *
 * A senha esperada vem de ADMIN_PASSWORD; a comparação é feita com
 * `timingSafeEqual` para evitar timing attacks. Em caso de sucesso emite um
 * JWT com `sub: 'admin'` e `role: 'admin'`.
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(password: string): Promise<LoginResult> {
    const expected = this.configService.get<string>('ADMIN_PASSWORD');

    if (!expected) {
      this.logger.error(
        'ADMIN_PASSWORD não configurado — bloqueando qualquer tentativa de login.',
      );
      throw new UnauthorizedException('Credenciais inválidas');
    }

    if (!this.isPasswordMatch(password, expected)) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload: JwtPayload = { sub: 'admin', role: 'admin' };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }

  /**
   * Comparação em tempo constante. Buffers de tamanhos diferentes fariam
   * `timingSafeEqual` lançar — normalizamos para o mesmo comprimento
   * mantendo a comparação segura contra timing attacks.
   */
  private isPasswordMatch(provided: string, expected: string): boolean {
    const providedBuf = Buffer.from(provided, 'utf8');
    const expectedBuf = Buffer.from(expected, 'utf8');

    // Compara sempre contra o buffer esperado (mesmo tamanho) para não
    // vazar informação por diferença de tempo entre "tamanho errado" e
    // "conteúdo errado".
    const paddedProvided = Buffer.alloc(expectedBuf.length);
    providedBuf.copy(paddedProvided);

    const equal = timingSafeEqual(paddedProvided, expectedBuf);
    return equal && providedBuf.length === expectedBuf.length;
  }
}
