import { useFormContext, Controller, useWatch } from 'react-hook-form';
import type { BriefingData, Segmento } from '@remora/core';
import { Input } from '@/components/ui';
import { SEGMENTOS_META, findSegmentoMeta } from '@/lib/segmento';
import { cn } from '@/lib/cn';
import {
  SEGMENT_PLACEHOLDERS,
  DEFAULT_PLACEHOLDERS,
} from '../config/segment-placeholders';

/**
 * Step I — Negócio (parte 1/2)
 * Campos: nome + segmento.
 * Interatividade: ao selecionar segmento, mostra card de feedback
 * com ícone + cor característica.
 */
export function StepNegocioBasico() {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<BriefingData>();

  const nomeValue = watch('negocio.nome') ?? '';
  const segmentoValue = useWatch({ control, name: 'negocio.segmento' }) as
    | Segmento
    | undefined;
  const meta = findSegmentoMeta(segmentoValue);
  const placeholders = segmentoValue
    ? (SEGMENT_PLACEHOLDERS[segmentoValue] ?? DEFAULT_PLACEHOLDERS)
    : DEFAULT_PLACEHOLDERS;

  return (
    <div className="space-y-6 animate-fade-in">
      <Input
        label="Nome do negócio"
        placeholder={placeholders.negocioNome}
        maxLength={80}
        showCounter
        currentLength={nomeValue.length}
        error={errors.negocio?.nome?.message}
        {...register('negocio.nome')}
      />

      <div>
        <span className="field-label">Segmento</span>
        <Controller
          name="negocio.segmento"
          control={control}
          render={({ field, fieldState }) => (
            <>
              <div
                role="radiogroup"
                aria-label="Segmento do negócio"
                className="grid grid-cols-1 gap-2 sm:grid-cols-2"
              >
                {SEGMENTOS_META.map((seg) => {
                  const selected = field.value === seg.value;
                  return (
                    <button
                      key={seg.value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => field.onChange(seg.value)}
                      className={cn(
                        'flex items-center gap-3 rounded-xl border p-4 text-left transition-all',
                        'min-h-touch',
                        'focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
                        selected
                          ? 'border-accent bg-accent-soft'
                          : 'border-border bg-bg-card hover:border-border-strong',
                      )}
                    >
                      <span
                        className={cn(
                          'text-2xl transition-transform',
                          selected && 'scale-110',
                          seg.colorClass,
                        )}
                        aria-hidden="true"
                      >
                        {seg.emoji}
                      </span>
                      <div className="min-w-0 flex-1">
                        <span
                          className={cn(
                            'block text-sm font-medium',
                            selected ? 'text-fg' : 'text-fg',
                          )}
                        >
                          {seg.label}
                        </span>
                        <span className="mt-0.5 block text-xs text-fg-muted truncate">
                          {seg.hint}
                        </span>
                      </div>
                      <span
                        aria-hidden="true"
                        className={cn(
                          'h-4 w-4 rounded-full border-2 shrink-0 transition-colors',
                          selected ? 'border-accent bg-accent' : 'border-border-strong',
                        )}
                      />
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

      {meta && (
        <div
          key={meta.value}
          className="rounded-xl border border-border bg-bg-elevated p-4 animate-slide-in"
        >
          <div className="flex items-start gap-3">
            <span className={cn('text-2xl', meta.colorClass)} aria-hidden="true">
              {meta.emoji}
            </span>
            <div>
              <p className="text-sm font-medium text-fg">
                Vamos criar uma landing focada em{' '}
                <span className={meta.colorClass}>{meta.label.toLowerCase()}</span>.
              </p>
              <p className="mt-1 text-xs text-fg-muted">
                Nas próximas telas vamos afinar identidade visual e destaques.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
