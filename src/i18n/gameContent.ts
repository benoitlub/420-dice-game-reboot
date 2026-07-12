import type { Locale } from './index';
import type { ComboResult, Die, GameEvent } from '../types/game';
import type { Pack } from '../types/packs';
import type { Persona } from '../types/personas';

const FACE_NAMES: Record<Locale, Record<string, string>> = {
  fr: { '4': '4', '2': '2', '0': '0', heart: 'Cœur', cloud: 'Nuage', prohibited: 'Interdit' },
  en: { '4': '4', '2': '2', '0': '0', heart: 'Heart', cloud: 'Cloud', prohibited: 'Prohibited' },
  es: { '4': '4', '2': '2', '0': '0', heart: 'Corazón', cloud: 'Nube', prohibited: 'Prohibido' },
};

const PACK_META: Record<Exclude<Locale, 'fr'>, Record<string, { title: string; description: string }>> = {
  en: {
    standard: { title: 'Standard Mission', description: 'The festive classic for every occasion' },
    'pro-hibited': { title: 'Pro.Hibited Mission', description: 'Cannabis culture, humour and hazy challenges' },
    christmas: { title: 'Christmas Mission', description: 'Festive challenges for a wonderfully chaotic holiday' },
    celibataires: { title: 'Singles Mission', description: 'Bold, playful challenges for single players' },
    adolescents: { title: 'Teen Mission', description: 'A lighter, energetic and unfiltered pack' },
    apero: { title: 'Aperitif Mission', description: 'Perfect for getting the evening started' },
  },
  es: {
    standard: { title: 'Misión Estándar', description: 'El clásico festivo para cualquier ocasión' },
    'pro-hibited': { title: 'Misión Pro.Hibited', description: 'Cultura cannábica, humor y retos entre nubes' },
    christmas: { title: 'Misión Navidad', description: 'Retos festivos para unas fiestas deliciosamente caóticas' },
    celibataires: { title: 'Misión Solteros', description: 'Retos atrevidos y divertidos para solteros' },
    adolescents: { title: 'Misión Adolescentes', description: 'Un pack ligero, enérgico y sin filtros' },
    apero: { title: 'Misión Aperitivo', description: 'Perfecto para empezar la noche' },
  },
};

