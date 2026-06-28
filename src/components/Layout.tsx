import { Link, useLocation } from 'wouter';
import { Dices, Trophy, BarChart2, Sun, Moon } from 'lucide-react';
import { HeaderMenu } from './HeaderMenu';
import { useT, type Locale } from '../i18n';
import { useTheme } from '../contexts/theme';

interface LayoutProps {
  children: React.ReactNode;
  onShowHelp: () => void;
}

const LOCALES: Locale[] = ['fr', 'es', 'en'];

export function Layout({ children, onShowHelp }: LayoutProps) {
  const [location] = useLocation();
  const { t, locale, setLocale } = useT();
  const { theme, toggleTheme } = useTheme();

  const NAV_ITEMS = [
    { path: '/',         icon: Dices,     label: t.nav.game     },
    { path: '/trophies', icon: Trophy,    label: t.nav.trophies },
    { path: '/stats',    icon: BarChart2, label: t.nav.stats    },
  ];

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
              <h1 className="text-xl font-bold font-serif leading-tight tracking-wide text-gradient-bl">
                420 DICE GAME
              </h1>
              <p className="text-[10px] text-white/30 leading-none tracking-[.12em] uppercase">
                {t.header.subtitle}
              </p>
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
