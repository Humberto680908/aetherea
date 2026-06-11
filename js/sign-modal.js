/* sign-modal.js — ficha de cada signo del zodiaco.
   Al pulsar un item del carrusel abre un modal con elemento, modalidad,
   planeta regente y descripción, más un CTA hacia el formulario.
   El contenido se genera con data-es/data-en, así el toggle de idioma
   también traduce el modal abierto. Se cierra con ✕, clic fuera o ESC. */

(function(){
  if(typeof ZODIAC_SIGNS === 'undefined') return;

  const lang = () => document.documentElement.lang === 'en' ? 'en' : 'es';

  // Estructura del modal (una sola vez, oculto)
  const overlay = document.createElement('div');
  overlay.className = 'sign-modal';
  overlay.hidden = true;
  overlay.innerHTML =
    '<div class="sign-modal__backdrop"></div>' +
    '<div class="sign-modal__panel" role="dialog" aria-modal="true">' +
      '<button type="button" class="sign-modal__close" aria-label="Cerrar">✕</button>' +
      '<div class="sign-modal__glyph"></div>' +
      '<h3 class="sign-modal__name"></h3>' +
      '<p class="sign-modal__dates"></p>' +
      '<div class="sign-modal__meta">' +
        '<div><span class="sign-modal__label" data-es="Elemento" data-en="Element">Elemento</span><span class="sign-modal__value" data-key="element"></span></div>' +
        '<div><span class="sign-modal__label" data-es="Modalidad" data-en="Modality">Modalidad</span><span class="sign-modal__value" data-key="modality"></span></div>' +
        '<div><span class="sign-modal__label" data-es="Regente" data-en="Ruler">Regente</span><span class="sign-modal__value" data-key="ruler"></span></div>' +
      '</div>' +
      '<p class="sign-modal__desc"></p>' +
      '<a class="btn sign-modal__cta" href="#reservar" data-es="Descubre tu carta natal →" data-en="Discover your birth chart →">Descubre tu carta natal →</a>' +
    '</div>';
  document.body.appendChild(overlay);

  function fill(sign){
    overlay.querySelector('.sign-modal__glyph').textContent = sign.glyph;
    const set = (sel, key) => {
      const el = overlay.querySelector(sel);
      el.setAttribute('data-es', sign.es[key]);
      el.setAttribute('data-en', sign.en[key]);
      el.innerHTML = sign[lang()][key];
    };
    set('.sign-modal__name', 'name');
    set('.sign-modal__dates', 'dates');
    set('.sign-modal__desc', 'desc');
    overlay.querySelectorAll('.sign-modal__value').forEach(el => {
      const key = el.dataset.key;
      el.setAttribute('data-es', sign.es[key]);
      el.setAttribute('data-en', sign.en[key]);
      el.innerHTML = sign[lang()][key];
    });
  }

  function open(sign){
    fill(sign);
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function close(){
    overlay.hidden = true;
    document.body.style.overflow = '';
  }

  const track = document.getElementById('zodiac-track');
  let currentSign = null;
  if(track){
    track.addEventListener('click', (e) => {
      const item = e.target.closest('.zodiac-item');
      if(!item) return;
      const sign = ZODIAC_SIGNS[Number(item.dataset.sign) % ZODIAC_SIGNS.length];
      if(sign){ currentSign = sign; open(sign); }
    });
  }

  overlay.querySelector('.sign-modal__backdrop').addEventListener('click', close);
  overlay.querySelector('.sign-modal__close').addEventListener('click', close);
  overlay.querySelector('.sign-modal__cta').addEventListener('click', (e) => {
    // Llega al formulario con la carta natal preseleccionada y contexto
    if(window.prefillBooking && currentSign){
      e.preventDefault();
      const es = 'Soy ' + currentSign.es.name + ' y quiero conocer mi carta natal completa.';
      const en = 'I am a ' + currentSign.en.name + ' and I want to know my full birth chart.';
      window.prefillBooking({lectura:'natal', mensaje: lang() === 'en' ? en : es});
    }
    close();
  });
  window.addEventListener('keydown', (e) => { if(e.key === 'Escape' && !overlay.hidden) close(); });
})();
