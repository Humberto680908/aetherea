/* scene-objects.js — objetos de la escena 3D: campo de estrellas,
   cinturón de asteroides y atmósferas con shader de glow. */

function makeStars(){
  const geom = new THREE.BufferGeometry();
  const count = 12000;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for(let i=0; i<count; i++){
    const r = 280 + Math.random() * 100;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i*3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i*3+2] = r * Math.cos(phi);
    const t = Math.random();
    if(t < 0.7){ colors[i*3]=1; colors[i*3+1]=1; colors[i*3+2]=1; }
    else if(t < 0.85){ colors[i*3]=0.7; colors[i*3+1]=0.8; colors[i*3+2]=1; }
    else if(t < 0.95){ colors[i*3]=1; colors[i*3+1]=0.9; colors[i*3+2]=0.7; }
    else { colors[i*3]=1; colors[i*3+1]=0.6; colors[i*3+2]=0.5; }
  }
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const mat = new THREE.PointsMaterial({size:0.6, sizeAttenuation:true, vertexColors:true, transparent:true, opacity:0.9});
  return new THREE.Points(geom, mat);
}

function makeAsteroidBelt(){
  const count = 800;
  const geom = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const innerR = Math.log(2.2 * 10 + 1) * 6;
  const outerR = Math.log(3.2 * 10 + 1) * 6;
  for(let i=0; i<count; i++){
    const r = innerR + Math.random() * (outerR - innerR);
    const a = Math.random() * Math.PI * 2;
    positions[i*3] = Math.cos(a) * r;
    positions[i*3+1] = (Math.random() - 0.5) * 0.8;
    positions[i*3+2] = Math.sin(a) * r;
  }
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({color:0x886655, size:0.3, sizeAttenuation:true, transparent:true, opacity:0.6});
  return new THREE.Points(geom, mat);
}

const atmosphereVertex = [
  'varying vec3 vNormal;',
  'varying vec3 vWorldPos;',
  'void main(){',
  '  vNormal = normalize(normalMatrix * normal);',
  '  vec4 wp = modelMatrix * vec4(position, 1.0);',
  '  vWorldPos = wp.xyz;',
  '  gl_Position = projectionMatrix * viewMatrix * wp;',
  '}'
].join('\n');

const atmosphereFragment = [
  'uniform vec3 glowColor;',
  'uniform float power;',
  'varying vec3 vNormal;',
  'varying vec3 vWorldPos;',
  'void main(){',
  '  vec3 viewDir = normalize(cameraPosition - vWorldPos);',
  '  float intensity = pow(1.0 - abs(dot(vNormal, viewDir)), power);',
  '  gl_FragColor = vec4(glowColor, intensity);',
  '}'
].join('\n');

function makeAtmosphere(radius, color){
  const geom = new THREE.SphereGeometry(radius * 1.15, 48, 48);
  const mat = new THREE.ShaderMaterial({
    vertexShader: atmosphereVertex,
    fragmentShader: atmosphereFragment,
    uniforms: {
      glowColor: {value: new THREE.Color(color)},
      power: {value: 2.5}
    },
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false
  });
  return new THREE.Mesh(geom, mat);
}
