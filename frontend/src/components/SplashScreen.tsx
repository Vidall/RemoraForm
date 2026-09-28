import { useEffect, useState } from 'react';

const SPLASH_KEY = 'remora_splash_v1';

type Phase = 'idle' | 'in' | 'out' | 'done';

export function SplashScreen() {
  const [phase, setPhase] = useState<Phase>('idle');

  useEffect(() => {
    if (localStorage.getItem(SPLASH_KEY)) {
      setPhase('done');
      return;
    }

    const t1 = setTimeout(() => setPhase('in'), 60);
    const t2 = setTimeout(() => setPhase('out'), 2000);
    const t3 = setTimeout(() => {
      setPhase('done');
      localStorage.setItem(SPLASH_KEY, '1');
    }, 3000);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  if (phase === 'done') return null;

  const entering = phase === 'in';
  const exiting  = phase === 'out';

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0D0D0D]"
      style={{
        opacity: entering ? 1 : 0,
        transition: exiting
          ? 'opacity 900ms cubic-bezier(0.4, 0, 0.2, 1)'
          : 'opacity 350ms ease-out',
      }}
    >
      {/* Linha decorativa horizontal */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(201,162,39,0.2), transparent)',
          transform: `translateX(-50%) translateY(calc(-50% + 52px))`,
          opacity: entering ? 1 : 0,
          transition: 'opacity 600ms ease-out 300ms',
        }}
      />

      {/* Conteúdo central */}
      <div
        className="flex flex-col items-center gap-5"
        style={{
          opacity: entering ? 1 : 0,
          transform: exiting
            ? 'scale(0.93) translateY(4px)'
            : entering
              ? 'scale(1) translateY(0)'
              : 'scale(1.08) translateY(-4px)',
          transition: exiting
            ? 'opacity 800ms cubic-bezier(0.4, 0, 0.2, 1), transform 800ms cubic-bezier(0.4, 0, 0.2, 1)'
            : 'opacity 550ms cubic-bezier(0.16, 1, 0.3, 1), transform 550ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Logo sempre na versão branca — fundo é sempre escuro */}
        <img
          src="/logo-white.png"
          alt="RemoraLink"
          className="h-16 w-auto object-contain"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />

        {/* Separador dourado */}
        <div
          className="h-px w-24"
          style={{
            background: 'linear-gradient(90deg, transparent, #C9A227, transparent)',
            opacity: entering ? 0.7 : 0,
            transition: 'opacity 500ms ease-out 250ms',
          }}
        />

        {/* Tagline */}
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: '10px',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'rgba(201, 162, 39, 0.55)',
            opacity: entering ? 1 : 0,
            transition: 'opacity 500ms ease-out 350ms',
          }}
        >
          RemoraLink
        </span>
      </div>
    </div>
  );
}
