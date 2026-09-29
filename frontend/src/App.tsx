import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { BriefingWizard } from './features/briefing/BriefingWizard';
import { WizardStepContext } from './features/briefing/WizardStepContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { SplashScreen } from './components/SplashScreen';
import { ThemeProvider } from './contexts/ThemeContext';
import { AdminProtectedRoute } from './features/admin/AdminProtectedRoute';
import { AdminLoginPage } from './features/admin/pages/AdminLoginPage';
import { AdminBriefingsListPage } from './features/admin/pages/AdminBriefingsListPage';
import { AdminBriefingDetailPage } from './features/admin/pages/AdminBriefingDetailPage';

/**
 * Shell da rota pública — mantém o layout original do wizard.
 * Admin usa layout próprio (definido em cada página).
 */
function PublicShell() {
  const [wizardStepIndex, setWizardStepIndex] = useState(0);

  return (
    <WizardStepContext.Provider
      value={{ currentIndex: wizardStepIndex, setCurrentIndex: setWizardStepIndex }}
    >
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
    </WizardStepContext.Provider>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <SplashScreen />
      <BrowserRouter>
        <Routes>
          {/* Rota pública — wizard de briefing */}
          <Route path="/" element={<PublicShell />} />

          {/* Rotas admin */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin/briefings" element={<AdminBriefingsListPage />} />
            <Route
              path="/admin/briefings/:id"
              element={<AdminBriefingDetailPage />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
