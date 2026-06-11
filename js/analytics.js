/* analytics.js — Google Analytics 4 y Meta Pixel.
   Solo se cargan si sus IDs están configurados en config.js;
   con los campos vacíos no se inyecta nada (cero rastreo en demo).
   Además registra los eventos de conversión propios de la landing. */

(function(){
  const cfg = (typeof AETHEREA_CONFIG !== 'undefined') ? AETHEREA_CONFIG : {};

  /* --- Google Analytics 4 --- */
  if(cfg.gaMeasurementId){
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + cfg.gaMeasurementId;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', cfg.gaMeasurementId);
  }

  /* --- Meta Pixel --- */
  if(cfg.metaPixelId){
    !function(f,b,e,v,n,t,s){
      if(f.fbq) return; n=f.fbq=function(){ n.callMethod ? n.callMethod.apply(n,arguments) : n.queue.push(arguments); };
      if(!f._fbq) f._fbq=n; n.push=n; n.loaded=true; n.version='2.0'; n.queue=[];
      t=b.createElement(e); t.async=true; t.src=v;
      s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', cfg.metaPixelId);
    fbq('track', 'PageView');
  }

  /* --- Eventos de conversión de la landing --- */
  const track = (name, params) => {
    if(window.gtag) gtag('event', name, params || {});
    if(window.fbq) fbq('trackCustom', name, params || {});
  };

  // Lead enviado (el evento que importa)
  const bookingForm = document.getElementById('booking-form');
  if(bookingForm){
    bookingForm.addEventListener('submit', () => track('booking_submit'));
  }

  // Calculadora de signo usada (engagement del lead magnet)
  const calcForm = document.getElementById('sign-calc-form');
  if(calcForm){
    calcForm.addEventListener('submit', () => track('sign_calculator_used'));
  }
})();
