import { useTheme } from '../../contexts/ThemeContext';

/**
 * Header da aplicação RemoraPages.
 *
 * Logo adaptativa: logo-white.png no tema escuro, logo-black.png no claro.
 * Botão de toggle no canto superior direito.
 */
export function Header() {
  const { theme, toggle } = useTheme();

  return (
    <header className="w-full">
      {/* ── Topbar ─────────────────────────────────────────────── */}
      <div className="w-full border-b border-border bg-bg-card/60 backdrop-blur-sm">
        <div className="mx-auto flex max-w-wizard items-center justify-between px-4 py-3">

          {/* Logo adaptativa + nome empresa */}
          <div className="flex items-center gap-3">
            {/* Logo branca — visível só no modo escuro */}
            <img
              src="/logo-white.png"
              alt="RemoraLink"
              className="h-7 w-auto object-contain dark:block hidden"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
            {/* Logo preta — visível só no modo claro */}
            <img
              src="/logo-black.png"
              alt="RemoraLink"
              className="h-7 w-auto object-contain block dark:hidden"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
            <span className="font-serif text-base font-semibold tracking-tight text-fg">
              RemoraLink
            </span>
          </div>

          {/* Direita: badge + botão tema */}
          <div className="flex items-center gap-3">
            {/* Badge RemoraPages */}
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium tracking-widest text-accent uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              RemoraPages
            </span>

            {/* Botão toggle tema */}
            <button
              onClick={toggle}
              aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
              title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-bg-card text-fg-muted transition-all duration-200 hover:border-accent/40 hover:text-accent hover:bg-accent/10 focus-visible:ring-2 focus-visible:ring-accent"
            >
              {theme === 'dark' ? (
                /* Ícone Sol — indica "clique para claro" */
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <circle cx="12" cy="12" r="4" />
                  <path strokeLinecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              ) : (
                /* Ícone Lua — indica "clique para escuro" */
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Divisor técnico com gradiente ──────────────────────── */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-accent/60 to-transparent" />

      {/* ── Bloco hero ─────────────────────────────────────────── */}
      <div className="w-full bg-gradient-to-b from-bg-card/40 to-transparent px-4 pb-8 pt-10">
        <div className="mx-auto max-w-wizard">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-fg-subtle">
            — Briefing · RemoraPages by RemoraLink
          </p>
          <h1 className="font-serif text-3xl font-semibold leading-tight tracking-tight text-fg md:text-4xl">
            Vamos criar sua{' '}
            <span className="text-accent">landing page</span>
          </h1>
          <p className="mt-3 text-base leading-relaxed text-fg-muted md:text-lg">
            Responda algumas perguntas sobre o seu negócio.
            Leva apenas{' '}
            <span className="text-fg font-medium">alguns minutos</span>{' '}
            e nos dá tudo que precisamos para entregar algo incrível.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-fg-subtle">
            <span className="flex items-center gap-1.5">
              <span className="h-1 w-4 rounded-full bg-accent/60" />
              8 etapas rápidas
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1 w-4 rounded-full bg-accent/60" />
              Sem cadastro necessário
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1 w-4 rounded-full bg-accent/60" />
              Dados salvos com segurança
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
