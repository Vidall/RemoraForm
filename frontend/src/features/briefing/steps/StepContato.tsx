import { useFormContext } from 'react-hook-form';
import type { BriefingData } from '@remora/core';
import { Input } from '@/components/ui';

export function StepContato() {
  const {
    register,
    formState: { errors },
  } = useFormContext<BriefingData>();

  return (
    <div className="space-y-6 animate-fade-in">
      <Input
        label="WhatsApp"
        placeholder="(11) 91234-5678"
        inputMode="tel"
        autoComplete="tel"
        error={errors.contato?.whatsapp?.message}
        hint="Aparece como botão flutuante na landing."
        {...register('contato.whatsapp')}
      />

      <Input
        label="Instagram"
        placeholder="@perfumariadaana"
        autoCapitalize="none"
        autoCorrect="off"
        error={errors.contato?.instagram?.message}
        {...register('contato.instagram')}
      />

      <div className="space-y-3">
        <Input
          label="E-mail (opcional)"
          placeholder="contato@perfumariadaana.com.br"
          type="email"
          inputMode="email"
          autoComplete="email"
          error={errors.contato?.email?.message}
          {...register('contato.email')}
        />

        {/* Callout — acompanhe o status da sua landing */}
        <div className="rounded-lg border border-accent/40 bg-gradient-to-r from-accent/[0.07] to-accent/[0.04] px-4 py-3.5">
          <div className="flex items-start gap-3">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <div>
              <p className="text-sm font-semibold leading-snug text-accent">
                Acompanhe sua landing em tempo real
              </p>
              <p className="mt-1 text-xs leading-relaxed text-fg-muted">
                Informe seu e-mail e receba notificações a cada etapa — do briefing até a publicação da sua página.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Input
        label="Endereço (opcional)"
        placeholder="Rua Exemplo, 123 — São Paulo/SP"
        autoComplete="street-address"
        error={errors.contato?.endereco?.message}
        hint="Deixe em branco se for negócio 100% online."
        {...register('contato.endereco')}
      />
    </div>
  );
}
