# 420 Dice Game Reboot — v1.0.0

## Stack
React 19 · Vite 7 · TypeScript · TailwindCSS 4 · Wouter

## Install & run
```bash
pnpm install   # or npm install
pnpm dev       # starts dev server on port 5173
pnpm build     # production build → dist/
```

## Features
- 🌙/☀️  Dark / Light theme (persisted in localStorage)  
- 🌐 FR / ES / EN i18n (auto-detected from browser locale)  
- 🎲 420 dice game with Octopus Engine  
- 🏆 Trophy system & stats  
- ✨ Premium Feuch Institute membership

## localStorage keys
| Key | Purpose |
|-----|---------|
| `bl_theme_v1` | dark / light |
| `bl_locale_v1` | fr / es / en |
| `bl_premium_v1` | premium status |
| `bl_onboarding_done_v1` | onboarding flag |
| `bl_sound_enabled` | sound preference |
| `bl_haptic_enabled` | haptic preference |

Blacklace Studio · Feuch Institute
