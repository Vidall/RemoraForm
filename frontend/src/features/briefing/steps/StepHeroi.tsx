import { useFormContext } from 'react-hook-form';
import type { BriefingData } from '@remora/core';
import { Input, Textarea } from '@/components/ui';

export function StepHeroi() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<BriefingData>();

  const titulo = watch('heroi.titulo') ?? '';
  const subtitulo = watch('heroi.subtitulo') ?? '';
  const cta = watch('heroi.textoCTA') ?? '';

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
        placeholder="Ex: Perfumes que contam histórias."
        maxLength={120}
        showCounter
        currentLength={titulo.length}
        error={errors.heroi?.titulo?.message}
        {...register('heroi.titulo')}
      />

      <Textarea
        label="Subtítulo"
        placeholder="Uma frase de apoio que complementa o título e reforça o valor."
        maxLength={220}
        showCounter
        currentLength={subtitulo.length}
        rows={3}
        error={errors.heroi?.subtitulo?.message}
        {...register('heroi.subtitulo')}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="Texto do botão (CTA)"
          placeholder="Falar no WhatsApp"
          maxLength={40}
          showCounter
          currentLength={cta.length}
          error={errors.heroi?.textoCTA?.message}
          {...register('heroi.textoCTA')}
        />

        <Input
          label="Nome do arquivo da imagem"
          placeholder="hero-perfumaria.jpg"
          error={errors.heroi?.imagemHero?.message}
          hint="Você enviará a imagem depois pelo WhatsApp."
          {...register('heroi.imagemHero')}
        />
      </div>
    </div>
  );
}
