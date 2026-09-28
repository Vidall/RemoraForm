import { z } from 'zod';

/**
 * LoginSchema — payload aceito por POST /auth/login.
 *
 * Validação mínima: apenas exige que `password` esteja presente e não vazio.
 * A comparação real (com timing-safe) ocorre no AuthService.
 */
export const LoginSchema = z.object({
  password: z.string().min(1, 'Senha é obrigatória'),
});

export type LoginDto = z.infer<typeof LoginSchema>;
