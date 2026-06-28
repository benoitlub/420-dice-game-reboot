import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Dices, Trophy, BarChart2, Sun, Moon, Eye, X } from 'lucide-react';
import { HeaderMenu } from './HeaderMenu';
import { useT, type Locale } from '../i18n';
import { useTheme } from '../contexts/theme';
import { activatePremium, deactivatePremium, isPremium } from '../config/premium';

interface LayoutProps {
  children: React.ReactNode;
  onShowHelp: () => void;
}

const LOCALES: Locale[] = ['fr', 'es', 'en'];

export function Layout({ children, onShowHelp }: LayoutProps) {
  const [location] = useLocation();
  const { t, locale, setLocale } = useT();
  const { theme, toggleTheme } = useTheme();
  const [heroClicks, setHeroClicks] = useState(0);
  const [debugOpen, setDebugOpen] = useState(false);
  const [premiumTest, setPremiumTest] = useState(isPremium());

  const NAV_ITEMS = [
    { path: '/',         icon: Dices,     label: t.nav.game     },
    { path: '/trophies', icon: Trophy,    label: t.nav.trophies },
    { path: '/stats',    icon: BarChart2, label: t.nav.stats    },
  ];

  function handleHeroSecretClick(event: React.MouseEvent) {
    event.preventDefault();
    const next = heroClicks + 1;
    if (next >= 6) {
      setHeroClicks(0);
      setDebugOpen(true);
      return;
    }
    setHeroClicks(next);
    window.setTimeout(() => setHeroClicks(0), 2200);
  }

  function enablePremiumTest() {
    activatePremium();
    setPremiumTest(true);
  }

  function disablePremiumTest() {
    deactivatePremium();
    setPremiumTest(false);
  }

  function clearLocalCache() {
    const keepTheme = localStorage.getItem('bl_theme_v1');
    const keepLocale = localStorage.getItem('bl_locale_v1');
    localStorage.clear();
    if (keepTheme) localStorage.setItem('bl_theme_v1', keepTheme);
    if (keepLocale) localStorage.setItem('bl_locale_v1', keepLocale);
    setPremiumTest(false);
    setDebugOpen(false);
    window.location.reload();
  }

  function resetTutorialAndStats() {
    Object.keys(localStorage).forEach((key) => {
      if (key.includes('stats') || key.includes('troph') || key.includes('onboarding')) {
        localStorage.removeItem(key);
      }
    });
    setDebugOpen(false);
    window.location.reload();
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">

      {/* ─── Header ────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-20 border-b px-4 py-3"
        style={{
          background:    'var(--header-bg)',
          boxShadow:     'var(--header-shadow)',
          borderColor:   'var(--header-border)',
          backdropFilter:'blur(12px)',
        }}
      >
        <div className="max-w-lg mx-auto flex items-center justify-between gap-2">

          {/* Logo */}
          <Link href="/">
            <div className="cursor-pointer min-w-0">
              <button
                type="button"
                onClick={handleHeroSecretClick}
                className="flex items-center gap-2 text-left"
                aria-label="420 Dice Game"
              >
                <Eye className="w-4 h-4 text-fuchsia-300/70 drop-shadow-[0_0_6px_rgba(217,70,239,.55)]" />
                <div>
                  <h1 className="text-xl font-bold font-serif leading-tight tracking-wide text-gradient-bl">
                    420 DICE GAME
                  </h1>
                  <p className="text-[10px] text-white/30 leading-none tracking-[.12em] uppercase">
                    {t.header.subtitle}
                  </p>
                </div>
              </button>
            </div>
          </Link>

          {/* ─── Actions header ──────────────────────────────────────── */}
          <div className="flex items-center gap-1.5 flex-shrink-0">

            {/* Bouton Jour / Nuit */}
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Mode jour' : 'Mode nuit'}
              title={theme === 'dark' ? t.settings.themeLight : t.settings.themeDark}
              className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, rgba(109,40,217,.25), rgba(192,38,211,.25))',
                border: '1px solid rgba(192,132,252,.25)',
              }}
            >
              {theme === 'dark'
                ? <Sun  className="w-3.5 h-3.5 text-amber-300" />
                : <Moon className="w-3.5 h-3.5 text-violet-400" />}
            </button>

            {/* Sélecteur de langue */}
            <div
              className="flex items-center rounded-full overflow-hidden"
              style={{ border: '1px solid rgba(139,92,246,.22)' }}
            >
              {LOCALES.map(l => (
                <button
                  key={l}
                  onClick={() => setLocale(l)}
                  aria-label={l.toUpperCase()}
                  className={[
                    'px-1.5 py-1 text-[9px] font-bold uppercase tracking-wide transition-all duration-100',
                    locale === l
                      ? 'bg-fuchsia-600/50 text-white'
                      : 'text-white/35 hover:text-white/60',
                  ].join(' ')}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Menu hamburger Blacklace */}
            <HeaderMenu onShowHelp={onShowHelp} />
          </div>
        </div>
      </header>

      {debugOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/55 backdrop-blur-sm animate-fade-in">
          <div className="card-glass rounded-3xl p-5 w-full max-w-sm space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[.22em] text-fuchsia-300/70 font-bold">Debug Blacklace</p>
                <h2 className="font-serif text-2xl font-bold text-gradient-bl">Œil du labo</h2>
                <p className="text-xs text-white/45 mt-1">Menu caché de test local.</p>
              </div>
              <button onClick={() => setDebugOpen(false)} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/60">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid gap-2">
              <button onClick={enablePremiumTest} className="btn-blacklace py-3 text-xs uppercase tracking-widest">
                Activer Premium test
              </button>
              <button onClick={disablePremiumTest} className="rounded-xl border border-white/10 py-3 text-xs text-white/70 hover:border-fuchsia-400/30">
                Désactiver Premium test
              </button>
              <button onClick={resetTutorialAndStats} className="rounded-xl border border-white/10 py-3 text-xs text-white/70 hover:border-fuchsia-400/30">
                Réinitialiser stats + tutoriel
              </button>
              <button onClick={clearLocalCache} className="rounded-xl border border-rose-400/20 py-3 text-xs text-rose-200/80 hover:border-rose-400/40">
                Vider le cache local
              </button>
            </div>

            <p className="text-center text-[10px] text-white/30">
              Premium test : {premiumTest ? 'actif' : 'inactif'} · 6 clics sur l’œil pour revenir ici.
            </p>
          </div>
        </div>
      )}

      {/* ─── Contenu principal ─────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-4 pb-24">
          {children}
        </div>
      </main>

      {/* ─── Navigation bas ────────────────────────────────────────── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-20 border-t"
        style={{
          background:    'var(--nav-bg)',
          backdropFilter:'blur(16px)',
          boxShadow:     'var(--nav-shadow)',
          borderColor:   'var(--nav-border)',
        }}
      >
        <div className="max-w-lg mx-auto flex">
          {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
            const active = location === path;
            return (
              <Link
                key={path}
                href={path}
                className={[
                  'flex-1 flex flex-col items-center gap-1.5 py-3 transition-all duration-200 relative',
                  active ? 'nav-active' : 'nav-inactive',
                ].join(' ')}
                data-testid={`nav-${label.toLowerCase()}`}
              >
                {active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-px bg-gradient-to-r from-transparent via-fuchsia-400 to-transparent" />
                )}
                <Icon className={[
                  'w-5 h-5 transition-all duration-200',
                  active ? 'drop-shadow-[0_0_6px_rgba(240,171,252,.7)]' : '',
                ].join(' ')} />
                <span className="text-[10px] font-semibold tracking-wide uppercase">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
