/* moon-info.js — interactividad de la sección de fases lunares.
   1) Calcula la fase lunar REAL de hoy (edad del ciclo sinódico de
      29,53 días desde una luna nueva de referencia) y la muestra.
   2) Cada tarjeta de fase despliega un panel con significado, práctica
      y dato astronómico, con CTA hacia el Calendario Lunar. */

(function(){
  const lang = () => document.documentElement.lang === 'en' ? 'en' : 'es';

  /* --- Fase real de hoy --- */

  const SYNODIC = 29.53058867; // días del ciclo sinódico
  const REF_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14); // luna nueva de referencia

  function moonAge(date){
    const days = (date.getTime() - REF_NEW_MOON) / 86400000;
    return ((days % SYNODIC) + SYNODIC) % SYNODIC;
  }

  const TODAY_PHASES = [
    {max: 1.85,  icon:'🌑', es:'Luna nueva',          en:'New moon'},
    {max: 5.54,  icon:'🌒', es:'Luna creciente',      en:'Waxing crescent'},
    {max: 9.23,  icon:'🌓', es:'Cuarto creciente',    en:'First quarter'},
    {max: 12.92, icon:'🌔', es:'Gibosa creciente',    en:'Waxing gibbous'},
    {max: 16.61, icon:'🌕', es:'Luna llena',          en:'Full moon'},
    {max: 20.30, icon:'🌖', es:'Gibosa menguante',    en:'Waning gibbous'},
    {max: 23.99, icon:'🌗', es:'Cuarto menguante',    en:'Last quarter'},
    {max: 27.68, icon:'🌘', es:'Luna menguante',      en:'Waning crescent'},
    {max: 29.54, icon:'🌑', es:'Luna nueva',          en:'New moon'}
  ];

  const badge = document.getElementById('moon-today');
  if(badge){
    const age = moonAge(new Date());
    const phase = TODAY_PHASES.find(p => age < p.max) || TODAY_PHASES[0];
    const day = Math.floor(age) + 1;
    badge.setAttribute('data-es', phase.icon + ' Hoy: ' + phase.es + ' · día ' + day + ' del ciclo');
    badge.setAttribute('data-en', phase.icon + ' Today: ' + phase.en + ' · day ' + day + ' of the cycle');
    badge.innerHTML = badge.getAttribute('data-' + lang());
  }

  /* --- Detalle de cada fase --- */

  const PHASES = {
    nueva: {
      es: {title:'Luna Nueva', meaning:'El cielo a oscuras: Sol y Luna se alinean y el ciclo vuelve a cero. Es el momento simbólico de los inicios — sembrar intenciones antes de actuar.', practice:'Práctica: escribe de una a tres intenciones para el ciclo. Sin planes todavía, solo dirección.', fact:'Dato: la Luna está entre la Tierra y el Sol; su cara iluminada no mira hacia nosotros (≈0 % visible).'},
      en: {title:'New Moon', meaning:'A dark sky: Sun and Moon align and the cycle resets. The symbolic moment of beginnings — planting intentions before acting.', practice:'Practice: write down one to three intentions for the cycle. No plans yet, just direction.', fact:'Fact: the Moon sits between Earth and Sun; its lit face points away from us (≈0% visible).'}
    },
    creciente: {
      es: {title:'Cuarto Creciente', meaning:'La mitad iluminada y subiendo: la energía del impulso. Lo sembrado pide acción y aparecen los primeros obstáculos reales.', practice:'Práctica: da el primer paso concreto de tu intención, aunque sea pequeño. La fricción es parte de la fase.', fact:'Dato: ocurre ~7,4 días tras la luna nueva; vemos iluminado exactamente el 50 % del disco.'},
      en: {title:'First Quarter', meaning:'Half-lit and growing: the energy of momentum. What was planted demands action, and the first real obstacles appear.', practice:'Practice: take the first concrete step of your intention, however small. Friction is part of this phase.', fact:'Fact: it occurs ~7.4 days after the new moon; exactly 50% of the disc is lit.'}
    },
    llena: {
      es: {title:'Luna Llena', meaning:'El punto de máxima luz: lo que empezó en la luna nueva se ve completo, con sus logros y sus excesos. Fase de culminación y claridad.', practice:'Práctica: revisa qué se cumplió de tus intenciones y agradece — también lo que no salió: ahí hay información.', fact:'Dato: la Tierra queda entre el Sol y la Luna; el disco se ve 100 % iluminado (~día 14,8 del ciclo).'},
      en: {title:'Full Moon', meaning:'The point of maximum light: what began at the new moon is now visible in full, with its achievements and its excesses. A phase of culmination and clarity.', practice:'Practice: review which intentions came true and give thanks — including what didn\'t work: there is information there.', fact:'Fact: Earth sits between Sun and Moon; the disc appears 100% lit (~day 14.8 of the cycle).'}
    },
    menguante: {
      es: {title:'Cuarto Menguante', meaning:'La luz se retira: tiempo de soltar, limpiar y cerrar lo que ya cumplió su función antes de que el ciclo vuelva a empezar.', practice:'Práctica: ordena, despídete de un hábito o tarea que ya no aporta, y deja espacio vacío a propósito.', fact:'Dato: ocurre ~22,1 días tras la luna nueva; vuelve a verse el 50 % del disco, pero del lado contrario.'},
      en: {title:'Last Quarter', meaning:'The light withdraws: time to release, clear out and close what has served its purpose before the cycle begins again.', practice:'Practice: tidy up, let go of a habit or task that no longer serves, and leave empty space on purpose.', fact:'Fact: it occurs ~22.1 days after the new moon; 50% of the disc is lit again, on the opposite side.'}
    }
  };

  /* --- Próximas fechas reales de cada fase ---
     Las fases no caen en fechas fijas del año: se repiten cada 29,53 días.
     Calculamos las próximas ocurrencias a partir de la edad lunar actual. */

  const PHASE_AGE = { nueva: 0, creciente: SYNODIC * 0.25, llena: SYNODIC * 0.5, menguante: SYNODIC * 0.75 };

  function nextOccurrences(phaseKey, count){
    const now = new Date();
    const age = moonAge(now);
    let delta = (PHASE_AGE[phaseKey] - age + SYNODIC) % SYNODIC;
    if(delta < 0.5) delta += SYNODIC; // si es hoy mismo, salta a la siguiente
    const dates = [];
    for(let i = 0; i < count; i++){
      dates.push(new Date(now.getTime() + (delta + i * SYNODIC) * 86400000));
    }
    return dates;
  }

  const fmt = (d, locale) => d.toLocaleDateString(locale, {day:'numeric', month:'short'});
  const fmtList = (dates, locale) => dates.map(d => fmt(d, locale)).join(' · ');

  /* Urgencia honesta en la sección de agenda: la próxima luna llena real */
  const urgency = document.getElementById('booking-urgency');
  if(urgency){
    const nextFull = nextOccurrences('llena', 1)[0];
    urgency.setAttribute('data-es', '🌕 Próxima luna llena: ' + fmt(nextFull, 'es-ES') + ' — las consultas de tránsitos se agendan antes de cada plenilunio.');
    urgency.setAttribute('data-en', '🌕 Next full moon: ' + fmt(nextFull, 'en-US') + ' — transit consultations are booked before each full moon.');
    urgency.innerHTML = urgency.getAttribute('data-' + lang());
  }

  const detail = document.getElementById('moon-detail');
  const cards = document.querySelectorAll('.moon-phase[data-phase]');
  if(!detail || !cards.length) return;

  // Próxima fecha en cada tarjeta
  cards.forEach(card => {
    const next = nextOccurrences(card.dataset.phase, 1)[0];
    const p = document.createElement('p');
    p.className = 'moon-phase__next';
    p.setAttribute('data-es', 'Próxima: ' + fmt(next, 'es-ES'));
    p.setAttribute('data-en', 'Next: ' + fmt(next, 'en-US'));
    p.innerHTML = p.getAttribute('data-' + lang());
    card.appendChild(p);
  });

  let current = null;

  function render(key){
    const d = PHASES[key];
    const next3 = nextOccurrences(key, 3);
    const datesEs = 'Próximas fechas: ' + fmtList(next3, 'es-ES');
    const datesEn = 'Upcoming dates: ' + fmtList(next3, 'en-US');
    const set = (esText, enText) => 'data-es="' + esText + '" data-en="' + enText + '"';
    detail.innerHTML =
      '<h3 class="moon-detail__title" ' + set(d.es.title, d.en.title) + '>' + d[lang()].title + '</h3>' +
      '<p class="moon-detail__dates" ' + set(datesEs, datesEn) + '>' + (lang() === 'en' ? datesEn : datesEs) + '</p>' +
      '<p class="moon-detail__meaning" ' + set(d.es.meaning, d.en.meaning) + '>' + d[lang()].meaning + '</p>' +
      '<p class="moon-detail__practice" ' + set(d.es.practice, d.en.practice) + '>' + d[lang()].practice + '</p>' +
      '<p class="moon-detail__fact" ' + set(d.es.fact, d.en.fact) + '>' + d[lang()].fact + '</p>' +
      '<a class="moon-detail__cta" href="#reservar"><span data-es="Pide tu calendario lunar" data-en="Request your lunar calendar">Pide tu calendario lunar</span> <span>→</span></a>';

    // CTA contextual: llega al formulario con el calendario lunar preseleccionado
    detail.querySelector('.moon-detail__cta').addEventListener('click', (e) => {
      if(window.prefillBooking){
        e.preventDefault();
        window.prefillBooking({lectura:'lunar'});
      }
    });
  }

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const key = card.dataset.phase;
      if(current === key){
        current = null;
        detail.hidden = true;
        card.classList.remove('is-active');
        return;
      }
      current = key;
      cards.forEach(c => c.classList.toggle('is-active', c === card));
      render(key);
      detail.hidden = false;
    });
  });
})();
