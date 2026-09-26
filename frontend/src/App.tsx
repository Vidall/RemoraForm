import { BriefingWizard } from './features/briefing/BriefingWizard';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ThemeProvider } from './contexts/ThemeContext';

export function App() {
  return (
    <ThemeProvider>
    <div className="relative flex min-h-screen flex-col bg-bg transition-colors duration-300">
      {/* Efeito de grid técnico no fundo — sutil, não distrai */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#C9A227 1px, transparent 1px), linear-gradient(90deg, #C9A227 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
        aria-hidden="true"
      />

      <Header />

      <main className="relative flex-1 w-full">
        <BriefingWizard />
      </main>

      <Footer />
    </div>
    </ThemeProvider>
  );
}
