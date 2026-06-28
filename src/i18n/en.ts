export const en = {
  nav: { game: 'Game', trophies: 'Trophies', stats: 'Stats' },
  header: { subtitle: 'Reboot · Octopus Engine' },
  menu: { home: 'Blacklace Home', help: 'Help', share: 'Share', donate: 'Premium', premium: 'Feuch Institute', settings: 'Settings', language: 'Language', info: 'Information' },
  onboarding: {
    slides: [
      { label: 'Welcome', title: '420 Dice Game', body: 'Welcome to the Blacklace experience.\nThe Feuch Institute dice game is now available.' },
      { label: 'Goal', title: 'Goal', body: 'Get the 420 combination in three rolls maximum.\nDice order does not matter.' },
      { label: 'Lock', title: 'Lock a die', body: "After each roll, tap a die to lock it.\nIt won't be rolled on the next throw." },
      { label: 'Result', title: 'Win or forfeit', body: '' },
      { label: "Let's go!", title: 'Have fun!', body: 'The Feuch Institute validates this experience.\nGood luck, agent.' },
    ],
    victoryIf: 'If you roll 420 →', victoryResult: 'You win the round immediately.', elseIf: 'Otherwise →', elseResult: 'The chosen pack gives you your forfeit.', next: 'NEXT', start: "LET'S GO!", skip: 'Skip',
  },
  result: { jackpotTitle: 'Jackpot — 420!', jackpotSub: 'The Feuch validates this experience', trophy: 'TROPHY', newRound: 'NEW ROUND', share: 'Share', shared: 'Challenge shared!', copied: 'Challenge copied to clipboard.' },
  roll: { first: 'ROLL!', last: 'LAST ROLL', again: 'REROLL', notYet: 'Not rolled yet', counter: (n: number, max: number) => `Roll ${n} / ${max}`, seeResult: 'SEE RESULT →' },
  settings: {
    title: 'Settings', subtitle: 'Customize your Blacklace experience', sections: { audio: 'Audio', tutorial: 'Tutorial', data: 'Data', appearance: 'Appearance', language: 'Language' },
    sound: 'Sound effects', soundDesc: 'Roll, victory and navigation sounds', haptic: 'Vibration', hapticDesc: 'Haptic feedback on interactions', resetTutorial: 'Replay tutorial', resetTutorialDesc: 'The tutorial will appear on next launch', resetTutorialDone: '✓ Tutorial reset', resetStats: 'Reset statistics', resetStatsDesc: 'Clears rounds, trophies and scores', resetStatsDone: '✓ Statistics cleared', confirmReset: 'Confirm reset', themeDark: 'Night mode', themeLight: 'Day mode', about: 'About',
  },
  stats: { title: 'Statistics', subtitle: 'Your local performance — nothing is sent anywhere.', rowRoundsPlayed: 'Rounds played', rowJackpots: '420 Jackpots', rowTotalRolls: 'Total rolls', rowFavPack: 'Favourite pack', rowBestStreak: 'Best streak', rowTrophies: 'Trophies earned', rowLastResult: 'Last result', resetBtn: 'Reset stats', confirmResetBtn: 'Confirm reset?', cancelBtn: 'Cancel' },
  trophies: { title: 'Trophies', unlocked: (n: number, total: number) => `${n} / ${total} unlocked`, none: 'Roll the dice to unlock your first trophies!' },
  premium: {
    productKicker: '420 Dice Game Premium', productTitle: 'Feuch Institute Membership Card', oneTimePayment: 'One-time payment', lifetime: 'Pay once. Keep it forever.', cta: (price: string) => `Unlock Premium — ${price}`, paymentSoon: 'PayPal payment coming soon.', restoreSoon: 'Restore access coming soon.',
    memberActive: 'Active member', memberActiveDesc: 'All experiences are accessible.', subtitleActive: 'You are a lab member. All experiences are unlocked.', subtitleInactive: 'Your membership card unlocks all lab experiences.', unlocksTitle: 'What you unlock', packsTitle: 'Included packs', restore: 'Restore my access', restored: '✓ Access restored', support: 'Your contribution funds Feuch Institute experiments and the next Blacklace games.', membershipLabel: 'Unlock Premium', membershipTagline: 'All forfeit packs, future packs and Blacklace updates.', devRevoke: '[DEV] Revoke premium',
    packDescs: { 'pro-hibited': 'Professionally uncomfortable forfeits', 'christmas': 'Festive atmosphere guaranteed', 'celibataires': 'For the bold singles', 'adolescents': 'The unfiltered version', 'apero': 'Perfect to kick off the evening' } as Record<string, string>,
    perks: ['All forfeit packs', 'Future Premium packs', 'All trophies', 'Blacklace visual effects', 'Upcoming game updates', 'Support Blacklace development'],
  },
  game: { lockHintPre: 'Tap a die to', lockHintWord: 'keep it', dieKept: 'KEPT', premiumRequired: 'Premium required', packLocked: '🔒 Premium Pack — Join the Feuch Institute to unlock', feuchFlavors: ['The lab validates this experience.', 'Natasha notes unusual behavior.', 'The Feuch observes an improbable alignment.', 'Protocol 420 initiated. Results recorded.', 'The Institute notes this configuration.', 'The Grand Registry has been updated.', 'Natasha: « Interesting. Very interesting. »', 'The Feuch approves this experimentation.', 'Auto-archive triggered. Continue.', 'Signal detected. Experience may resume.', 'The Feuch notes a favorable cosmic anomaly.', 'Natasha: « The dice never lie. »', 'The lab is recording unusual data.', 'Optimal condition detected. Roll.'] },
  aria: { openMenu: 'Open menu', closeMenu: 'Close menu', resultModal: 'Round result', intensity: (n: number) => `Intensity ${n}`, shareText: 'A Blacklace dice game by the Feuch Institute.', dieLocked: 'locked', dieLabel: (id: number, face: string) => `Die ${id}: ${face}` },
  notFound: 'Page not found',
};
