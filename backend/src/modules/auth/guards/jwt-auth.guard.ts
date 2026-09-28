import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JwtAuthGuard — protege rotas exigindo um JWT válido no header
 * `Authorization: Bearer <token>`. Delega toda a lógica ao PassportStrategy
 * registrado com o nome `'jwt'` (ver JwtStrategy).
 *
 * Uso:
 *   @UseGuards(JwtAuthGuard)
 *   @Get()
 *   protectedEndpoint() { ... }
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