const CHALLENGES: Record<Exclude<Locale, 'fr'>, Record<string, string[]>> = {
  en: {
    standard: [
      'Tell an embarrassing but harmless story about yourself.',
      'Imitate someone at the table until the group guesses who it is.',
      'Give every player one sincere compliment.',
      'Invent an absurd rule that applies until the next round.',
      'Describe your favourite film without naming the title or genre.',
      'Answer the next three questions using no more than two words each.',
      'Perform a dramatic declaration of love to an object in the room.',
      'Reveal a harmless secret or take a challenge chosen by the group.',
    ],
    'pro-hibited': [
      'Invent the most ridiculous name for an imaginary strain and describe its effects.',
      'Explain a completely ordinary object as though it were revolutionary smoking technology.',
      'Tell your funniest hazy misunderstanding without naming anyone involved.',
      'Create a ten-second commercial for the Feuch Institute.',
      'Mime someone who is trying very hard to look completely sober.',
      'Name three snacks worthy of the official 420 banquet.',
      'Give a serious scientific explanation for why the room feels slightly cosmic.',
      'Choose a player to receive the title of Grand Keeper of the Cloud until the next round.',
    ],
    christmas: [
      'Sing one line of a Christmas song in the most dramatic voice possible.',
      'Invent a terrible gift and explain why everyone secretly wants it.',
      'Imitate Santa after a very long and complicated delivery night.',
      'Give someone at the table a festive title until the next round.',
      'Tell the group your most chaotic holiday memory.',
      'Create a new Christmas tradition in fifteen seconds.',
      'Wrap an imaginary present and sell it like a luxury product.',
      'Name three things that should never appear in a Christmas stocking.',
    ],
    celibataires: [
      'Describe your ideal date using only five words.',
      'Share your funniest dating-app misunderstanding.',
      'Give a sincere compliment to the person opposite you.',
      'Invent the worst possible opening line.',
      'Choose a fictional character you would date and defend your choice.',
      'Tell the table your biggest green flag in another person.',
      'Act out a disastrous first date in ten seconds.',
      'Let the group write your imaginary dating-profile headline.',
    ],
    adolescents: [
      'Do your best impression of a teacher for fifteen seconds.',
      'Name the most useless superpower imaginable.',
      'Invent a new slang word and make everyone use it for one round.',
      'Show the last harmless photo in your gallery or take a challenge.',
      'Dance for ten seconds without music.',
      'Describe school as though it were an epic fantasy film.',
      'Let the group choose a new nickname for you until the next round.',
      'Tell the worst joke you know with complete confidence.',
    ],
    apero: [
      'Toast to something absurd but surprisingly important.',
      'Choose the official song of the evening and defend your choice.',
      'Tell a short story that gets stranger with every sentence.',
      'Invent a cocktail name based on the person to your left.',
      'Speak like a luxury-food critic until your next turn.',
      'Name three signs that the evening has officially begun.',
      'Create a five-second slogan for this table.',
      'Let the group choose your ceremonial title for one round.',
    ],
  },
  es: {
    standard: [
      'Cuenta una historia vergonzosa pero inofensiva sobre ti.',
      'Imita a alguien de la mesa hasta que el grupo adivine quién es.',
      'Haz un cumplido sincero a cada jugador.',
      'Inventa una regla absurda válida hasta la próxima ronda.',
      'Describe tu película favorita sin decir el título ni el género.',
      'Responde a las próximas tres preguntas con un máximo de dos palabras.',
      'Declara tu amor de forma teatral a un objeto de la habitación.',
      'Revela un secreto inofensivo o acepta un reto elegido por el grupo.',
    ],
    'pro-hibited': [
      'Inventa el nombre más ridículo para una variedad imaginaria y describe sus efectos.',
      'Presenta un objeto cotidiano como si fuera una tecnología revolucionaria para fumar.',
      'Cuenta tu malentendido más divertido entre nubes sin nombrar a nadie.',
      'Crea un anuncio de diez segundos para el Feuch Institute.',
      'Imita a alguien que intenta parecer completamente sobrio.',
      'Nombra tres aperitivos dignos del banquete oficial 420.',
      'Da una explicación científica muy seria de por qué la sala parece cósmica.',
      'Elige al Gran Guardián de la Nube hasta la próxima ronda.',
    ],
    christmas: [
      'Canta una línea de una canción navideña con dramatismo extremo.',
      'Inventa un regalo horrible y explica por qué todos lo desean en secreto.',
      'Imita a Papá Noel después de una noche de reparto interminable.',
      'Da a alguien de la mesa un título navideño hasta la próxima ronda.',
      'Cuenta tu recuerdo navideño más caótico.',
      'Crea una nueva tradición de Navidad en quince segundos.',
      'Envuelve un regalo imaginario y véndelo como un producto de lujo.',
      'Nombra tres cosas que nunca deberían aparecer en un calcetín navideño.',
    ],
    celibataires: [
      'Describe tu cita ideal usando solo cinco palabras.',
      'Cuenta tu malentendido más divertido en una app de citas.',
      'Haz un cumplido sincero a la persona que tienes enfrente.',
      'Inventa la peor frase posible para ligar.',
      'Elige un personaje ficticio con quien saldrías y defiende tu elección.',
      'Cuenta cuál es tu mayor señal positiva en otra persona.',
      'Representa una primera cita desastrosa en diez segundos.',
      'Deja que el grupo escriba el titular de tu perfil imaginario.',
    ],
    adolescents: [
      'Haz tu mejor imitación de un profesor durante quince segundos.',
      'Nombra el superpoder más inútil que puedas imaginar.',
      'Inventa una palabra nueva y obliga a todos a usarla durante una ronda.',
      'Enseña la última foto inofensiva de tu galería o acepta un reto.',
      'Baila durante diez segundos sin música.',
      'Describe el instituto como si fuera una película épica de fantasía.',
      'Deja que el grupo elija tu nuevo apodo hasta la próxima ronda.',
      'Cuenta el peor chiste que conozcas con absoluta confianza.',
    ],
    apero: [
      'Brinda por algo absurdo pero sorprendentemente importante.',
      'Elige la canción oficial de la noche y defiende tu elección.',
      'Cuenta una historia corta que se vuelva más extraña en cada frase.',
      'Inventa un cóctel inspirado en la persona de tu izquierda.',
      'Habla como un crítico gastronómico de lujo hasta tu próximo turno.',
      'Nombra tres señales de que la noche ha comenzado oficialmente.',
      'Crea un eslogan de cinco segundos para esta mesa.',
      'Deja que el grupo elija tu título ceremonial durante una ronda.',
    ],
  },
};

