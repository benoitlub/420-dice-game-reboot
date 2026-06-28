import { useState } from 'react';
import { Volume2, VolumeX, Smartphone, RotateCcw, Trash2, Info, Sun, Moon } from 'lucide-react';
import { isSoundOn, isHapticOn, setSoundOn, setHapticOn } from '../octopus/audio/soundEngine';
import { resetStats } from '../octopus';
import { useT, type Locale } from '../i18n';
import { useTheme, type Theme } from '../contexts/theme';

const ONBOARDING_KEY = 'bl_onboarding_done_v1';

interface ToggleProps {
  label: string;
  description?: string;
  icon: React.ReactNode;
  value: boolean;
  onChange: (v: boolean) => void;
}

function Toggle({ label, description, icon, value, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-150 text-left"
      style={{
        background: value ? 'rgba(139,92,246,.08)' : 'var(--surface-subtle)',
        border: `1px solid ${value ? 'rgba(192,132,252,.25)' : 'var(--border-fine)'}`,
      }}
    >
      <span className={['w-5 h-5 flex-shrink-0', value ? 'text-fuchsia-300' : 'text-white/35'].join(' ')}>
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className={['text-sm font-semibold', value ? 'text-white/90' : 'text-white/50'].join(' ')}>
          {label}
        </p>
        {description && (
          <p className="text-xs text-white/30 truncate">{description}</p>
        )}
      </div>
      <div className={['relative w-10 h-6 rounded-full transition-all duration-200 flex-shrink-0', value ? 'bg-gradient-to-r from-violet-600 to-fuchsia-500' : 'bg-white/10'].join(' ')}>
        <div className={['absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-200', value ? 'left-5' : 'left-1'].join(' ')} />
      </div>
    </button>
  );
}

interface ActionButtonProps {
  label: string;
  description?: string;
  icon: React.ReactNode;
  danger?: boolean;
  onClick: () => void;
  confirmLabel?: string;
}

function ActionButton({ label, description, icon, danger, onClick, confirmLabel }: ActionButtonProps) {
  const [confirm, setConfirm] = useState(false);

  function handleClick() {
    if (confirmLabel && !confirm) {
      setConfirm(true);
      setTimeout(() => setConfirm(false), 3000);
    } else {
      setConfirm(false);
      onClick();
    }
  }

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-150 text-left"
      style={{
        background: confirm ? 'rgba(239,68,68,.08)' : 'var(--surface-subtle)',
        border: `1px solid ${confirm ? 'rgba(239,68,68,.3)' : 'var(--border-fine)'}`,
      }}
    >
      <span className={['w-5 h-5 flex-shrink-0', confirm ? 'text-red-400' : danger ? 'text-red-400/60' : 'text-white/40'].join(' ')}>
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className={['text-sm font-semibold', confirm ? 'text-red-300' : danger ? 'text-red-300/70' : 'text-white/70'].join(' ')}>
          {confirm && confirmLabel ? confirmLabel : label}
        </p>
        {description && !confirm && (
          <p className="text-xs text-white/30 truncate">{description}</p>
        )}
      </div>
    </button>
  );
}

const LOCALES: { code: Locale; label: string }[] = [
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
];

const THEMES: { code: Theme; icon: React.ReactNode; label: (t: ReturnType<typeof useT>['t']) => string }[] = [
  { code: 'dark',  icon: <Moon className="w-4 h-4" />, label: t => t.settings.themeDark  },
  { code: 'light', icon: <Sun  className="w-4 h-4" />, label: t => t.settings.themeLight },
];

