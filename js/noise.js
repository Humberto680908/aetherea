/* noise.js — ruido procedural y utilidades de color
   compartidos por los generadores de texturas. */

function smoothNoise(x, y){
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = x - ix, fy = y - iy;
  const r = (a,b) => {
    const s = Math.sin(a*127.1 + b*311.7) * 43758.5453;
    return s - Math.floor(s);
  };
  const a = r(ix, iy), b = r(ix+1, iy), c = r(ix, iy+1), d = r(ix+1, iy+1);
  const u = fx*fx*(3-2*fx), v = fy*fy*(3-2*fy);
  return a*(1-u)*(1-v) + b*u*(1-v) + c*(1-u)*v + d*u*v;
}

function fractalNoise(x, y, oct){
  let v=0, a=0.5, f=1;
  for(let i=0; i<oct; i++){ v += a*smoothNoise(x*f, y*f); f*=2; a*=0.5; }
  return v;
}

function hexToRgb(hex){
  const v = parseInt(hex.replace('#',''), 16);
  return {r:(v>>16)&255, g:(v>>8)&255, b:v&255};
}
