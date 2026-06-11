/* textures.js — generadores de texturas procedurales en canvas
   (planetas rocosos, Tierra, nubes, gigantes gaseosos, anillos,
   Sol y halo). Dependen de noise.js y THREE. */

function makeRockyTexture(baseColor, variation, hasPolar){
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 512;
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(1024, 512);
  const base = hexToRgb(baseColor);
  const vari = hexToRgb(variation);
  for(let y=0; y<512; y++){
    for(let x=0; x<1024; x++){
      const lat = (y / 512) * Math.PI;
      const n1 = fractalNoise(x * 0.02, y * 0.02, 5);
      const n2 = fractalNoise(x * 0.08, y * 0.08, 3) * 0.3;
      const n = Math.max(0, Math.min(1, n1 + n2));
      const i = (y * 1024 + x) * 4;
      let r = base.r * (0.6 + n * 0.8) + vari.r * n * 0.3;
      let g = base.g * (0.6 + n * 0.8) + vari.g * n * 0.3;
      let b = base.b * (0.6 + n * 0.8) + vari.b * n * 0.3;
      if(hasPolar){
        const polar = Math.max(0, Math.abs(Math.cos(lat)) - 0.85) * 6;
        r = r + (255 - r) * polar; g = g + (255 - g) * polar; b = b + (255 - b) * polar;
      }
      img.data[i] = Math.min(255, r);
      img.data[i+1] = Math.min(255, g);
      img.data[i+2] = Math.min(255, b);
      img.data[i+3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return new THREE.CanvasTexture(c);
}

function makeEarthTexture(){
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 512;
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(1024, 512);
  for(let y=0; y<512; y++){
    for(let x=0; x<1024; x++){
      const lat = (y / 512) * Math.PI;
      const latNorm = Math.cos(lat);
      const n1 = fractalNoise(x * 0.012, y * 0.018, 6);
      const n2 = fractalNoise(x * 0.05 + 100, y * 0.05, 4) * 0.2;
      const land = n1 + n2 - 0.45;
      const i = (y * 1024 + x) * 4;
      let r, g, b;
      if(land > 0.05){
        const greenness = Math.max(0, 1 - Math.abs(latNorm) * 1.2);
        const dry = fractalNoise(x*0.03+200, y*0.03, 3);
        if(land > 0.18){
          r = 90 + dry*40; g = 70 + dry*30; b = 50;
        } else {
          r = 60 + dry*60 - greenness*30; g = 100 + greenness*60; b = 40 + dry*20;
        }
      } else {
        const depth = Math.min(1, -land * 4);
        r = 20 + (1-depth)*30; g = 50 + (1-depth)*60; b = 110 + (1-depth)*60;
      }
      const polar = Math.max(0, Math.abs(latNorm) - 0.82) * 6;
      r = r + (240 - r) * polar; g = g + (245 - g) * polar; b = b + (250 - b) * polar;
      img.data[i] = Math.min(255, r);
      img.data[i+1] = Math.min(255, g);
      img.data[i+2] = Math.min(255, b);
      img.data[i+3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return new THREE.CanvasTexture(c);
}

function makeCloudsTexture(){
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 512;
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(1024, 512);
  for(let y=0; y<512; y++){
    for(let x=0; x<1024; x++){
      const n = fractalNoise(x * 0.015, y * 0.025, 5);
      const cloud = Math.max(0, n - 0.5) * 2;
      const i = (y * 1024 + x) * 4;
      img.data[i] = 255; img.data[i+1] = 255; img.data[i+2] = 255;
      img.data[i+3] = cloud * 200;
    }
  }
  ctx.putImageData(img, 0, 0);
  return new THREE.CanvasTexture(c);
}

function makeGasGiantTexture(baseColor, bandColors, hasSpot){
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 512;
  const ctx = c.getContext('2d');
  for(let y=0; y<512; y++){
    const lat = y / 512;
    const bandPos = lat * 14;
    const bandFloor = Math.floor(bandPos);
    const bandFrac = bandPos - bandFloor;
    const cIdx = bandFloor % bandColors.length;
    const nIdx = (bandFloor + 1) % bandColors.length;
    const col1 = hexToRgb(bandColors[cIdx]);
    const col2 = hexToRgb(bandColors[nIdx]);
    const t = bandFrac < 0.5 ? bandFrac * 2 : (1 - bandFrac) * 2;
    const blend = t * 0.4;
    const r = col1.r * (1 - blend) + col2.r * blend;
    const g = col1.g * (1 - blend) + col2.g * blend;
    const b = col1.b * (1 - blend) + col2.b * blend;
    for(let x=0; x<1024; x++){
      const turb = fractalNoise(x * 0.015, y * 0.04, 4) * 30 - 15;
      ctx.fillStyle = 'rgb('+Math.max(0,Math.min(255,r+turb))+','+Math.max(0,Math.min(255,g+turb))+','+Math.max(0,Math.min(255,b+turb))+')';
      ctx.fillRect(x, y, 1, 1);
    }
  }
  if(hasSpot){
    const cx = 700, cy = 320, rx = 80, ry = 35;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx);
    grad.addColorStop(0, 'rgba(180,60,40,0.95)');
    grad.addColorStop(0.6, 'rgba(160,80,50,0.7)');
    grad.addColorStop(1, 'rgba(140,90,60,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  return new THREE.CanvasTexture(c);
}

function makeSaturnRingsTexture(){
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 64;
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(1024, 64);
  for(let x=0; x<1024; x++){
    const t = x / 1024;
    const cassini = Math.max(0, 1 - Math.abs(t - 0.55) * 30);
    const ringDensity = (Math.sin(t * 80) * 0.15 + 0.85) * (1 - cassini * 0.85);
    const variation = fractalNoise(t * 50, 0, 3);
    const brightness = ringDensity * (0.6 + variation * 0.5);
    let r = 220 * brightness, g = 200 * brightness, b = 150 * brightness;
    const alpha = ringDensity * 220;
    for(let y=0; y<64; y++){
      const i = (y * 1024 + x) * 4;
      img.data[i] = r; img.data[i+1] = g; img.data[i+2] = b; img.data[i+3] = alpha;
    }
  }
  ctx.putImageData(img, 0, 0);
  return new THREE.CanvasTexture(c);
}

function makeSunTexture(){
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 512;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#ffaa33'; ctx.fillRect(0,0,1024,512);
  for(let y=0; y<512; y+=2){
    for(let x=0; x<1024; x+=2){
      const n = fractalNoise(x * 0.02, y * 0.02, 5);
      const hot = fractalNoise(x*0.05+50, y*0.05, 3);
      const r = 255;
      const g = 140 + n * 100 + hot * 40;
      const b = 30 + n * 60;
      ctx.fillStyle = 'rgb(255,'+Math.min(255,g)+','+Math.min(255,b)+')';
      ctx.fillRect(x, y, 2, 2);
    }
  }
  return new THREE.CanvasTexture(c);
}

function makeGlowTexture(){
  const c = document.createElement('canvas');
  c.width = 256; c.height = 256;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(128,128,0,128,128,128);
  g.addColorStop(0, 'rgba(255,220,150,1)');
  g.addColorStop(0.15, 'rgba(255,180,80,0.7)');
  g.addColorStop(0.4, 'rgba(255,120,40,0.3)');
  g.addColorStop(0.7, 'rgba(255,80,30,0.08)');
  g.addColorStop(1, 'rgba(255,80,20,0)');
  ctx.fillStyle = g; ctx.fillRect(0,0,256,256);
  return new THREE.CanvasTexture(c);
}
