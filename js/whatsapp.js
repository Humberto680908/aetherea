/* whatsapp.js — botón flotante de WhatsApp.
   Solo aparece si AETHEREA_CONFIG.whatsappNumber está configurado. */

(function(){
  const number = (typeof AETHEREA_CONFIG !== 'undefined' && AETHEREA_CONFIG.whatsappNumber) || '';
  if(!number) return;

  const lang = () => document.documentElement.lang === 'en' ? 'en' : 'es';
  const text = encodeURIComponent(lang() === 'en'
    ? 'Hi! I found AETHEREA online and I would like to book a reading.'
    : '¡Hola! Encontré AETHEREA en internet y me gustaría agendar una lectura.');

  const a = document.createElement('a');
  a.className = 'whatsapp-fab';
  a.href = 'https://wa.me/' + number + '?text=' + text;
  a.target = '_blank';
  a.rel = 'noopener';
  a.setAttribute('aria-label', 'WhatsApp');
  a.innerHTML = '<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3a8.2 8.2 0 1 1 7.1 3.8zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.6.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.4-3c-.3-.4 0-.5.2-.7l.4-.5c.1-.2.1-.3 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.8 2.8 4.5 3.9 2.6 1.1 2.6.7 3.1.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.2-.3-.2-.7-.3z"/></svg>';
  document.body.appendChild(a);
})();
