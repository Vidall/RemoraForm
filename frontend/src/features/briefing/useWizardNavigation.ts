import { useCallback, useState } from 'react';
import type { UseFormReturn, FieldPath } from 'react-hook-form';
import type { BriefingData } from '@remora/core';
import { WIZARD_STEPS, TOTAL_STEPS } from './wizard-config';

/**
 * Campos que cada step do wizard precisa validar antes de avançar.
 * Mantido lado-a-lado com WIZARD_STEPS: se um step for adicionado
 * ou renomeado, atualizar AQUI também.
 */
const FIELDS_PER_STEP: Record<string, FieldPath<BriefingData>[]> = {
  'negocio-1': ['negocio.nome', 'negocio.segmento'],
  'negocio-2': ['negocio.slogan', 'negocio.descricao'],
  contato: [
    'contato.whatsapp',
    'contato.instagram',
    'contato.email',
    'contato.endereco',
  ],
  identidade: [
    'identidadeVisual.corPrimaria',
    'identidadeVisual.corSecundaria',
    'identidadeVisual.tema',
    'identidadeVisual.estiloFonte',
  ],
  heroi: ['heroi.titulo', 'heroi.subtitulo', 'heroi.textoCTA', 'heroi.imagemHero'],
  produtos: ['produtos'],
  provas: ['provasSociais'],
  meta: ['meta.nomeCliente', 'meta.slugSubdominio', 'meta.observacoes'],
};

interface UseWizardNavigationReturn {
  currentIndex: number;
  currentStepId: string;
  isFirst: boolean;
  isLast: boolean;
  goNext: () => Promise<boolean>;
  goBack: () => void;
  goTo: (index: number) => void;
}

export function useWizardNavigation(
  form: UseFormReturn<BriefingData>,
): UseWizardNavigationReturn {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentStepId = WIZARD_STEPS[currentIndex].id;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === TOTAL_STEPS - 1;

  const goNext = useCallback(async () => {
    const fields = FIELDS_PER_STEP[currentStepId] ?? [];
    const isValid = await form.trigger(fields, { shouldFocus: true });
    if (!isValid) return false;
    if (currentIndex < TOTAL_STEPS - 1) {
      setCurrentIndex((i) => i + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return true;
  }, [currentIndex, currentStepId, form]);

  const goBack = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentIndex]);

  const goTo = useCallback((index: number) => {
    if (index >= 0 && index < TOTAL_STEPS) {
      setCurrentIndex(index);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return { currentIndex, currentStepId, isFirst, isLast, goNext, goBack, goTo };
}
