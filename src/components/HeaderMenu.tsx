import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import {
  Menu, X, Home, HelpCircle, Share2, Heart,
  Info, Settings, Globe, Sparkles,
} from 'lucide-react';
import { PREMIUM_CONFIG } from '../config/premium';
import { useT } from '../i18n';

interface HeaderMenuProps {
  onShowHelp: () => void;
}

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  action: () => void;
  accent?: boolean;
  dividerAfter?: boolean;
}

export function HeaderMenu({ onShowHelp }: HeaderMenuProps) {
  const [open, setOpen] = useState(false);
  const [, navigate] = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const { t } = useT();

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  function go(path: string) {
    setOpen(false);
    navigate(path);
  }

  async function handleShare() {
    setOpen(false);
    try {
      if (navigator.share) {
        await navigator.share({
          title: '420 Dice Game',
          text: t.aria.shareText,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
    } catch { /* ignore */ }
  }

  function handleDonate() {
    setOpen(false);
    window.open(PREMIUM_CONFIG.paypalUrl, '_blank', 'noopener,noreferrer');
  }

  const items: MenuItem[] = [
    {
      icon: <Home className="w-4 h-4" />,
      label: t.menu.home,
      action: () => { setOpen(false); window.open('https://blacklace.fr', '_blank', 'noopener,noreferrer'); },
      dividerAfter: true,
    },
    {
      icon: <HelpCircle className="w-4 h-4" />,
      label: t.menu.help,
      action: () => { setOpen(false); onShowHelp(); },
    },
    {
      icon: <Share2 className="w-4 h-4" />,
      label: t.menu.share,
      action: handleShare,
    },
    {
      icon: <Heart className="w-4 h-4" />,
      label: t.menu.donate,
      action: handleDonate,
      dividerAfter: true,
    },
    {
      icon: <Sparkles className="w-4 h-4" />,
      label: t.menu.premium,
      action: () => go('/premium'),
      accent: true,
    },
    {
      icon: <Settings className="w-4 h-4" />,
      label: t.menu.settings,
      action: () => go('/settings'),
    },
    {
      icon: <Globe className="w-4 h-4" />,
      label: t.menu.language,
      action: () => go('/settings'),
    },
    {
      icon: <Info className="w-4 h-4" />,
      label: t.menu.info,
      action: () => go('/settings'),
    },
  ];

  return (
    <div ref={menuRef} className="relative">
      {/* Bouton hamburger */}
      <button
        onClick={() => setOpen(v => !v)}
        aria-label={open ? t.aria.closeMenu : t.aria.openMenu}
        className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150"
        style={{
          background: open
            ? 'linear-gradient(135deg, rgba(109,40,217,.5), rgba(192,38,211,.5))'
            : 'linear-gradient(135deg, rgba(109,40,217,.3), rgba(192,38,211,.3))',
          border: '1px solid rgba(192,132,252,.3)',
          boxShadow: open ? '0 0 16px rgba(139,92,246,.35)' : '0 0 10px rgba(139,92,246,.15)',
        }}
      >
        {open
          ? <X    className="w-4 h-4 text-fuchsia-200" />
          : <Menu className="w-4 h-4 text-fuchsia-300" />
        }
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-10 w-52 rounded-2xl py-2 z-50 animate-slide-up"
          style={{
            background:   'var(--dropdown-bg)',
            border:       '1px solid var(--dropdown-border)',
            boxShadow:    'var(--dropdown-shadow)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {items.map((item, i) => (
            <div key={i}>
              <button
                onClick={item.action}
                className={[
                  'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-100',
                  item.accent
                    ? 'text-fuchsia-300 hover:bg-fuchsia-500/10'
                    : 'menu-item-text hover:bg-white/[.04]',
                ].join(' ')}
              >
                <span className={item.accent ? 'text-fuchsia-400' : 'menu-item-icon'}>
                  {item.icon}
                </span>
                <span className="text-sm font-medium">{item.label}</span>
              </button>
              {item.dividerAfter && (
                <div className="mx-4 my-1 h-px menu-divider" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
