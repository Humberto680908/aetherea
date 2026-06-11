/* config.js — datos de despliegue de AETHEREA.
   Rellenar cuando existan las cuentas reales; con los campos vacíos
   la página funciona en modo demo (envío simulado, sin WhatsApp). */

const AETHEREA_CONFIG = {
  // Endpoint de Formspree (crear cuenta gratis en formspree.io,
  // apuntar al email del estudio y pegar aquí la URL del form):
  // ejemplo: 'https://formspree.io/f/xqkrzyab'
  formEndpoint: '',

  // Número de WhatsApp con código de país y sin "+":
  // ejemplo: '34600111222'
  whatsappNumber: '',

  // Google Analytics 4 (analytics.google.com → ID de medición):
  // ejemplo: 'G-XXXXXXXXXX'
  gaMeasurementId: '',

  // Meta Pixel para remarketing en Instagram/Facebook
  // (business.facebook.com → Administrador de eventos):
  // ejemplo: '1234567890123456'
  metaPixelId: ''
};
