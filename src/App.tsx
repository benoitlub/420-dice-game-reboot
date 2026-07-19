import { useState, useEffect } from 'react';
import { Switch, Route, Router as WouterRouter } from 'wouter';
import { Layout } from './components/Layout';
import { GamePage } from './pages/GamePage';
import { TrophiesPage } from './pages/TrophiesPage';
import { StatsPage } from './pages/StatsPage';
import { SettingsPage } from './pages/SettingsPage';
import { PremiumPage } from './pages/PremiumPage';
import { OnboardingModal } from './components/OnboardingModal';
import { I18nProvider, useT } from './i18n';
import { ThemeProvider } from './contexts/theme';

const ONBOARDING_KEY = 'bl_onboarding_done_v1';

function NotFound() {
  const { t } = useT();
  return (
    <div className="text-center py-16 text-muted-foreground">
      <div className="text-4xl mb-4">🎲</div>
      <p>{t.notFound}</p>
    </div>
  );
}

function AppInner() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(ONBOARDING_KEY)) {
      setShowOnboarding(true);
    }
  }, []);

  function completeOnboarding() {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setShowOnboarding(false);
  }

  function resetOnboarding() {
    localStorage.removeItem(ONBOARDING_KEY);
    setShowOnboarding(true);
  }

  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Layout onShowHelp={resetOnboarding}>
        <Switch>
          <Route path="/" component={GamePage} />
          <Route path="/trophies" component={TrophiesPage} />
          <Route path="/stats" component={StatsPage} />
          <Route path="/settings" component={SettingsPage} />
          <Route path="/premium" component={PremiumPage} />
          <Route component={NotFound} />
        </Switch>
      </Layout>

      {showOnboarding && <OnboardingModal onClose={completeOnboarding} />}
    </WouterRouter>
  );
}

function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AppInner />
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;