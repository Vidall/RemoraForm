import { useFormContext, useWatch } from 'react-hook-form';
import type { BriefingData, Segmento } from '@remora/core';
import { Button, Input, Textarea } from '@/components/ui';
import {
  SEGMENT_PLACEHOLDERS,
  DEFAULT_PLACEHOLDERS,
} from '../config/segment-placeholders';

export function StepHeroi() {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<BriefingData>();

  const titulo = watch('heroi.titulo') ?? '';
  const subtitulo = watch('heroi.subtitulo') ?? '';
  const cta = watch('heroi.textoCTA') ?? '';
  const galeria = watch('heroi.galeria') ?? [''];

  function appendGaleria() {
    setValue('heroi.galeria', [...galeria, ''], { shouldValidate: true });
  }

  function removeGaleria(index: number) {
    setValue('heroi.galeria', galeria.filter((_, i) => i !== index), { shouldValidate: true });
  }

  const segmentoValue = useWatch({ control, name: 'negocio.segmento' }) as
    | Segmento
    | undefined;
  const placeholders = segmentoValue
    ? (SEGMENT_PLACEHOLDERS[segmentoValue] ?? DEFAULT_PLACEHOLDERS)
    : DEFAULT_PLACEHOLDERS;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Preview do hero */}
      <div className="rounded-2xl border border-border bg-bg-elevated p-5 md:p-6">
        <p className="text-[11px] uppercase tracking-widest text-fg-subtle mb-3">
          Preview do hero
        </p>
        <h3 className="font-serif text-2xl md:text-3xl leading-tight text-fg">
          {titulo || 'Título da sua hero aparece aqui'}
        </h3>
        <p className="mt-2 text-sm md:text-base text-fg-muted">
          {subtitulo || 'O subtítulo complementa a promessa principal.'}
        </p>
        <button
          type="button"
          tabIndex={-1}
          className="mt-4 inline-flex items-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg pointer-events-none"
        >
          {cta || 'Chamada para ação'}
        </button>
      </div>

      <Input
        label="Título principal"
        placeholder={placeholders.heroTitulo}
        maxLength={120}
        showCounter
        currentLength={titulo.length}
        error={errors.heroi?.titulo?.message}
        {...register('heroi.titulo')}
      />

      <Textarea
        label="Subtítulo"
        placeholder={placeholders.heroSubtitulo}
        maxLength={220}
        showCounter
        currentLength={subtitulo.length}
        rows={3}
        error={errors.heroi?.subtitulo?.message}
        {...register('heroi.subtitulo')}
      />

      <Input
        label="Texto do botão (CTA)"
        placeholder="Falar no WhatsApp"
        maxLength={40}
        showCounter
        currentLength={cta.length}
        error={errors.heroi?.textoCTA?.message}
        {...register('heroi.textoCTA')}
      />

      <div>
        <span className="field-label">Galeria de imagens</span>
        <p className="text-xs text-fg-muted mb-3">
          Nomes dos arquivos que você vai enviar pelo WhatsApp. A primeira é usada como fundo do hero.
        </p>

        <div className="space-y-2">
          {galeria.map((_, index) => {
            const err = (errors.heroi?.galeria as Record<number, { message?: string }> | undefined)?.[index];
            return (
              <div key={index} className="flex items-start gap-2">
                <div className="flex-1">
                  <Input
                    label={index === 0 ? 'Imagem principal (hero)' : `Imagem ${index + 1}`}
                    placeholder={index === 0 ? 'hero-principal.jpg' : `foto-${index + 1}.jpg`}
                    error={err?.message}
                    {...register(`heroi.galeria.${index}`)}
                  />
                </div>
                {galeria.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeGaleria(index)}
                    className="mt-6 text-xs text-fg-muted hover:text-danger transition-colors min-h-touch px-2"
                  >
                    Remover
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {errors.heroi?.galeria?.message && (
          <p className="field-error mt-2" role="alert">
            <span aria-hidden="true">⚠</span> {errors.heroi.galeria.message}
          </p>
        )}

        {galeria.length < 6 && (
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={appendGaleria}
            className="mt-3"
          >
            + Adicionar imagem ({galeria.length}/6)
          </Button>
        )}
      </div>
    </div>
  );
}
