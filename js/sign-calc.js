/* sign-calc.js — calculadora de signo solar (el lead magnet).
   El visitante introduce su fecha de nacimiento y ve su signo al
   instante (reutiliza los datos de ZODIAC_SIGNS). El resultado remata
   con el upsell del Big Three: un clic deja el formulario pre-rellenado
   con la fecha, la lectura "Carta Natal" y un mensaje contextual. */

(function(){
  const form = document.getElementById('sign-calc-form');
  const result = document.getElementById('sign-result');
  if(!form || !result || typeof ZODIAC_SIGNS === 'undefined') return;

  const lang = () => document.documentElement.lang === 'en' ? 'en' : 'es';

  // Límites [mes, día] de inicio de cada signo, en orden de ZODIAC_SIGNS
  const STARTS = [
    [3,21],  // Aries
    [4,20],  // Tauro
    [5,21],  // Géminis
    [6,21],  // Cáncer
    [7,23],  // Leo
    [8,23],  // Virgo
    [9,23],  // Libra
    [10,23], // Escorpio
    [11,22], // Sagitario
    [12,22], // Capricornio
    [1,20],  // Acuario
    [2,19]   // Piscis
  ];

  function signIndexFor(month, day){
    // Recorre los signos: pertenece al último cuyo inicio ya pasó.
    // Capricornio cruza el año (22 dic – 19 ene).
    for(let i = 0; i < STARTS.length; i++){
      const [sm, sd] = STARTS[i];
      const next = STARTS[(i + 1) % STARTS.length];
      const afterStart = (month > sm) || (month === sm && day >= sd);
      const beforeNext = (month < next[0]) || (month === next[0] && day < next[1]);
      if(sm <= next[0] ? (afterStart && beforeNext) : (afterStart || beforeNext)) return i;
    }
    return 0;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = form.elements.fecha.value;
    if(!value) return;
    const [, month, day] = value.split('-').map(Number);
    const sign = ZODIAC_SIGNS[signIndexFor(month, day)];
    const L = lang();
    const set = (esText, enText) => 'data-es="' + esText + '" data-en="' + enText + '"';

    const youAreEs = 'Tu signo solar es <strong>' + sign.es.name + '</strong>';
    const youAreEn = 'Your sun sign is <strong>' + sign.en.name + '</strong>';
    const upsellEs = 'El Sol es solo un tercio de tu Big Three. Tu <strong>Luna</strong> (mundo emocional) y tu <strong>ascendente</strong> (cómo te ve el mundo) necesitan la hora y el lugar exactos de tu nacimiento.';
    const upsellEn = 'The Sun is only a third of your Big Three. Your <strong>Moon</strong> (emotional world) and your <strong>rising sign</strong> (how the world sees you) require your exact time and place of birth.';

    result.innerHTML =
      '<div class="sign-result__glyph">' + sign.glyph + '</div>' +
      '<p class="sign-result__name" ' + set(youAreEs, youAreEn) + '>' + (L === 'en' ? youAreEn : youAreEs) + '</p>' +
      '<div class="sign-result__meta">' +
        '<div><span class="sign-result__label" data-es="Elemento" data-en="Element">' + (L === 'en' ? 'Element' : 'Elemento') + '</span><span class="sign-result__value" ' + set(sign.es.element, sign.en.element) + '>' + sign[L].element + '</span></div>' +
        '<div><span class="sign-result__label" data-es="Modalidad" data-en="Modality">' + (L === 'en' ? 'Modality' : 'Modalidad') + '</span><span class="sign-result__value" ' + set(sign.es.modality, sign.en.modality) + '>' + sign[L].modality + '</span></div>' +
        '<div><span class="sign-result__label" data-es="Regente" data-en="Ruler">' + (L === 'en' ? 'Ruler' : 'Regente') + '</span><span class="sign-result__value" ' + set(sign.es.ruler, sign.en.ruler) + '>' + sign[L].ruler + '</span></div>' +
      '</div>' +
      '<p class="sign-result__desc" ' + set(sign.es.desc, sign.en.desc) + '>' + sign[L].desc + '</p>' +
      '<p class="sign-result__upsell" ' + set(upsellEs, upsellEn) + '>' + (L === 'en' ? upsellEn : upsellEs) + '</p>' +
      '<button type="button" class="btn sign-result__cta" data-es="Quiero mi Big Three completo →" data-en="I want my full Big Three →">' + (L === 'en' ? 'I want my full Big Three →' : 'Quiero mi Big Three completo →') + '</button>';

    result.hidden = false;

    result.querySelector('.sign-result__cta').addEventListener('click', () => {
      const msgEs = 'Mi signo solar es ' + sign.es.name + '. Quiero mi Big Three completo (Sol, Luna y ascendente).';
      const msgEn = 'My sun sign is ' + sign.en.name + '. I want my full Big Three (Sun, Moon and rising).';
      window.prefillBooking({
        lectura: 'natal',
        nacimiento: value,
        mensaje: lang() === 'en' ? msgEn : msgEs
      });
    });
  });
})();
