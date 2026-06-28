import { useState } from 'react';
import { Sparkles, Lock, Unlock, ChevronRight, Heart } from 'lucide-react';
import { PREMIUM_CONFIG, isPremium, activatePremium, deactivatePremium } from '../config/premium';
import { useT } from '../i18n';

const PACK_IDS = [
  { id: 'pro-hibited',   name: 'Pro.Hibited',         emoji: '🚫' },
  { id: 'christmas',     name: 'Mission Christmas',    emoji: '🎄' },
  { id: 'celibataires',  name: 'Mission Célibataires', emoji: '💘' },
  { id: 'adolescents',   name: 'Mission Ados',         emoji: '🎮' },
  { id: 'apero',         name: 'Mission Apéro',        emoji: '🥂' },
];

const PERK_ICONS = ['🎲', '🎭', '✨', '🏅', '🔮', '❤️'];

export function PremiumPage() {
  const [premium, setPremium] = useState(isPremium());
  const [restored, setRestored] = useState(false);
  const { t } = useT();

  const packs = PACK_IDS.map(p => ({
    ...p,
    desc: t.premium.packDescs[p.id] ?? '',
  }));

  const perks = t.premium.perks.map((text, i) => ({
    icon: PERK_ICONS[i] ?? '✦',
    text,
  }));

  function handleOpenPayPal() {
    window.open(PREMIUM_CONFIG.paypalUrl, '_blank', 'noopener,noreferrer');
  }

  function handleRestore() {
    activatePremium();
    setPremium(true);
    setRestored(true);
    setTimeout(() => setRestored(false), 3000);
  }

  function handleRevoke() {
    deactivatePremium();
    setPremium(false);
  }

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ─── En-tête ─────────────────────────────────────────────── */}
      <div className="text-center space-y-2 pt-2">
        <div
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3"
          style={{
            background: 'linear-gradient(135deg, rgba(109,40,217,.35), rgba(192,38,211,.35))',
            border: '1px solid rgba(192,132,252,.35)',
            boxShadow: '0 0 28px rgba(139,92,246,.25)',
          }}
        >
          <Sparkles className="w-6 h-6 text-fuchsia-300" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-gradient-bl">Feuch Institute</h1>
        <p className="text-sm text-white/55 leading-relaxed max-w-xs mx-auto">
          {premium ? t.premium.subtitleActive : t.premium.subtitleInactive}
        </p>
      </div>

      {/* ─── Statut actuel ───────────────────────────────────────── */}
      {premium && (
        <div
          className="flex items-center gap-3 rounded-2xl px-4 py-3"
          style={{ background: 'rgba(139,92,246,.08)', border: '1px solid rgba(192,132,252,.3)' }}
        >
          <Unlock className="w-4 h-4 text-fuchsia-300 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-fuchsia-200">{t.premium.memberActive}</p>
            <p className="text-xs text-white/45">{t.premium.memberActiveDesc}</p>
          </div>
        </div>
      )}

      {/* ─── Avantages ───────────────────────────────────────────── */}
      <div className="card-glass rounded-2xl p-4 space-y-3">
        <h2 className="font-serif text-sm font-bold text-white/60 uppercase tracking-widest">
          {t.premium.unlocksTitle}
        </h2>
        <ul className="space-y-2.5">
          {perks.map((p, i) => (
            <li key={i} className="flex items-center gap-3 text-sm text-white/80">
              <span className="text-base w-6 text-center">{p.icon}</span>
              <span>{p.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ─── Aperçu des packs ────────────────────────────────────── */}
      <div className="space-y-2">
        <h2 className="font-serif text-sm font-bold text-white/60 uppercase tracking-widest px-1">
          {t.premium.packsTitle}
        </h2>
        <div className="space-y-2">
          {packs.map(pack => (
            <div
              key={pack.id}
              className="flex items-center gap-3 rounded-xl px-4 py-3"
              style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(139,92,246,.12)' }}
            >
              <span className="text-xl w-7 text-center">{pack.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white/85">{pack.name}</p>
                <p className="text-xs text-white/40 truncate">{pack.desc}</p>
              </div>
              {premium
                ? <Unlock className="w-4 h-4 text-fuchsia-400 flex-shrink-0" />
                : <Lock   className="w-4 h-4 text-white/25 flex-shrink-0" />}
            </div>
          ))}
        </div>
      </div>

      {/* ─── CTA ─────────────────────────────────────────────────── */}
      {!premium && (
        <div className="space-y-3">
          <button
            onClick={handleOpenPayPal}
            className="btn-blacklace w-full py-4 text-sm tracking-widest flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4" />
            {t.premium.membershipLabel.toUpperCase()}
            <ChevronRight className="w-4 h-4" />
          </button>
          <p className="text-center text-xs text-white/30 leading-relaxed">
            {t.premium.membershipTagline}.<br />
            {t.premium.support}
          </p>
        </div>
      )}

      {/* ─── Restaurer ───────────────────────────────────────────── */}
      <div className="space-y-2">
        <button
          onClick={handleRestore}
          disabled={premium}
          className="w-full py-2.5 rounded-xl text-xs font-semibold text-white/35 border border-white/8 hover:border-violet-400/30 hover:text-white/55 transition-all disabled:opacity-30 disabled:cursor-default"
        >
          {restored ? t.premium.restored : t.premium.restore}
        </button>

        {import.meta.env.DEV && premium && (
          <button
            onClick={handleRevoke}
            className="w-full py-1.5 rounded-xl text-[10px] text-white/15 hover:text-white/30 transition-colors"
          >
            {t.premium.devRevoke}
          </button>
        )}
      </div>

      <p className="text-center text-[10px] text-white/20 pb-4">
        420 Dice Game · {PREMIUM_CONFIG.premiumVersion} · Blacklace Studio
      </p>
    </div>
  );
}
