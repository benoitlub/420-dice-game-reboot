# 420 Dice Game Reboot — v1.1.1

## Démarrage rapide

```bash
npm install
npm run dev      # dev sur http://localhost:3000
npm run build    # build → dist/public/
```

## GitHub Pages — déploiement automatique

Préconfiguré pour : `https://benoitlub.github.io/420-dice-game-reboot/`

Le workflow `.github/workflows/deploy.yml` se déclenche sur chaque push sur `main`.

**Activer dans votre repo :** Settings → Pages → Source → GitHub Actions

## Variables d'environnement

| Variable | Défaut |
|----------|--------|
| `BASE_PATH` | `/420-dice-game-reboot/` |
| `PORT` | `3000` |

## Fonctionnalités

- 🌙/☀️  Thème Nuit / Jour
- 🌐 FR / ES / EN — i18n complet (zéro texte codé en dur)
- 🎲 420 Dice Game — Octopus Engine
- 🏆 Trophées & statistiques
- 💬 Bulles Feuch Institute (14 saveurs × 3 langues)
- ✨ Premium — PayPal `benoitlubert@gmail.com`
- 🔊 Sons + haptique · 📱 Mobile-first

## localStorage

| Clé | Contenu |
|-----|---------|
| `bl_theme_v1` | dark / light |
| `bl_locale_v1` | fr / es / en |
| `bl_premium_v1` | active |
| `bl_onboarding_done_v1` | true |
| `bl_sound_enabled` | true/false |
| `bl_haptic_enabled` | true/false |

---
Blacklace Studio · Feuch Institute · 2025
