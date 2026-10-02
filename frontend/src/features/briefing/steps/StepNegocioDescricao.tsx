import { useFormContext } from 'react-hook-form';
import type { BriefingData } from '@remora/core';
import { Input, Textarea } from '@/components/ui';

export function StepNegocioDescricao() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<BriefingData>();

  const descricao = watch('negocio.descricao') ?? '';
  const publicoAlvo = watch('negocio.publicoAlvo') ?? '';

  return (
    <div className="space-y-6 animate-fade-in">
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

      <Input
        label="Público-alvo"
        placeholder="Ex: Homens e mulheres de 25 a 45 anos que valorizam perfumaria de qualidade"
        maxLength={200}
        showCounter
        currentLength={publicoAlvo.length}
        hint="Para quem é o seu negócio? Seja específico."
        error={errors.negocio?.publicoAlvo?.message}
        {...register('negocio.publicoAlvo')}
      />
    </div>
  );
}
