import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '@/components/ui';
import { useAdminAuth } from '../hooks/useAdminAuth';

/**
 * Tela de login do painel admin.
 * Único campo: senha. Nenhum e-mail/usuário — a autenticação é
 * por segredo compartilhado (backend valida via bcrypt).
 */
export function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAdminAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Se já autenticado, redireciona direto para a lista.
  if (isAuthenticated) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!password.trim()) {
      setError('Informe a senha de acesso.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    const ok = await login(password);
    setIsSubmitting(false);
    if (ok) {
      navigate('/admin/briefings', { replace: true });
      return;
    }
    setError('Senha incorreta.');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-fg-subtle">
            — Painel Admin · RemoraPages
          </p>
          <h1 className="font-serif text-2xl font-semibold tracking-tight text-fg md:text-3xl">
            Acesso <span className="text-accent">restrito</span>
          </h1>
          <p className="mt-2 text-sm text-fg-muted">
            Informe a senha para acessar os briefings recebidos.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-bg-card p-6 shadow-lg shadow-black/5"
          noValidate
        >
          <Input
            label="Senha de acesso"
            type="password"
            autoComplete="current-password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error ?? undefined}
            disabled={isSubmitting}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isSubmitting}
            className="mt-4"
          >
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
}
