/* planets-data.js — datos de los planetas y métricas
   derivadas para la escena (radio orbital y visual). */

const PLANETS = [
  {name:'Mercurio', emoji:'☿', au:0.39, diameter:4879, period:88, color:'#8c7853', moons:0, mass:0.33, temp:'167°C', type:'Rocoso', desc:'El más cercano al Sol. Sin atmósfera, oscila entre 430°C y -180°C.'},
  {name:'Venus', emoji:'♀', au:0.72, diameter:12104, period:225, color:'#e8c77a', moons:0, mass:4.87, temp:'464°C', type:'Rocoso', desc:'Atmósfera densa de CO₂. El planeta más caliente del sistema solar.', atmosphere:'#f4d088'},
  {name:'Tierra', emoji:'♁', au:1.00, diameter:12756, period:365, color:'#4a7ab8', moons:1, mass:5.97, temp:'15°C', type:'Rocoso', desc:'El único mundo conocido con vida. 71% de su superficie es agua.', atmosphere:'#6ab0ff', clouds:true, continents:true},
  {name:'Marte', emoji:'♂', au:1.52, diameter:6792, period:687, color:'#c1502e', moons:2, mass:0.642, temp:'-65°C', type:'Rocoso', desc:'El planeta rojo. Tuvo agua líquida y posiblemente vida microbiana.', polar:true},
  {name:'Júpiter', emoji:'♃', au:5.20, diameter:142984, period:4331, color:'#d4a574', moons:4, mass:1898, temp:'-110°C', type:'Gaseoso', desc:'El gigante. Su Gran Mancha Roja es una tormenta más grande que la Tierra.', bands:true, spot:true},
  {name:'Saturno', emoji:'♄', au:9.54, diameter:120536, period:10747, color:'#e8d89c', moons:0, mass:568, temp:'-140°C', type:'Gaseoso', desc:'Famoso por sus anillos de hielo y roca, visibles con telescopios pequeños.', rings:true, bands:true},
  {name:'Urano', emoji:'♅', au:19.18, diameter:51118, period:30687, color:'#7fc1d4', moons:0, mass:86.8, temp:'-195°C', type:'Helado', desc:'Gira de lado, con eje inclinado 98°. Su atmósfera de metano le da el tono cian.', tilt:Math.PI*98/180, atmosphere:'#a8e0ee'},
  {name:'Neptuno', emoji:'♆', au:30.06, diameter:49528, period:60190, color:'#3f5fb8', moons:0, mass:102, temp:'-200°C', type:'Helado', desc:'Vientos de hasta 2.000 km/h, los más rápidos del sistema solar.', atmosphere:'#5a85d8'}
];

PLANETS.forEach(p => {
  p.orbitRadius = Math.log(p.au * 10 + 1) * 6;
  p.visualRadius = Math.pow(p.diameter / 5000, 0.45) * 0.4;
});
