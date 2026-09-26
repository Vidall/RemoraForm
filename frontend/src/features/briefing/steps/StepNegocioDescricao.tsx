import { useFormContext } from 'react-hook-form';
import type { BriefingData } from '@remora/core';
import { Input, Textarea } from '@/components/ui';

/**
 * Step II — Negócio (parte 2/2)
 * Campos: slogan + descrição. Separado do step I para respeitar
 * a regra de "máximo 3 campos por tela".
 */
export function StepNegocioDescricao() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<BriefingData>();

  const slogan = watch('negocio.slogan') ?? '';
  const descricao = watch('negocio.descricao') ?? '';

  return (
    <div className="space-y-6 animate-fade-in">
      <Input
        label="Slogan"
        placeholder="Ex: A essência da sua história."
        maxLength={120}
        showCounter
        currentLength={slogan.length}
        error={errors.negocio?.slogan?.message}
        hint="Uma frase curta e marcante."
        {...register('negocio.slogan')}
      />

      <Textarea
        label="Descrição do negócio"
        placeholder="Conte um pouco sobre o que o negócio faz, para quem, e o diferencial."
        maxLength={500}
        showCounter
        currentLength={descricao.length}
        rows={5}
        error={errors.negocio?.descricao?.message}
        {...register('negocio.descricao')}
      />
    </div>
  );
}
