import { createContext, useContext } from 'react';

interface WizardStepContextValue {
  currentIndex: number;
  setCurrentIndex: (i: number) => void;
}

export const WizardStepContext = createContext<WizardStepContextValue>({
  currentIndex: 0,
  setCurrentIndex: () => {},
});

export function useWizardStep() {
  return useContext(WizardStepContext);
}
