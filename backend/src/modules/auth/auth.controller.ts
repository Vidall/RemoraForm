import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import { AuthService, LoginResult } from './auth.service';
import { LoginDto, LoginSchema } from './dto/login.dto';

/**
 * AuthController — endpoints públicos de autenticação.
 *
 *  POST /auth/login  — recebe { password }, retorna { accessToken }.
 *
 * Rate limit específico e mais estrito que o global (5 tentativas / minuto)
 * para dificultar brute force.
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async login(
    @Body(new ZodValidationPipe(LoginSchema)) body: LoginDto,
  ): Promise<LoginResult> {
    return this.authService.login(body.password);
  }
}
