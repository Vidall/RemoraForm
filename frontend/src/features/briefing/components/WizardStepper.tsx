import { cn } from '@/lib/cn';
import { WIZARD_STEPS, TOTAL_STEPS } from '../wizard-config';

interface WizardStepperProps {
  currentIndex: number;
}

/**
 * Stepper mobile-first:
 *  - Mobile: "Passo X de N" + barra de progresso compacta
 *  - Desktop (md+): numerais romanos + linha conectora entre eles
 *
 * Regra: no mobile a densidade de info é mínima; só escalamos
 * a partir de md:.
 */
export function WizardStepper({ currentIndex }: WizardStepperProps) {
  const currentMeta = WIZARD_STEPS[currentIndex];
  const progressPct = ((currentIndex + 1) / TOTAL_STEPS) * 100;

  return (
    <div className="w-full">
      {/* --- Mobile: contador + barra de progresso --- */}
      <div className="md:hidden">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium tracking-wide uppercase text-fg-muted">
            Passo {currentIndex + 1} de {TOTAL_STEPS}
          </span>
          <span className="text-accent tabular-nums font-medium">
            {Math.round(progressPct)}%
          </span>
        </div>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-border">
          <div
            className="h-full bg-accent transition-[width] duration-300 ease-out"
            style={{ width: `${progressPct}%` }}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progressPct)}
          />
        </div>
      </div>

      {/* --- Desktop (md+): numerais romanos com linha conectora --- */}
      <div className="hidden md:block">
        <ol className="flex items-center justify-between gap-2">
          {WIZARD_STEPS.map((step, i) => {
            const done = i < currentIndex;
            const active = i === currentIndex;
            return (
              <li key={step.id} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <span
                    aria-current={active ? 'step' : undefined}
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-full border font-serif text-sm',
                      'transition-colors duration-200',
                      done && 'border-accent bg-accent text-bg',
                      active && 'border-accent text-accent bg-accent-soft',
                      !done && !active && 'border-border text-fg-subtle',
                    )}
                  >
                    {step.numeral}
                  </span>
                  <span
                    className={cn(
                      'mt-2 text-[10px] font-medium uppercase tracking-wider',
                      active ? 'text-fg' : 'text-fg-subtle',
                    )}
                  >
                    {step.id.split('-')[0]}
                  </span>
                </div>
                {i < TOTAL_STEPS - 1 && (
                  <div
                    className={cn(
                      'mx-2 h-px flex-1 transition-colors duration-300',
                      i < currentIndex ? 'bg-accent' : 'bg-border',
                    )}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {/* --- Título e subtítulo do step atual --- */}
      <div className="mt-6 md:mt-8 animate-fade-in" key={currentMeta.id}>
        <h1 className="font-serif text-2xl md:text-3xl leading-tight text-fg">
          {currentMeta.title}
        </h1>
        <p className="mt-1.5 text-sm text-fg-muted">{currentMeta.subtitle}</p>
      </div>
    </div>
  );
}
