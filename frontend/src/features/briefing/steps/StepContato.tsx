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

      <Input
        label="E-mail (opcional)"
        placeholder="contato@perfumariadaana.com.br"
        type="email"
        inputMode="email"
        autoComplete="email"
        error={errors.contato?.email?.message}
        hint="Informe seu e-mail para receber atualizações da sua landing page."
        {...register('contato.email')}
      />

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
