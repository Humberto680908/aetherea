/* i18n.js — toggle de idioma ES/EN.
   Todos los textos traducibles llevan data-es/data-en (innerHTML)
   y los placeholders data-ph-es/data-ph-en. El idioma elegido
   se guarda en localStorage. Debe cargarse después de zodiac.js
   para cubrir también los items generados del carrusel. */

(function(){
  const STORAGE_KEY = 'aetherea-lang';

  function applyLang(lang){
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-es]').forEach(el => {
      const value = el.getAttribute('data-' + lang);
      if(value !== null) el.innerHTML = value;
    });
    document.querySelectorAll('[data-ph-es]').forEach(el => {
      const value = el.getAttribute('data-ph-' + lang);
      if(value !== null) el.placeholder = value;
    });
    document.querySelectorAll('.lang-toggle button').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.lang === lang);
    });
    try { localStorage.setItem(STORAGE_KEY, lang); } catch(e) { /* navegación privada */ }
  }

  const toggle = document.getElementById('lang-toggle');
  if(toggle){
    toggle.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-lang]');
      if(btn) applyLang(btn.dataset.lang);
    });
  }

  let saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch(e) { /* navegación privada */ }
  if(saved === 'en') applyLang('en');
})();
