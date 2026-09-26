import type { BriefingResponse } from '@remora/core';
import { Card } from '@/components/ui';

interface WizardSuccessProps {
  response: BriefingResponse;
}

export function WizardSuccess({ response }: WizardSuccessProps) {
  return (
    <div className="mx-auto w-full max-w-wizard px-4 py-10 md:py-16 animate-fade-in">
      <div className="text-center mb-8">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft border border-accent">
          <svg viewBox="0 0 24 24" className="h-8 w-8 text-accent" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl leading-tight text-fg">
          Briefing enviado!
        </h1>
        <p className="mt-3 text-sm md:text-base text-fg-muted">
          Recebemos suas informações. Em breve você recebe uma prévia da sua landing.
        </p>
      </div>

      <Card>
        <dl className="space-y-3 text-sm">
          <div className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-1">
            <dt className="text-fg-muted">Protocolo</dt>
            <dd className="font-mono text-fg break-all">{response.id}</dd>
          </div>
          <div className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-1">
            <dt className="text-fg-muted">Subdomínio reservado</dt>
            <dd className="text-accent break-all">
              {response.slugSubdominio}.remoralink.com
            </dd>
          </div>
          <div className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-1">
            <dt className="text-fg-muted">Status</dt>
            <dd className="text-fg capitalize">{response.status}</dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}
