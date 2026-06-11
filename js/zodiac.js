/* zodiac.js — datos de los 12 signos y carrusel.
   Los items se duplican (×2) para que el loop CSS sea continuo y son
   clicables: sign-modal.js abre la ficha del signo (data-sign = índice).
   Cada texto lleva data-es/data-en para que i18n.js lo traduzca. */

const ZODIAC_SIGNS = [
  {glyph:'♈', es:{name:'Aries', dates:'21 mar – 19 abr', element:'Fuego', modality:'Cardinal', ruler:'Marte', desc:'El arranque del zodiaco: iniciativa, coraje y el impulso de empezar antes de tener el plan completo.'},
              en:{name:'Aries', dates:'Mar 21 – Apr 19', element:'Fire', modality:'Cardinal', ruler:'Mars', desc:'The start of the zodiac: initiative, courage and the urge to begin before the plan is complete.'}},
  {glyph:'♉', es:{name:'Tauro', dates:'20 abr – 20 may', element:'Tierra', modality:'Fija', ruler:'Venus', desc:'Estabilidad y constancia: construir despacio, disfrutar de los sentidos y sostener lo que importa.'},
              en:{name:'Taurus', dates:'Apr 20 – May 20', element:'Earth', modality:'Fixed', ruler:'Venus', desc:'Stability and persistence: building slowly, savouring the senses and sustaining what matters.'}},
  {glyph:'♊', es:{name:'Géminis', dates:'21 may – 20 jun', element:'Aire', modality:'Mutable', ruler:'Mercurio', desc:'Curiosidad y palabra: conectar ideas, hacer preguntas y moverse entre mundos sin quedarse quieto.'},
              en:{name:'Gemini', dates:'May 21 – Jun 20', element:'Air', modality:'Mutable', ruler:'Mercury', desc:'Curiosity and language: connecting ideas, asking questions and moving between worlds.'}},
  {glyph:'♋', es:{name:'Cáncer', dates:'21 jun – 22 jul', element:'Agua', modality:'Cardinal', ruler:'Luna', desc:'Cuidado y memoria emocional: el hogar como raíz y la sensibilidad como forma de inteligencia.'},
              en:{name:'Cancer', dates:'Jun 21 – Jul 22', element:'Water', modality:'Cardinal', ruler:'Moon', desc:'Care and emotional memory: home as a root and sensitivity as a form of intelligence.'}},
  {glyph:'♌', es:{name:'Leo', dates:'23 jul – 22 ago', element:'Fuego', modality:'Fija', ruler:'Sol', desc:'Expresión y corazón: el deseo de crear, brillar y ser visto en lo que uno hace con orgullo.'},
              en:{name:'Leo', dates:'Jul 23 – Aug 22', element:'Fire', modality:'Fixed', ruler:'Sun', desc:'Expression and heart: the desire to create, shine and be seen in what one does with pride.'}},
  {glyph:'♍', es:{name:'Virgo', dates:'23 ago – 22 sep', element:'Tierra', modality:'Mutable', ruler:'Mercurio', desc:'Análisis y oficio: mejorar lo que existe, servir con precisión y encontrar lo sagrado en el detalle.'},
              en:{name:'Virgo', dates:'Aug 23 – Sep 22', element:'Earth', modality:'Mutable', ruler:'Mercury', desc:'Analysis and craft: improving what exists, serving with precision and finding the sacred in detail.'}},
  {glyph:'♎', es:{name:'Libra', dates:'23 sep – 22 oct', element:'Aire', modality:'Cardinal', ruler:'Venus', desc:'Equilibrio y vínculo: la búsqueda de armonía, la estética y el arte de ponerse en el lugar del otro.'},
              en:{name:'Libra', dates:'Sep 23 – Oct 22', element:'Air', modality:'Cardinal', ruler:'Venus', desc:'Balance and relationship: the search for harmony, aesthetics and the art of seeing the other side.'}},
  {glyph:'♏', es:{name:'Escorpio', dates:'23 oct – 21 nov', element:'Agua', modality:'Fija', ruler:'Marte · Plutón', desc:'Intensidad y transformación: mirar lo que otros evitan y renacer cada vez que algo termina.'},
              en:{name:'Scorpio', dates:'Oct 23 – Nov 21', element:'Water', modality:'Fixed', ruler:'Mars · Pluto', desc:'Intensity and transformation: facing what others avoid and being reborn each time something ends.'}},
  {glyph:'♐', es:{name:'Sagitario', dates:'22 nov – 21 dic', element:'Fuego', modality:'Mutable', ruler:'Júpiter', desc:'Sentido y expansión: viajar —por el mundo o por las ideas— buscando una verdad más grande.'},
              en:{name:'Sagittarius', dates:'Nov 22 – Dec 21', element:'Fire', modality:'Mutable', ruler:'Jupiter', desc:'Meaning and expansion: travelling —through the world or through ideas— in search of a larger truth.'}},
  {glyph:'♑', es:{name:'Capricornio', dates:'22 dic – 19 ene', element:'Tierra', modality:'Cardinal', ruler:'Saturno', desc:'Estructura y ambición paciente: subir la montaña paso a paso y hacerse responsable del propio camino.'},
              en:{name:'Capricorn', dates:'Dec 22 – Jan 19', element:'Earth', modality:'Cardinal', ruler:'Saturn', desc:'Structure and patient ambition: climbing the mountain step by step and owning one\'s path.'}},
  {glyph:'♒', es:{name:'Acuario', dates:'20 ene – 18 feb', element:'Aire', modality:'Fija', ruler:'Saturno · Urano', desc:'Ideas y comunidad: pensar distinto, romper moldes y trabajar por algo que excede lo individual.'},
              en:{name:'Aquarius', dates:'Jan 20 – Feb 18', element:'Air', modality:'Fixed', ruler:'Saturn · Uranus', desc:'Ideas and community: thinking differently, breaking moulds and working for something beyond the individual.'}},
  {glyph:'♓', es:{name:'Piscis', dates:'19 feb – 20 mar', element:'Agua', modality:'Mutable', ruler:'Júpiter · Neptuno', desc:'Sensibilidad e imaginación: disolver fronteras, intuir lo no dicho y crear desde el mundo interior.'},
              en:{name:'Pisces', dates:'Feb 19 – Mar 20', element:'Water', modality:'Mutable', ruler:'Jupiter · Neptune', desc:'Sensitivity and imagination: dissolving boundaries, sensing the unsaid and creating from the inner world.'}}
];

(function(){
  const track = document.getElementById('zodiac-track');
  if(!track) return;

  const itemHtml = (s, i) => (
    '<button type="button" class="zodiac-item" data-sign="' + i + '">' +
      '<span class="zodiac-item__glyph">' + s.glyph + '</span>' +
      '<span class="zodiac-item__name" data-es="' + s.es.name + '" data-en="' + s.en.name + '">' + s.es.name + '</span>' +
      '<span class="zodiac-item__dates" data-es="' + s.es.dates + '" data-en="' + s.en.dates + '">' + s.es.dates + '</span>' +
    '</button>'
  );

  const half = ZODIAC_SIGNS.map(itemHtml).join('');
  track.innerHTML = half + half;
})();