const PERSONA_LINES: Record<Exclude<Locale, 'fr'>, Record<string, Partial<Record<GameEvent, string[]>>>> = {
  en: {
    natasha: {
      reroll: ['BNN24 confirms: one more roll may change everything.', 'The newsroom advises keeping the useful dice.'],
      lockDie: ['That die has officially entered protective custody.', 'Confirmed: strategic preservation in progress.'],
      jackpot: ['Breaking news: the legendary 420 has appeared!', 'BNN24 interrupts all programmes: jackpot confirmed.'],
      tripleSymbol: ['Three identical symbols. The studio is concerned.', 'A triple alignment has just been confirmed.'],
      funnyCombo: ['This result will require a special report.', 'The newsroom refuses to comment, which says everything.'],
      failure: ['No jackpot, but the experiment remains newsworthy.', 'The table has spoken. Back to you in the studio.'],
    },
    feuch: {
      reroll: ['The experiment is still unstable. Roll again.', 'The fog is moving. Continue the protocol.'],
      lockDie: ['This specimen is now preserved.', 'A stable element has been isolated.'],
      jackpot: ['Protocol 420 complete. The laboratory approves.', 'A perfect alignment. Record everything.'],
      tripleSymbol: ['A rare symmetry has emerged.', 'The instruments detect a triple resonance.'],
      funnyCombo: ['The laboratory notes an entertaining anomaly.', 'Interesting. Extremely interesting.'],
      failure: ['No failure here—only unexpected data.', 'The experiment has produced a usable consequence.'],
    },
    'fee-belette': {
      reroll: ['The dice have not finished whispering.', 'Again—there is still mischief in the air.'],
      lockDie: ['Keep that one. It knows the path.', 'A little treasure has been caught.'],
      jackpot: ['The forest bells ring for the 420!', 'Even the moss is applauding.'],
      tripleSymbol: ['Three signs, one secret.', 'The forest recognises this alignment.'],
      funnyCombo: ['Oh, that one is delightfully troublesome.', 'A charming little disaster is blooming.'],
      failure: ['Not lost—merely redirected.', 'The path ends in a challenge. Naturally.'],
    },
    gerard: {
      reroll: ['I may have delivered the wrong result. Try again.', 'Another roll? I still have a parcel somewhere.'],
      lockDie: ['I will put that one aside with the registered mail.', 'Kept safely. Probably.'],
      jackpot: ['Special delivery: one authentic 420!', 'I knew this parcel was important.'],
      tripleSymbol: ['Three identical items? That complicates the paperwork.'],
      funnyCombo: ['I have no idea who ordered this, but it is yours.'],
      failure: ['No jackpot, but I do have a challenge for this address.'],
    },
    'gerard-bis': {
      reroll: ['Procedure indicates another roll.', 'The form is incomplete. Please roll again.'],
      lockDie: ['Item recorded and retained.', 'The selected die has been archived.'],
      jackpot: ['Result 420 validated by duplicate control.', 'Exceptional configuration officially registered.'],
      tripleSymbol: ['Triple occurrence entered into the register.'],
      funnyCombo: ['Administrative anomaly accepted.'],
      failure: ['The result is noncompliant but operational.'],
    },
  },
  es: {
    natasha: {
      reroll: ['BNN24 confirma: otra tirada puede cambiarlo todo.', 'La redacción aconseja conservar los dados útiles.'],
      lockDie: ['Ese dado queda oficialmente bajo protección.', 'Confirmado: conservación estratégica en curso.'],
      jackpot: ['Última hora: ¡ha aparecido el legendario 420!', 'BNN24 interrumpe la programación: jackpot confirmado.'],
      tripleSymbol: ['Tres símbolos idénticos. El estudio está preocupado.', 'Se confirma una alineación triple.'],
      funnyCombo: ['Este resultado exige un informe especial.', 'La redacción se niega a comentar, y eso lo dice todo.'],
      failure: ['No hay jackpot, pero el experimento sigue siendo noticia.', 'La mesa ha hablado. Devolvemos la conexión.'],
    },
    feuch: {
      reroll: ['El experimento sigue inestable. Tira otra vez.', 'La bruma se mueve. Continúa el protocolo.'],
      lockDie: ['Este espécimen queda conservado.', 'Se ha aislado un elemento estable.'],
      jackpot: ['Protocolo 420 completado. El laboratorio aprueba.', 'Alineación perfecta. Regístralo todo.'],
      tripleSymbol: ['Ha surgido una simetría poco común.', 'Los instrumentos detectan una triple resonancia.'],
      funnyCombo: ['El laboratorio registra una anomalía divertida.', 'Interesante. Extremadamente interesante.'],
      failure: ['Aquí no hay fracaso, solo datos inesperados.', 'El experimento ha producido una consecuencia útil.'],
    },
    'fee-belette': {
      reroll: ['Los dados aún no han terminado de susurrar.', 'Otra vez: todavía queda travesura en el aire.'],
      lockDie: ['Guarda ese. Conoce el camino.', 'Hemos atrapado un pequeño tesoro.'],
      jackpot: ['¡Las campanas del bosque celebran el 420!', 'Hasta el musgo está aplaudiendo.'],
      tripleSymbol: ['Tres señales, un secreto.', 'El bosque reconoce esta alineación.'],
      funnyCombo: ['Oh, este es deliciosamente problemático.', 'Está floreciendo un pequeño desastre encantador.'],
      failure: ['No estás perdido, solo redirigido.', 'El sendero termina en un reto. Naturalmente.'],
    },
    gerard: {
      reroll: ['Puede que haya entregado el resultado equivocado. Prueba otra vez.', '¿Otra tirada? Aún tengo un paquete por aquí.'],
      lockDie: ['Lo aparto con el correo certificado.', 'Guardado con seguridad. Probablemente.'],
      jackpot: ['Entrega especial: ¡un 420 auténtico!', 'Sabía que este paquete era importante.'],
      tripleSymbol: ['¿Tres objetos idénticos? Eso complica el papeleo.'],
      funnyCombo: ['No sé quién pidió esto, pero es tuyo.'],
      failure: ['No hay jackpot, pero tengo un reto para esta dirección.'],
    },
    'gerard-bis': {
      reroll: ['El procedimiento exige otra tirada.', 'El formulario está incompleto. Tira de nuevo.'],
      lockDie: ['Elemento registrado y conservado.', 'El dado seleccionado ha sido archivado.'],
      jackpot: ['Resultado 420 validado por control duplicado.', 'Configuración excepcional registrada oficialmente.'],
      tripleSymbol: ['Triple incidencia anotada en el registro.'],
      funnyCombo: ['Anomalía administrativa aceptada.'],
      failure: ['El resultado no es conforme, pero funciona.'],
    },
  },
};

