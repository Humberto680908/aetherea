/* hero-scene.js — escena 3D del sistema solar como fondo del hero.
   Adaptación vanilla del componente original: mismas estrellas, Sol,
   planetas con texturas procedurales, lunas, anillos y atmósferas.
   Zoom desactivado para no secuestrar el scroll de la página. */

(function(){
  const mount = document.getElementById('hero-scene');
  if(!mount || !window.THREE) return;

  const W = mount.clientWidth, H = mount.clientHeight;
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000510, 0.0008);
  const camera = new THREE.PerspectiveCamera(50, W/H, 0.1, 2000);
  camera.position.set(0, 200, 400);
  const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true, powerPreference:'high-performance'});
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  mount.appendChild(renderer.domElement);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.minDistance = 20;
  controls.maxDistance = 280;
  controls.enableZoom = false;

  scene.add(makeStars());
  scene.add(makeAsteroidBelt());
  scene.add(new THREE.AmbientLight(0xffffff, 0.06));

  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(3, 64, 64),
    new THREE.MeshBasicMaterial({map:makeSunTexture(), color:0xffeecc})
  );
  scene.add(sun);

  const coronaMat = new THREE.SpriteMaterial({map:makeGlowTexture(), color:0xffaa33, transparent:true, blending:THREE.AdditiveBlending, opacity:0.9});
  const corona1 = new THREE.Sprite(coronaMat); corona1.scale.set(10, 10, 1); scene.add(corona1);
  const coronaMat2 = new THREE.SpriteMaterial({map:makeGlowTexture(), color:0xff8833, transparent:true, blending:THREE.AdditiveBlending, opacity:0.5});
  const corona2 = new THREE.Sprite(coronaMat2); corona2.scale.set(18, 18, 1); scene.add(corona2);
  const coronaMat3 = new THREE.SpriteMaterial({map:makeGlowTexture(), color:0xff6622, transparent:true, blending:THREE.AdditiveBlending, opacity:0.25});
  const corona3 = new THREE.Sprite(coronaMat3); corona3.scale.set(30, 30, 1); scene.add(corona3);

  const sunLight = new THREE.PointLight(0xffeecc, 2.5, 500, 0.8);
  scene.add(sunLight);

  const planetMeshes = [];

  PLANETS.forEach(p => {
    const group = new THREE.Group();
    let mat, mesh;
    if(p.continents){
      mat = new THREE.MeshPhongMaterial({map:makeEarthTexture(), shininess:25, specular:0x222244});
      mesh = new THREE.Mesh(new THREE.SphereGeometry(p.visualRadius, 64, 64), mat);
      const clouds = new THREE.Mesh(
        new THREE.SphereGeometry(p.visualRadius * 1.015, 48, 48),
        new THREE.MeshLambertMaterial({map:makeCloudsTexture(), transparent:true, opacity:0.7, depthWrite:false})
      );
      mesh.add(clouds);
      mesh.userData.clouds = clouds;
    } else if(p.bands){
      let bandColors;
      if(p.name === 'Júpiter') bandColors = ['#d4a574', '#b88a5a', '#e0b585', '#a87a4d', '#c79968', '#b88a5a', '#d4a574'];
      else bandColors = ['#e8d89c', '#d4c084', '#f0e0a8', '#c9b078', '#e0cc90', '#dcc88c'];
      mat = new THREE.MeshLambertMaterial({map:makeGasGiantTexture(p.color, bandColors, p.spot)});
      mesh = new THREE.Mesh(new THREE.SphereGeometry(p.visualRadius, 64, 64), mat);
    } else {
      const variation = p.name === 'Marte' ? '#7a2a15' : (p.name === 'Mercurio' ? '#5a4530' : '#3a3a5a');
      mat = new THREE.MeshLambertMaterial({map:makeRockyTexture(p.color, variation, p.polar)});
      mesh = new THREE.Mesh(new THREE.SphereGeometry(p.visualRadius, 64, 64), mat);
    }
    if(p.tilt) mesh.rotation.z = p.tilt;
    group.add(mesh);

    if(p.atmosphere){
      const atm = makeAtmosphere(p.visualRadius, p.atmosphere);
      if(p.tilt) atm.rotation.z = p.tilt;
      group.add(atm);
    }

    if(p.rings){
      const ringTex = makeSaturnRingsTexture();
      const ringGeom = new THREE.RingGeometry(p.visualRadius * 1.4, p.visualRadius * 2.4, 96);
      const pos = ringGeom.attributes.position;
      const uv = ringGeom.attributes.uv;
      for(let i=0; i<pos.count; i++){
        const x = pos.getX(i), y = pos.getY(i);
        const r = Math.sqrt(x*x + y*y);
        const t = (r - p.visualRadius * 1.4) / (p.visualRadius * 2.4 - p.visualRadius * 1.4);
        uv.setXY(i, t, 0.5);
      }
      const ringMat = new THREE.MeshBasicMaterial({map:ringTex, side:THREE.DoubleSide, transparent:true, depthWrite:false});
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.rotation.x = Math.PI / 2 - (27 * Math.PI / 180);
      group.add(ring);
    }

    const moons = [];
    for(let m=0; m<p.moons; m++){
      const moon = new THREE.Mesh(
        new THREE.SphereGeometry(Math.max(p.visualRadius * 0.18, 0.06), 24, 24),
        new THREE.MeshLambertMaterial({color:0xbbbbaa})
      );
      moon.userData = {angleOffset:(m/p.moons)*Math.PI*2, distance:p.visualRadius*(2.2+m*0.7), speed:0.6+m*0.3};
      group.add(moon);
      moons.push(moon);
    }

    group.userData = {planet:p, mesh, moons, angle:Math.random()*Math.PI*2};
    scene.add(group);
    planetMeshes.push(group);

    const orbitGeom = new THREE.RingGeometry(p.orbitRadius - 0.03, p.orbitRadius + 0.03, 256);
    const orbitMat = new THREE.MeshBasicMaterial({color:p.color, side:THREE.DoubleSide, transparent:true, opacity:0.15, depthWrite:false});
    const orbit = new THREE.Mesh(orbitGeom, orbitMat);
    orbit.rotation.x = Math.PI / 2;
    scene.add(orbit);
  });

  // Vuelo de entrada hacia la posición de reposo
  // El target queda por encima del plano orbital para que el sistema
  // se encuadre en la mitad inferior del hero, bajo el titular.
  let tween = {start:performance.now()+200, duration:2500, fromPos:new THREE.Vector3(0, 200, 400), toPos:new THREE.Vector3(0, 38, 130), fromTarget:new THREE.Vector3(0,0,0), toTarget:new THREE.Vector3(0, 32, 0)};

  const SPEED = 100; // misma velocidad que el 100× del visor original
  let lastTime = performance.now();

  function animate(){
    const now = performance.now();
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    const pulse = Math.sin(now * 0.0008);
    coronaMat.opacity = 0.85 + pulse * 0.1;
    coronaMat2.opacity = 0.45 + pulse * 0.08;
    coronaMat3.opacity = 0.22 + pulse * 0.05;
    corona1.scale.setScalar(10 + pulse * 0.4);
    corona2.scale.setScalar(18 + pulse * 0.6);
    sunLight.intensity = 2.5 + pulse * 0.2;
    sun.rotation.y += dt * 0.04;

    if(tween){
      const elapsed = now - tween.start;
      if(elapsed >= 0){
        const t = Math.min(elapsed / tween.duration, 1);
        const ease = t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;
        camera.position.lerpVectors(tween.fromPos, tween.toPos, ease);
        controls.target.lerpVectors(tween.fromTarget, tween.toTarget, ease);
        if(t >= 1) tween = null;
      }
    }

    planetMeshes.forEach(group => {
      const p = group.userData.planet;
      const angSpeed = (1 / p.period) * SPEED * 0.05;
      group.userData.angle += angSpeed * dt * 60;
      group.position.set(
        Math.cos(group.userData.angle) * p.orbitRadius,
        0,
        Math.sin(group.userData.angle) * p.orbitRadius
      );
      group.userData.mesh.rotation.y += dt * (SPEED * 0.0005 + 0.015);
      if(group.userData.mesh.userData.clouds){
        group.userData.mesh.userData.clouds.rotation.y += dt * 0.005;
      }
      group.userData.moons.forEach(m => {
        const ma = now * 0.001 * m.userData.speed * (SPEED * 0.01 + 0.5) + m.userData.angleOffset;
        m.position.set(Math.cos(ma) * m.userData.distance, Math.sin(ma * 0.3) * m.userData.distance * 0.1, Math.sin(ma) * m.userData.distance);
      });
    });

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener('resize', () => {
    const w = mount.clientWidth, h = mount.clientHeight;
    camera.aspect = w/h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
})();
