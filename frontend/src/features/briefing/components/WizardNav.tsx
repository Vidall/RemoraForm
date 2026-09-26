import { Button } from '@/components/ui';

interface WizardNavProps {
  currentIndex: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  /** true no último step — troca o CTA para "Enviar briefing". */
  isLast: boolean;
  /** Permite desabilitar o avanço quando validação sync está falhando. */
  canProceed?: boolean;
}

/**
 * Navegação inferior do wizard.
 * Mobile-first: botões grandes, empilhados verticalmente em telas curtas.
 * Sticky no bottom no mobile para ficar sempre acessível.
 */
export function WizardNav({
  currentIndex,
  totalSteps,
  onBack,
  onNext,
  onSubmit,
  isSubmitting,
  isLast,
  canProceed = true,
}: WizardNavProps) {
  const isFirst = currentIndex === 0;

  return (
    <div
      className="
        sticky bottom-0 left-0 right-0 z-10
        border-t border-border bg-bg/95 backdrop-blur
        px-4 py-4
        md:static md:border-0 md:bg-transparent md:backdrop-blur-0 md:px-0 md:py-0 md:mt-8
      "
    >
      <div className="mx-auto max-w-wizard flex flex-col-reverse gap-3 md:flex-row md:items-center md:justify-between">
        <Button
          variant="secondary"
          size="lg"
          onClick={onBack}
          disabled={isFirst || isSubmitting}
          fullWidth
          className="md:w-auto"
        >
          Voltar
        </Button>

        {isLast ? (
          <Button
            variant="primary"
            size="lg"
            onClick={onSubmit}
            isLoading={isSubmitting}
            disabled={!canProceed}
            fullWidth
            className="md:w-auto"
          >
            {isSubmitting ? 'Enviando…' : 'Enviar briefing'}
          </Button>
        ) : (
          <Button
            variant="primary"
            size="lg"
            onClick={onNext}
            disabled={!canProceed || isSubmitting}
            fullWidth
            className="md:w-auto"
          >
            Continuar
          </Button>
        )}
      </div>

      <p className="mt-3 text-center text-[11px] text-fg-subtle md:hidden">
        {currentIndex + 1} / {totalSteps}
      </p>
    </div>
  );
}