const SHARE_COPY = {
  fr: {
    defaultHeading: '⚠️ Document déclassifié',
    headings: { natasha: '📺 Bulletin confidentiel', gerard: '📬 Courrier égaré', 'gerard-bis': '📬 Courrier égaré', marty: '📦 Livraison spéciale', 'fee-belette': '🍃 Rapport retrouvé dans la forêt', feuch: '⚠️ Document déclassifié' },
    experiment: 'Expérience 420', annotation: 'Annotation', join: "Rejoins l'expérience :",
  },
  en: {
    defaultHeading: '⚠️ Declassified document',
    headings: { natasha: '📺 Confidential bulletin', gerard: '📬 Misplaced letter', 'gerard-bis': '📬 Misplaced letter', marty: '📦 Special delivery', 'fee-belette': '🍃 Report found in the forest', feuch: '⚠️ Declassified document' },
    experiment: 'Experiment 420', annotation: 'Annotation', join: 'Join the experiment:',
  },
  es: {
    defaultHeading: '⚠️ Documento desclasificado',
    headings: { natasha: '📺 Boletín confidencial', gerard: '📬 Carta extraviada', 'gerard-bis': '📬 Carta extraviada', marty: '📦 Entrega especial', 'fee-belette': '🍃 Informe encontrado en el bosque', feuch: '⚠️ Documento desclasificado' },
    experiment: 'Experimento 420', annotation: 'Anotación', join: 'Únete al experimento:',
  },
} as const;

