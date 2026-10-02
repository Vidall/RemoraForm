import { useFormContext } from 'react-hook-form';
import type { BriefingData } from '@remora/core';
import { Button, Input } from '@/components/ui';

export function StepDiferenciais() {
  const {
    watch,
    setValue,
    register,
    formState: { errors },
  } = useFormContext<BriefingData>();

  const diferenciais = watch('negocio.diferenciais') ?? ['', ''];
  const arrayError =
    errors.negocio?.diferenciais?.message ??
    (errors.negocio?.diferenciais as { root?: { message?: string } } | undefined)?.root?.message;

  function handleAdd() {
    setValue('negocio.diferenciais', [...diferenciais, ''], { shouldValidate: true });
  }

  function handleRemove(index: number) {
    setValue(
      'negocio.diferenciais',
      diferenciais.filter((_, i) => i !== index),
      { shouldValidate: true },
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <p className="text-sm text-fg-muted">
        O que te separa da concorrência? Frases curtas e concretas — vão aparecer como destaques na sua landing.
      </p>

      {diferenciais.map((_, index) => {
        const err = (errors.negocio?.diferenciais as Record<number, { message?: string }> | undefined)?.[index];
        return (
          <div key={index} className="flex items-start gap-2">
            <div className="flex-1">
              <Input
                label={`Diferencial ${index + 1}`}
                placeholder={
                  index === 0
                    ? 'Ex: Importação direta — sem atravessadores'
                    : index === 1
                    ? 'Ex: 100% originais, garantia de autenticidade'
                    : 'Ex: Envio para todo o Brasil'
                }
                maxLength={120}
                error={err?.message}
                {...register(`negocio.diferenciais.${index}`)}
              />
            </div>
            {diferenciais.length > 2 && (
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="mt-6 text-xs text-fg-muted hover:text-danger transition-colors min-h-touch px-2"
              >
                Remover
              </button>
            )}
          </div>
        );
      })}

      {arrayError && (
        <p className="field-error" role="alert">
          <span aria-hidden="true">⚠</span> {arrayError}
        </p>
      )}

      {diferenciais.length < 4 && (
        <Button variant="secondary" size="lg" fullWidth onClick={handleAdd}>
          + Adicionar diferencial ({diferenciais.length}/4)
        </Button>
      )}
    </div>
  );
}
