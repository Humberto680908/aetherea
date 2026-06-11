# AETHEREA · Landing

Landing page bilingüe (ES/EN) para AETHEREA, un estudio de lecturas de tarot,
cartas natales, calendario lunar y consultas astrológicas. El hero es la escena
3D del sistema solar (Three.js, texturas procedurales) reutilizada de
`sistema-solar-3d/` — HTML/CSS/JS vanilla, sin build step.

Tono del copy: sobrio y honesto (datos astrológicos verificables, sin promesas,
testimonios marcados como ilustrativos, disclaimer legal en el footer).

## Cómo arrancar

```bash
cd casa-astral
npx serve -l 8766 .
# → http://localhost:8766
```

Cualquier servidor estático sirve (`python3 -m http.server`, Live Server, etc.).

## Estructura

```
├── index.html           Markup semántico bilingüe: todos los textos llevan data-es/data-en
├── css/
│   ├── base.css         Variables en :root, reset, botones, [hidden], .reveal
│   ├── nav.css          Nav fija con estado .is-scrolled y toggle de idioma ES/EN
│   ├── hero.css         Portada con la escena 3D de fondo (em del titular en dorado)
│   ├── services.css     4 tarjetas con numeración decorativa y enlace "Solicitar lectura →"
│   ├── pillars.css      6 pilares cósmicos con borde superior que se intensifica al hover
│   ├── zodiac.css       Carrusel infinito de los 12 signos (pausa al hover)
│   ├── moon.css         Las 4 fases lunares (clicables) + panel de detalle + fase de hoy
│   ├── sign-modal.css   Ficha modal de cada signo del zodiaco
│   ├── process.css      El proceso en 3 pasos
│   ├── testimonials.css Citas con nota de "testimonios ilustrativos"
│   ├── booking.css      Formulario (incluye fecha de nacimiento), error y éxito
│   └── footer.css       Pie con disclaimer legal y copyright
└── js/
    ├── orbit-controls.js  OrbitControls mínimo (con flag enableZoom)
    ├── noise.js           Ruido procedural y hexToRgb        ← reutilizado de sistema-solar-3d
    ├── planets-data.js    Datos de los 8 planetas            ← reutilizado
    ├── textures.js        Texturas procedurales en canvas    ← reutilizado
    ├── scene-objects.js   Estrellas, asteroides, atmósferas  ← reutilizado
    ├── hero-scene.js      Escena del hero: vuelo de entrada + drag para orbitar
    ├── nav.js             Estado de la nav al hacer scroll
    ├── zodiac.js          Datos completos de los 12 signos (elemento, modalidad, regente,
    │                      descripción ES/EN) + genera el carrusel (×2 para loop continuo)
    ├── sign-modal.js      Ficha modal al pulsar un signo, con CTA a la carta natal;
    │                      cierra con ✕, clic fuera o ESC
    ├── moon-info.js       Fase lunar REAL de hoy (ciclo sinódico de 29,53 días, sin APIs)
    │                      + panel de detalle por fase con CTA al calendario lunar
    ├── i18n.js            Toggle ES/EN: aplica data-es/data-en y data-ph-es/data-ph-en,
    │                      persiste el idioma en localStorage
    ├── reveal.js          Aparición de secciones (IntersectionObserver)
    └── form.js            Validación (nombre, email, nacimiento, lectura) y mensaje de éxito
```

## Activar el envío real del formulario y WhatsApp

Editar [js/config.js](js/config.js):

1. **Formulario** — crear cuenta gratis en formspree.io apuntando al email del
   estudio y pegar la URL en `formEndpoint`. Sin endpoint, el envío se simula.
2. **WhatsApp** — poner el número con código de país (sin `+`) en
   `whatsappNumber`. Sin número, el botón flotante no aparece.
3. **Analytics** — pegar el ID de medición GA4 en `gaMeasurementId` y/o el
   Meta Pixel en `metaPixelId`. Sin IDs no se inyecta ningún rastreador.
   Con ellos activos se registran los eventos `booking_submit` (lead) y
   `sign_calculator_used` (lead magnet).
4. **Al publicar** — convertir `og:image` en URL absoluta y añadir `og:url`
   (la imagen ya existe: `assets/og-image.jpg`, 1200×630).

## Hooks de conversión incorporados

- **Calculadora de signo solar** (`#tu-signo`): fecha de nacimiento → signo al
  instante + upsell del Big Three que deja el formulario pre-rellenado.
- **Fase lunar real de hoy** + próximas fechas de cada fase (calculadas, sin API).
- **Urgencia honesta**: banner en la agenda con la próxima luna llena real.
- **CTAs contextuales**: el modal del signo y el detalle de fase llegan al
  formulario con la lectura preseleccionada y mensaje contextual.
- **Menú móvil** (hamburguesa) y favicon/Open Graph para compartir.

## Datos provisionales (pendientes de confirmar)

- Nombre **AETHEREA** (momentáneo, según el propietario).
- Precios orientativos: Tarot 45 min/35 € · Carta natal 75 min/60 € ·
  Calendario lunar 30 min/25 € · Consulta astrológica 60 min/50 €.
- El formulario no tiene backend: muestra confirmación local.
  Pendiente conectar a email/Formspree cuando haya contacto real.

## Notas

- Los glifos zodiacales fuerzan fuente de símbolos ('Apple Symbols', 'Segoe UI Symbol')
  para evitar que macOS los pinte como emoji de color.
- El zoom con rueda está desactivado en el hero para no robar el scroll;
  el drag para orbitar sigue activo.
- `prefers-reduced-motion` desactiva reveal, smooth scroll y el carrusel automático.
