import { Controller, useFormContext } from 'react-hook-form';
import type { BriefingData, EstiloFonte, Tema } from '@remora/core';
import { ColorPicker } from '@/components/ui';
import { cn } from '@/lib/cn';

const TEMAS: Array<{ value: Tema; label: string; preview: string }> = [
  { value: 'claro', label: 'Claro', preview: 'bg-[#F5F5F0] text-[#141418]' },
  { value: 'escuro', label: 'Escuro', preview: 'bg-[#141418] text-[#F5F5F0]' },
];

const ESTILOS: Array<{ value: EstiloFonte; label: string; className: string }> = [
  { value: 'moderno', label: 'Moderno', className: 'font-sans font-medium tracking-tight' },
  { value: 'elegante', label: 'Elegante', className: 'font-serif italic' },
  { value: 'bold', label: 'Bold', className: 'font-sans font-bold tracking-tight' },
  { value: 'minimalista', label: 'Minimalista', className: 'font-sans font-light tracking-wide' },
];

/**
 * Step IV — Identidade visual.
 * Interatividade:
 *  - ColorPickers atualizam o mini-card de preview em tempo real.
 *  - Escolher tema muda o preview.
 *  - Cada estilo de fonte é rendered com sua própria classe.
 */
export function StepIdentidade() {
  const { control, watch } = useFormContext<BriefingData>();

  const corPrimaria = watch('identidadeVisual.corPrimaria') ?? '#C9A227';
  const corSecundaria = watch('identidadeVisual.corSecundaria') ?? '#141418';
  const tema = (watch('identidadeVisual.tema') ?? 'escuro') as Tema;
  const estilo = (watch('identidadeVisual.estiloFonte') ?? 'moderno') as EstiloFonte;

  const estiloMeta = ESTILOS.find((e) => e.value === estilo) ?? ESTILOS[0];
  const temaMeta = TEMAS.find((t) => t.value === tema) ?? TEMAS[1];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Mini preview em tempo real */}
      <div
        className={cn(
          'rounded-2xl border border-border p-5 transition-colors',
          temaMeta.preview,
        )}
        aria-label="Preview da identidade visual"
      >
        <p className="text-[11px] uppercase tracking-widest opacity-60 mb-2">Preview</p>
        <h3 className={cn('text-2xl leading-tight', estiloMeta.className)}>
          Sua marca em destaque
        </h3>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium"
            style={{ backgroundColor: corPrimaria, color: '#0A0A0A' }}
          >
            Primária
          </span>
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium"
            style={{ backgroundColor: corSecundaria, color: '#F5F5F0' }}
          >
            Secundária
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Controller
          name="identidadeVisual.corPrimaria"
          control={control}
          render={({ field, fieldState }) => (
            <ColorPicker
              label="Cor primária"
              value={field.value ?? ''}
              onChange={field.onChange}
              error={fieldState.error?.message}
              hint="Usada em botões e destaques."
            />
          )}
        />
        <Controller
          name="identidadeVisual.corSecundaria"
          control={control}
          render={({ field, fieldState }) => (
            <ColorPicker
              label="Cor secundária"
              value={field.value ?? ''}
              onChange={field.onChange}
              error={fieldState.error?.message}
              hint="Usada em fundos e apoio."
            />
          )}
        />
      </div>

      <div>
        <span className="field-label">Tema base</span>
        <Controller
          name="identidadeVisual.tema"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-2">
              {TEMAS.map((t) => {
                const selected = field.value === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => field.onChange(t.value)}
                    className={cn(
                      'min-h-touch rounded-xl border p-4 text-left transition-all',
                      'focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
                      selected ? 'border-accent bg-accent-soft' : 'border-border bg-bg-card',
                    )}
                  >
                    <div className={cn('mb-2 h-8 rounded-md', t.preview)} />
                    <span className="text-sm font-medium">{t.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        />
      </div>

      <div>
        <span className="field-label">Estilo tipográfico</span>
        <Controller
          name="identidadeVisual.estiloFonte"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {ESTILOS.map((e) => {
                const selected = field.value === e.value;
                return (
                  <button
                    key={e.value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => field.onChange(e.value)}
                    className={cn(
                      'min-h-touch rounded-xl border p-3 text-center transition-all',
                      'focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
                      selected ? 'border-accent bg-accent-soft' : 'border-border bg-bg-card',
                    )}
                  >
                    <span className={cn('block text-lg text-fg', e.className)}>Aa</span>
                    <span className="mt-1 block text-[11px] uppercase tracking-wider text-fg-muted">
                      {e.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        />
      </div>
    </div>
  );
}
