import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import type { BriefingData } from '@remora/core';
import { Input, Textarea } from '@/components/ui';
import { slugify } from '@/lib/slug';

export function StepMeta() {
  const {
    register,
    watch,
    setValue,
    formState: { errors, dirtyFields },
  } = useFormContext<BriefingData>();

  const nomeCliente = watch('meta.nomeCliente') ?? '';
  const slug = watch('meta.slugSubdominio') ?? '';
  const observacoes = watch('meta.observacoes') ?? '';
  const nomeNegocio = watch('negocio.nome') ?? '';
  const slugDirty = dirtyFields.meta?.slugSubdominio ?? false;

  // Auto-sugere slug a partir do nome do negócio se o usuário
  // ainda não editou o campo manualmente.
  useEffect(() => {
    if (!slugDirty && nomeNegocio) {
      const suggested = slugify(nomeNegocio);
      if (suggested && suggested !== slug) {
        setValue('meta.slugSubdominio', suggested, { shouldValidate: false });
      }
    }
  }, [nomeNegocio, slugDirty, setValue, slug]);

  return (
    <div className="space-y-6 animate-fade-in">
      <Input
        label="Seu nome (cliente)"
        placeholder="Ex: Ana Souza"
        error={errors.meta?.nomeCliente?.message}
        hint="Só para contato interno — não aparece na landing."
        {...register('meta.nomeCliente')}
      />

      <div>
        <Input
          label="Endereço do seu subdomínio"
          placeholder="perfumaria-da-ana"
          autoCapitalize="none"
          autoCorrect="off"
          error={errors.meta?.slugSubdominio?.message}
          suffix=".remoralink.com"
          {...register('meta.slugSubdominio')}
        />
        {slug && !errors.meta?.slugSubdominio && (
          <div className="mt-2 rounded-lg border border-border bg-bg-elevated px-3 py-2">
            <p className="text-xs text-fg-muted">
              Sua landing ficará em:{' '}
              <span className="font-medium text-accent break-all">
                {slug}.remoralink.com
              </span>
            </p>
          </div>
        )}
      </div>

      <Textarea
        label="Observações (opcional)"
        placeholder="Alguma preferência específica, referência de site que gosta, algo a evitar…"
        maxLength={1000}
        showCounter
        currentLength={observacoes.length}
        rows={4}
        error={errors.meta?.observacoes?.message}
        {...register('meta.observacoes')}
      />

      <div className="rounded-xl border border-accent/30 bg-accent-soft p-4">
        <p className="text-sm text-fg">
          <strong className="text-accent">Pronto para enviar?</strong> Ao clicar em
          "Enviar briefing" você finaliza o processo e recebe uma cópia por WhatsApp.
        </p>
        <p className="mt-1 text-xs text-fg-muted">
          <strong className="text-fg">Cliente:</strong>{' '}
          {nomeCliente || 'ainda não preenchido'}
        </p>
      </div>
    </div>
  );
}