function stableIndex(seed: string, length: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  return Math.abs(hash) % length;
}

export function localizePacks(packs: Pack[], locale: Locale): Pack[] {
  if (locale === 'fr') return packs;
  return packs.map(pack => ({
    ...pack,
    title: PACK_META[locale][pack.id]?.title ?? pack.title,
    description: PACK_META[locale][pack.id]?.description ?? pack.description,
  }));
}

export function localizeResult(result: ComboResult, dice: Die[], packId: string, locale: Locale): ComboResult {
  if (locale === 'fr') return result;
  const faces = dice.map(d => FACE_NAMES[locale][d.face] ?? d.face);
  const challengeList = CHALLENGES[locale][packId] ?? CHALLENGES[locale].standard;
  const title = result.type === 'jackpot'
    ? (locale === 'en' ? '420 — Jackpot!' : '420 — ¡Jackpot!')
    : locale === 'en'
      ? `${faces.join(' · ')} Challenge`
      : `Reto ${faces.join(' · ')}`;
  const jackpotText = locale === 'en'
    ? 'You rolled the legendary 420! You win the round trophy immediately.'
    : '¡Has obtenido el legendario 420! Ganas inmediatamente el trofeo de la ronda.';
  return {
    ...result,
    title,
    text: result.type === 'jackpot' ? jackpotText : challengeList[stableIndex(`${packId}:${dice.map(d => d.face).sort().join('-')}`, challengeList.length)],
    characterComment: undefined,
  };
}

export function getLocalizedNarration(persona: Persona, event: GameEvent, locale: Locale): string {
  if (locale === 'fr') {
    const lines = persona.lines[event];
    return lines?.[Math.floor(Math.random() * lines.length)] ?? '';
  }
  const lines = PERSONA_LINES[locale][persona.id]?.[event] ?? PERSONA_LINES[locale].feuch?.[event] ?? [];
  return lines[Math.floor(Math.random() * lines.length)] ?? '';
}

export function getLocalizedComment(result: ComboResult, persona: Persona, locale: Locale): string {
  const event: GameEvent = result.type === 'jackpot'
    ? 'jackpot'
    : result.type === 'triple'
      ? 'tripleSymbol'
      : result.intensity >= 2
        ? 'funnyCombo'
        : 'failure';
  return getLocalizedNarration(persona, event, locale);
}

export function getShareCopy(locale: Locale, personaId?: string) {
  const copy = SHARE_COPY[locale];
  return {
    heading: (personaId && copy.headings[personaId as keyof typeof copy.headings]) || copy.defaultHeading,
    experiment: copy.experiment,
    annotation: copy.annotation,
    join: copy.join,
  };
}
