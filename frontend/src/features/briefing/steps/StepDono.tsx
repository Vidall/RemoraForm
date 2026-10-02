import { Controller, useFormContext } from 'react-hook-form';
import type { BriefingData, TomDeVoz } from '@remora/core';
import { Textarea } from '@/components/ui';
import { cn } from '@/lib/cn';

const TONS: Array<{ value: TomDeVoz; label: string; desc: string }> = [
  { value: 'direto', label: 'Direto', desc: 'Objetivo, sem rodeios.' },
  { value: 'emocional', label: 'Emocional', desc: 'Conecta pelo sentimento.' },
  { value: 'sofisticado', label: 'Sofisticado', desc: 'Elegante e refinado.' },
  { value: 'descontraido', label: 'Descontraído', desc: 'Leve e próximo.' },
];

export function StepDono() {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<BriefingData>();

  const sobre = watch('dono.sobre') ?? '';

  return (
    <div className="space-y-6 animate-fade-in">
      <Textarea
        label="Quem é você?"
        placeholder="Ex: Sou Marcus, há mais de 8 anos trabalho com perfumaria oriental. Importo diretamente dos fornecedores árabes porque acredito que cada pessoa merece um perfume genuíno…"
        maxLength={800}
        showCounter
        currentLength={sobre.length}
        rows={6}
        hint="Escreva em primeira pessoa. Isso vai direto para a seção 'Sobre' da sua landing."
        error={errors.dono?.sobre?.message}
        {...register('dono.sobre')}
      />

      <div>
        <span className="field-label">Tom de voz</span>
        <p className="text-xs text-fg-muted mb-3">Como você quer soar para quem chega na sua página?</p>
        <Controller
          name="dono.tomDeVoz"
          control={control}
          render={({ field, fieldState }) => (
            <>
              <div className="grid grid-cols-2 gap-2">
                {TONS.map((t) => {
                  const selected = field.value === t.value;
                  return (
                    <button
                      key={t.value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => field.onChange(t.value)}
                      className={cn(
                        'flex flex-col gap-1 rounded-xl border p-4 text-left transition-all min-h-touch',
                        'focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
                        selected
                          ? 'border-accent bg-accent-soft'
                          : 'border-border bg-bg-card hover:border-border-strong',
                      )}
                    >
                      <span className={cn('text-sm font-medium', selected ? 'text-fg' : 'text-fg')}>
                        {t.label}
                      </span>
                      <span className="text-xs text-fg-muted">{t.desc}</span>
                    </button>
                  );
                })}
              </div>
              {fieldState.error?.message && (
                <p className="field-error mt-2" role="alert">
                  <span aria-hidden="true">⚠</span> {fieldState.error.message}
                </p>
              )}
            </>
          )}
        />
      </div>
    </div>
  );
}
