import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import type { BriefingData } from '@remora/core';
import { Button, Input, Textarea, Toggle } from '@/components/ui';
import { cn } from '@/lib/cn';

const EMPTY_PRODUTO = {
  nome: '',
  descricao: '',
  preco: '',
  destaque: false,
};

export function StepProdutos() {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext<BriefingData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'produtos',
  });

  const arrayError = errors.produtos?.message ?? errors.produtos?.root?.message;
  const produtosWatch = watch('produtos') ?? [];

  return (
    <div className="space-y-4 animate-fade-in">
      {fields.length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-bg-card p-6 text-center">
          <p className="text-sm text-fg-muted">
            Nenhum produto cadastrado ainda. Adicione o primeiro abaixo.
          </p>
        </div>
      )}

      {fields.map((field, index) => {
        const err = errors.produtos?.[index];
        const nome = produtosWatch[index]?.nome ?? '';
        const desc = produtosWatch[index]?.descricao ?? '';
        return (
          <div
            key={field.id}
            className={cn(
              'rounded-2xl border border-border bg-bg-card p-4 md:p-5',
              'animate-fade-in',
            )}
          >
            <div className="flex items-center justify-between gap-3 mb-4">
              <span className="text-xs uppercase tracking-wider text-fg-muted">
                Produto {index + 1}
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
                label="Nome do produto"
                placeholder="Ex: Perfume Íris Noir 100ml"
                maxLength={80}
                showCounter
                currentLength={nome.length}
                error={err?.nome?.message}
                {...register(`produtos.${index}.nome`)}
              />
              <Textarea
                label="Descrição"
                placeholder="Detalhe o produto — notas, uso, diferencial."
                maxLength={300}
                showCounter
                currentLength={desc.length}
                rows={3}
                error={err?.descricao?.message}
                {...register(`produtos.${index}.descricao`)}
              />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  label="Preço"
                  placeholder="R$ 249,00"
                  error={err?.preco?.message}
                  {...register(`produtos.${index}.preco`)}
                />
                <div className="flex items-end">
                  <div className="w-full rounded-xl border border-border bg-bg-elevated px-4 py-2">
                    <Controller
                      name={`produtos.${index}.destaque`}
                      control={control}
                      render={({ field }) => (
                        <Toggle
                          id={`produto-${index}-destaque`}
                          label="Marcar como destaque"
                          description="Aparece em posição privilegiada."
                          checked={!!field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
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
        onClick={() => append(EMPTY_PRODUTO)}
        disabled={fields.length >= 10}
      >
        + Adicionar produto {fields.length > 0 && `(${fields.length}/10)`}
      </Button>
    </div>
  );
}
