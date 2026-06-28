import { useState } from 'react';
import { ChevronRight, X } from 'lucide-react';
import { useT } from '../i18n';

const ONBOARDING_KEY = 'bl_onboarding_done_v1';

interface OnboardingModalProps {
  onClose: () => void;
}

export function OnboardingModal({ onClose }: OnboardingModalProps) {
  const [index, setIndex] = useState(0);
  const { t } = useT();

  const SLIDES_ICONS = ['🎲', '🏆', '🔒', '⚡', '✨'];
  const slide = t.onboarding.slides[index]!;
  const icon  = SLIDES_ICONS[index]!;
  const isLast = index === t.onboarding.slides.length - 1;

  function handleNext() {
    if (isLast) {
      localStorage.setItem(ONBOARDING_KEY, 'true');
      onClose();
    } else {
      setIndex(i => i + 1);
    }
  }

  function handleSkip() {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-md animate-fade-in px-4"
      onClick={(e) => e.target === e.currentTarget && handleSkip()}
    >
      <div className="w-full max-w-sm card-glass rounded-3xl p-8 flex flex-col items-center gap-6 animate-slide-up">

        {/* Skip button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-white/30 hover:text-white/60 transition-colors"
          aria-label={t.onboarding.skip}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
          style={{
            background: 'linear-gradient(135deg, rgba(109,40,217,.3), rgba(192,38,211,.3))',
            border: '1px solid rgba(192,132,252,.3)',
            boxShadow: '0 0 24px rgba(139,92,246,.2)',
          }}
        >
          {icon}
        </div>

        {/* Content */}
        <div className="text-center space-y-3 min-h-[120px] flex flex-col items-center justify-center">
          <h2 className="font-serif text-2xl font-bold text-gradient-bl">
            {slide.title}
          </h2>

          {/* Slide 4 spéciale : victoire / gage */}
          {index === 3 ? (
            <div className="space-y-3 text-white/80 text-sm leading-relaxed text-center">
              <p>
                <span className="text-fuchsia-300 font-bold">{t.onboarding.victoryIf}</span>
                <br />{t.onboarding.victoryResult}
              </p>
              <p className="text-white/40">·</p>
              <p>
                <span className="text-violet-300 font-bold">{t.onboarding.elseIf}</span>
                <br />{t.onboarding.elseResult}
              </p>
            </div>
          ) : (
            <p className="text-white/75 text-sm leading-relaxed whitespace-pre-line">
              {slide.body}
            </p>
          )}
        </div>

        {/* Dots */}
        <div className="flex items-center gap-2">
          {t.onboarding.slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={[
                'transition-all duration-300 rounded-full',
                i === index
                  ? 'w-6 h-2 bg-fuchsia-400 shadow-[0_0_8px_rgba(217,70,239,.6)]'
                  : 'w-2 h-2 bg-white/20 hover:bg-white/40',
              ].join(' ')}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Bouton suivant / démarrer */}
        <button
          onClick={handleNext}
          className="btn-blacklace w-full py-3.5 text-sm tracking-widest flex items-center justify-center gap-2"
        >
          {isLast ? t.onboarding.start : (
            <><span>{t.onboarding.next}</span><ChevronRight className="w-4 h-4" /></>
          )}
        </button>
      </div>
    </div>
  );
}
