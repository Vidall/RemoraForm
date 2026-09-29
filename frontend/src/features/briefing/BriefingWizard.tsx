import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BriefingSchema, type BriefingData } from '@remora/core';

import { useWizardStep } from './WizardStepContext';
import { WizardStepper } from './components/WizardStepper';
import { WizardNav } from './components/WizardNav';
import { WizardSuccess } from './components/WizardSuccess';
import { StepNegocioBasico } from './steps/StepNegocioBasico';
import { StepNegocioDescricao } from './steps/StepNegocioDescricao';
import { StepContato } from './steps/StepContato';
import { StepIdentidade } from './steps/StepIdentidade';
import { StepHeroi } from './steps/StepHeroi';
import { StepProdutos } from './steps/StepProdutos';
import { StepProvasSociais } from './steps/StepProvasSociais';
import { StepMeta } from './steps/StepMeta';
import { TOTAL_STEPS } from './wizard-config';
import { useWizardNavigation } from './useWizardNavigation';
import { useBriefingSubmit } from './useBriefingSubmit';

const DEFAULT_VALUES: BriefingData = {
  negocio: {
    nome: '',
    segmento: 'perfumaria',
    descricao: '',
    slogan: '',
  },
  contato: {
    whatsapp: '',
    instagram: undefined,
    email: undefined,
    endereco: undefined,
  },
  identidadeVisual: {
    corPrimaria: '#C9A227',
    corSecundaria: '#141418',
    tema: 'escuro',
    estiloFonte: 'moderno',
  },
  heroi: {
    titulo: '',
    subtitulo: '',
    textoCTA: '',
    imagemHero: '',
  },
  produtos: [
    {
      nome: '',
      descricao: '',
      preco: '',
      destaque: false,
    },
  ],
  provasSociais: [],
  meta: {
    nomeCliente: '',
    slugSubdominio: '',
    observacoes: undefined,
  },
};

/**
 * Orquestrador do wizard de briefing:
 *  - RHF + zodResolver validando contra BriefingSchema (@remora/core)
 *  - Navegação por steps com validação parcial
 *  - Submit com mapeamento de erros do backend
 *  - Sucesso troca o shell para WizardSuccess
 */
export function BriefingWizard() {
  const form = useForm<BriefingData>({
    resolver: zodResolver(BriefingSchema),
    mode: 'onBlur',
    defaultValues: DEFAULT_VALUES,
  });

  const { currentIndex, currentStepId, isLast, goNext, goBack } =
    useWizardNavigation(form);
  const { isSubmitting, submitError, successData, submit } = useBriefingSubmit(form);

  const { setCurrentIndex } = useWizardStep();
  useEffect(() => {
    setCurrentIndex(currentIndex);
  }, [currentIndex, setCurrentIndex]);

  if (successData) {
    return <WizardSuccess response={successData} />;
  }

  async function handleSubmit() {
    const isValid = await form.trigger(undefined, { shouldFocus: true });
    if (!isValid) return;
    const values = form.getValues();
    await submit(values);
  }

  function renderStep() {
    switch (currentStepId) {
      case 'negocio-1':
        return <StepNegocioBasico />;
      case 'negocio-2':
        return <StepNegocioDescricao />;
      case 'contato':
        return <StepContato />;
      case 'identidade':
        return <StepIdentidade />;
      case 'heroi':
        return <StepHeroi />;
      case 'produtos':
        return <StepProdutos />;
      case 'provas':
        return <StepProvasSociais />;
      case 'meta':
        return <StepMeta />;
      default:
        return null;
    }
  }

  return (
    <div className="flex flex-col">
      {/* Stepper de progresso */}
      <div className="w-full px-4 pt-4 md:pt-6">
        <div className="mx-auto w-full max-w-wizard">
          <WizardStepper currentIndex={currentIndex} />
        </div>
      </div>

      {/* Corpo do step */}
      <section className="flex-1 w-full px-4 py-6 md:py-10">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="mx-auto w-full max-w-wizard"
          noValidate
        >
          <FormProvider {...form}>{renderStep()}</FormProvider>

          {submitError && (
            <div
              className="mt-6 rounded-xl border border-danger/40 bg-danger/10 p-4"
              role="alert"
            >
              <p className="text-sm text-danger">{submitError}</p>
            </div>
          )}
        </form>
      </section>

      {/* Nav sticky */}
      <div className="w-full">
        <WizardNav
          currentIndex={currentIndex}
          totalSteps={TOTAL_STEPS}
          onBack={goBack}
          onNext={goNext}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          isLast={isLast}
        />
      </div>
    </div>
  );
}
