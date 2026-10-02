import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import type { BriefingData } from '@remora/core';
import { Button, Input, Textarea, StarRating } from '@/components/ui';

const EMPTY_PROVA = {
  nomeCliente: '',
  depoimento: '',
  avaliacao: 5,
};

export function StepProvasSociais() {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext<BriefingData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'provasSociais',
  });

  const arrayError = errors.provasSociais?.message ?? errors.provasSociais?.root?.message;
  const provas = watch('provasSociais') ?? [];

  return (
    <div className="space-y-4 animate-fade-in">
      <p className="text-sm text-fg-muted">
        Depoimentos aumentam confiança. Se ainda não tem, pode pular esta etapa.
      </p>

      {fields.map((field, index) => {
        const err = errors.provasSociais?.[index];
        const dep = provas[index]?.depoimento ?? '';
        return (
          <div
            key={field.id}
            className="rounded-2xl border border-border bg-bg-card p-4 md:p-5 animate-fade-in"
          >
            <div className="flex items-center justify-between gap-3 mb-4">
              <span className="text-xs uppercase tracking-wider text-fg-muted">
                Depoimento {index + 1}
              </span>
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-xs text-fg-muted hover:text-danger transition-colors min-h-touch px-2"
              >
                Remover
              </button>
            </div>

            <div className="space-y-4">
              <Input
                label="Nome do cliente"
                placeholder="Ex: Ana Souza"
                error={err?.nomeCliente?.message}
                {...register(`provasSociais.${index}.nomeCliente`)}
              />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  label="Profissão (opcional)"
                  placeholder="Ex: Advogada"
                  error={err?.profissao?.message}
                  {...register(`provasSociais.${index}.profissao`)}
                />
                <Input
                  label="Cidade (opcional)"
                  placeholder="Ex: São Paulo/SP"
                  error={err?.cidade?.message}
                  {...register(`provasSociais.${index}.cidade`)}
                />
              </div>
              <Textarea
                label="Depoimento"
                placeholder="O que o cliente disse sobre o negócio."
                maxLength={400}
                showCounter
                currentLength={dep.length}
                rows={3}
                error={err?.depoimento?.message}
                {...register(`provasSociais.${index}.depoimento`)}
              />
              <Controller
                name={`provasSociais.${index}.avaliacao`}
                control={control}
                render={({ field, fieldState }) => (
                  <StarRating
                    label="Avaliação"
                    value={field.value ?? 5}
                    onChange={field.onChange}
                    error={fieldState.error?.message}
                  />
                )}
              />
            </div>
          </div>
        );
      })}

      {arrayError && (
        <p className="field-error" role="alert">
          <span aria-hidden="true">⚠</span> {arrayError}
        </p>
      )}

      <Button
        variant="secondary"
        size="lg"
        fullWidth
        onClick={() => append(EMPTY_PROVA)}
        disabled={fields.length >= 5}
      >
        + Adicionar depoimento {fields.length > 0 && `(${fields.length}/5)`}
      </Button>
    </div>
  );
}
