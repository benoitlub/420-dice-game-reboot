export const es = {
  nav: { game: 'Juego', trophies: 'Trofeos', stats: 'Stats' },
  header: { subtitle: 'Reboot · Octopus Engine' },
  menu: { home: 'Inicio Blacklace', help: 'Ayuda', share: 'Compartir', donate: 'Premium', premium: 'Feuch Institute', settings: 'Ajustes', language: 'Idioma', info: 'Información' },
  onboarding: {
    slides: [
      { label: 'Bienvenido', title: '420 Dice Game', body: 'Bienvenido a la experiencia Blacklace.\nEl juego de dados del Feuch Institute ya está disponible.' },
      { label: 'Objetivo', title: 'Objetivo', body: 'Obtén la combinación 420 en tres tiradas máximo.\nEl orden de los dados no importa.' },
      { label: 'Guardar', title: 'Conservar un dado', body: 'Después de cada tirada, toca un dado para guardarlo.\nNo se volverá a lanzar.' },
      { label: 'Resultado', title: 'Victoria o penitencia', body: '' },
      { label: '¡Vamos!', title: '¡Diviértete!', body: 'El Feuch Institute valida esta experiencia.\nBuena suerte, agente.' },
    ],
    victoryIf: 'Si sacas 420 →', victoryResult: 'Ganas la ronda inmediatamente.', elseIf: 'Si no →', elseResult: 'El pack elegido te da tu penitencia.', next: 'SIGUIENTE', start: '¡VAMOS!', skip: 'Saltar',
  },
  result: { jackpotTitle: '¡Jackpot — 420!', jackpotSub: 'El Feuch valida esta experiencia', trophy: 'TROFEO', newRound: 'NUEVA RONDA', copy: 'Copiar penitencia', copied: '¡Copiado!' },
  roll: { first: '¡LANZAR!', last: 'ÚLTIMO LANZAMIENTO', again: 'RELANZAR', notYet: 'Aún sin lanzar', counter: (n: number, max: number) => `Lanzamiento ${n} / ${max}`, seeResult: 'VER EL RESULTADO →' },
  settings: {
    title: 'Ajustes', subtitle: 'Personaliza tu experiencia Blacklace', sections: { audio: 'Audio', tutorial: 'Tutorial', data: 'Datos', appearance: 'Apariencia', language: 'Idioma' },
    sound: 'Efectos de sonido', soundDesc: 'Sonidos de tirada, victoria y navegación', haptic: 'Vibración', hapticDesc: 'Respuesta háptica en las interacciones',
    resetTutorial: 'Ver el tutorial', resetTutorialDesc: 'El tutorial aparecerá en el próximo inicio', resetTutorialDone: '✓ Tutorial reiniciado', resetStats: 'Reiniciar estadísticas', resetStatsDesc: 'Pone las rondas, trofeos y puntuaciones a cero', resetStatsDone: '✓ Estadísticas borradas', confirmReset: 'Confirmar reinicio', themeDark: 'Modo Noche', themeLight: 'Modo Día', about: 'Acerca de',
  },
  stats: { title: 'Estadísticas', subtitle: 'Tu rendimiento local — nada se envía a ningún lado.', rowRoundsPlayed: 'Rondas jugadas', rowJackpots: 'Jackpots 420', rowTotalRolls: 'Total de tiradas', rowFavPack: 'Pack favorito', rowBestStreak: 'Mejor racha', rowTrophies: 'Trofeos ganados', rowLastResult: 'Último resultado', resetBtn: 'Reiniciar estadísticas', confirmResetBtn: '¿Confirmar reinicio?', cancelBtn: 'Cancelar' },
  trophies: { title: 'Trofeos', unlocked: (n: number, total: number) => `${n} / ${total} desbloqueado${n !== 1 ? 's' : ''}`, none: '¡Lanza los dados para desbloquear tus primeros trofeos!' },
  premium: {
    productKicker: '420 Dice Game Premium', productTitle: 'Carnet de Miembro Feuch Institute', oneTimePayment: 'Pago único', lifetime: 'Una sola vez. Para siempre.', cta: (price: string) => `Desbloquear Premium — ${price}`, paymentSoon: 'Pago PayPal disponible pronto.', restoreSoon: 'Restauración disponible pronto.',
    memberActive: 'Miembro activo', memberActiveDesc: 'Todas las experiencias son accesibles.', subtitleActive: 'Eres miembro del laboratorio. Todas las experiencias están desbloqueadas.', subtitleInactive: 'Tu carnet de miembro desbloquea todas las experiencias del laboratorio.', unlocksTitle: 'Qué desbloqueas', packsTitle: 'Packs incluidos', restore: 'Restaurar mi acceso', restored: '✓ Acceso restaurado', support: 'Tu contribución financia los experimentos del Feuch Institute y los próximos juegos Blacklace.', membershipLabel: 'Desbloquear Premium', membershipTagline: 'Todos los packs de penitencias, futuros packs y actualizaciones Blacklace.', devRevoke: '[DEV] Revocar premium',
    packDescs: { 'pro-hibited': 'Penitencias profesionalmente incómodas', 'christmas': 'Ambiente festivo garantizado', 'celibataires': 'Para los solteros audaces', 'adolescents': 'La versión sin filtro', 'apero': 'Perfecto para empezar la noche' } as Record<string, string>,
    perks: ['Todos los packs de penitencias', 'Los futuros packs Premium', 'Todos los trofeos', 'Efectos visuales Blacklace', 'Las próximas actualizaciones del juego', 'Apoyo al desarrollo de Blacklace'],
  },
  game: { lockHintPre: 'Toca un dado para', lockHintWord: 'guardarlo', dieKept: 'GUARDADO', premiumRequired: 'Premium requerido', packLocked: '🔒 Pack Premium — Únete al Feuch Institute para desbloquear', feuchFlavors: ['El laboratorio valida esta experiencia.', 'Natasha anota un comportamiento inusual.', 'El Feuch observa una alineación improbable.', 'Protocolo 420 iniciado. Resultados registrados.', 'El Instituto toma nota de esta configuración.', 'El Gran Registro ha sido actualizado.', 'Natasha: « Interesante. Muy interesante. »', 'El Feuch aprueba esta experimentación.', 'Archivo automático activado. Continúa.', 'Señal detectada. La experiencia puede continuar.', 'El Feuch anota una anomalía cósmica favorable.', 'Natasha: « Los dados nunca mienten. »', 'El laboratorio registra datos inusuales.', 'Condición óptima detectada. Lanza.'] },
  aria: { openMenu: 'Abrir menú', closeMenu: 'Cerrar menú', resultModal: 'Resultado de la ronda', intensity: (n: number) => `Intensidad ${n}`, shareText: 'Un juego de dados Blacklace del Feuch Institute.', dieLocked: 'bloqueado', dieLabel: (id: number, face: string) => `Dado ${id}: ${face}` },
  notFound: 'Página no encontrada',
};
