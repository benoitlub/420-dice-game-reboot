import { useState } from 'react';
import { Sparkles, Lock, Unlock, ChevronRight, CreditCard } from 'lucide-react';
import { PREMIUM_CONFIG, isPremium } from '../config/premium';
import { useT } from '../i18n';

const PACK_IDS = [
  { id: 'pro-hibited',   name: 'Pro.Hibited',         emoji: '🚫' },
  { id: 'christmas',     name: 'Mission Christmas',    emoji: '🎄' },
  { id: 'celibataires',  name: 'Mission Célibataires', emoji: '💘' },
  { id: 'adolescents',   name: 'Mission Ados',         emoji: '🎮' },
  { id: 'apero',         name: 'Mission Apéro',        emoji: '🥂' },
];

const PERK_ICONS = ['🎲', '🧪', '🏆', '✨', '🚀', '❤️'];

export function PremiumPage() {
  const [premium] = useState(isPremium());
  const [notice, setNotice] = useState(false);
  const { t } = useT();
  const paymentReady = Boolean(PREMIUM_CONFIG.paymentUrl);

  const packs = PACK_IDS.map(p => ({
    ...p,
    desc: t.premium.packDescs[p.id] ?? '',
  }));

  const perks = t.premium.perks.map((text, i) => ({
    icon: PERK_ICONS[i] ?? '✦',
    text,
  }));

  function handleOpenPayment() {
    if (!paymentReady) {
      setNotice(true);
      setTimeout(() => setNotice(false), 3000);
      return;
    }
    window.open(PREMIUM_CONFIG.paymentUrl, '_blank', 'noopener,noreferrer');
  }

  function handleRestore() {
    setNotice(true);
    setTimeout(() => setNotice(false), 3000);
  }

  return (
    <div className="space-y-6 animate-fade-in">
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
        <p className="text-xs uppercase tracking-[.28em] text-fuchsia-300/70 font-bold">
          {t.premium.productKicker}
        </p>
        <h1 className="font-serif text-2xl font-bold text-gradient-bl">{t.premium.productTitle}</h1>
        <p className="text-sm text-white/55 leading-relaxed max-w-xs mx-auto">
          {premium ? t.premium.subtitleActive : t.premium.subtitleInactive}
        </p>
      </div>

      <div className="card-glass rounded-3xl p-5 text-center space-y-2">
        <p className="text-xs text-white/45 uppercase tracking-[.18em]">{t.premium.oneTimePayment}</p>
        <p className="font-serif text-5xl font-bold text-gradient-jackpot">{PREMIUM_CONFIG.priceLabel}</p>
        <p className="text-xs text-white/45">{t.premium.lifetime}</p>
      </div>

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

      {!premium && (
        <div className="space-y-3">
          <button
            onClick={handleOpenPayment}
            className="btn-blacklace w-full py-4 text-sm tracking-widest flex items-center justify-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            {t.premium.cta(PREMIUM_CONFIG.priceLabel).toUpperCase()}
            <ChevronRight className="w-4 h-4" />
          </button>
          <p className="text-center text-xs text-white/35 leading-relaxed">
            {paymentReady ? t.premium.membershipTagline : t.premium.paymentSoon}<br />
            {t.premium.support}
          </p>
        </div>
      )}

      <div className="space-y-2">
        <button
          onClick={handleRestore}
          disabled={premium}
          className="w-full py-2.5 rounded-xl text-xs font-semibold text-white/35 border border-white/8 hover:border-violet-400/30 hover:text-white/55 transition-all disabled:opacity-30 disabled:cursor-default"
        >
          {t.premium.restore}
        </button>

        {notice && (
          <p className="text-center text-xs text-fuchsia-200/80">
            {t.premium.restoreSoon}
          </p>
        )}
      </div>

      <p className="text-center text-[10px] text-white/20 pb-4">
        420 Dice Game · {PREMIUM_CONFIG.premiumVersion} · Blacklace Studio
      </p>
    </div>
  );
}