export function SettingsPage() {
  const [sound,  setSound]  = useState(isSoundOn());
  const [haptic, setHaptic] = useState(isHapticOn());
  const [statsDone, setStatsDone] = useState(false);
  const [tutoDone,  setTutoDone]  = useState(false);
  const { t, locale, setLocale } = useT();
  const { theme, setTheme } = useTheme();

  function handleSoundChange(v: boolean)  { setSoundOn(v);  setSound(v);  }
  function handleHapticChange(v: boolean) { setHapticOn(v); setHaptic(v); }

  function handleResetStats() {
    resetStats();
    setStatsDone(true);
    setTimeout(() => setStatsDone(false), 2500);
  }

  function handleResetTutorial() {
    localStorage.removeItem(ONBOARDING_KEY);
    setTutoDone(true);
    setTimeout(() => setTutoDone(false), 2500);
  }

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ─── En-tête ─────────────────────────────────────────────── */}
      <div className="pt-2">
        <h1 className="font-serif text-2xl font-bold text-gradient-bl">{t.settings.title}</h1>
        <p className="text-xs text-white/35 mt-1">{t.settings.subtitle}</p>
      </div>

      {/* ─── Apparence ───────────────────────────────────────────── */}
      <section className="space-y-2">
        <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">
          {t.settings.sections.appearance}
        </h2>
        <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid rgba(139,92,246,.18)' }}>
          {THEMES.map(({ code, icon, label }) => (
            <button
              key={code}
              onClick={() => setTheme(code)}
              className={[
                'flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-all duration-150',
                theme === code
                  ? 'bg-violet-600/25 text-white/90'
                  : 'text-white/40 hover:text-white/60',
              ].join(' ')}
            >
              {icon}
              {label(t)}
            </button>
          ))}
        </div>
      </section>

      {/* ─── Langue ──────────────────────────────────────────────── */}
      <section className="space-y-2">
        <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">
          {t.settings.sections.language}
        </h2>
        <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid rgba(139,92,246,.18)' }}>
          {LOCALES.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => setLocale(code)}
              className={[
                'flex-1 flex items-center justify-center py-3 text-sm font-semibold transition-all duration-150',
                locale === code
                  ? 'bg-violet-600/25 text-white/90'
                  : 'text-white/40 hover:text-white/60',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* ─── Audio ───────────────────────────────────────────────── */}
      <section className="space-y-2">
        <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">
          {t.settings.sections.audio}
        </h2>
        <div className="space-y-2">
          <Toggle
            label={t.settings.sound}
            description={t.settings.soundDesc}
            icon={sound ? <Volume2 className="w-full h-full" /> : <VolumeX className="w-full h-full" />}
            value={sound}
            onChange={handleSoundChange}
          />
          <Toggle
            label={t.settings.haptic}
            description={t.settings.hapticDesc}
            icon={<Smartphone className="w-full h-full" />}
            value={haptic}
            onChange={handleHapticChange}
          />
        </div>
      </section>

      {/* ─── Tutoriel ────────────────────────────────────────────── */}
      <section className="space-y-2">
        <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">
          {t.settings.sections.tutorial}
        </h2>
        <ActionButton
          label={tutoDone ? t.settings.resetTutorialDone : t.settings.resetTutorial}
          description={t.settings.resetTutorialDesc}
          icon={<RotateCcw className="w-full h-full" />}
          onClick={handleResetTutorial}
        />
      </section>

      {/* ─── Données ─────────────────────────────────────────────── */}
      <section className="space-y-2">
        <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">
          {t.settings.sections.data}
        </h2>
        <ActionButton
          label={statsDone ? t.settings.resetStatsDone : t.settings.resetStats}
          description={t.settings.resetStatsDesc}
          icon={<Trash2 className="w-full h-full" />}
          danger
          confirmLabel={t.settings.confirmReset}
          onClick={handleResetStats}
        />
      </section>

      {/* ─── À propos ────────────────────────────────────────────── */}
      <section
        className="rounded-2xl px-4 py-4 space-y-1"
        style={{ background: 'var(--surface-subtle)', border: '1px solid var(--border-fine)' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-4 h-4 text-violet-400" />
          <h2 className="text-sm font-bold text-white/60">{t.settings.about}</h2>
        </div>
        <p className="text-xs text-white/40">{t.settings.aboutGame}</p>
        <p className="text-xs text-white/25">{t.settings.aboutEngine}</p>
        <p className="text-xs text-white/25">{t.settings.aboutStudio}</p>
      </section>
    </div>
  );
}
