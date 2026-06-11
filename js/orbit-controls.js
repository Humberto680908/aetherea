/* orbit-controls.js — implementación mínima de THREE.OrbitControls
   (rotación, paneo y zoom con damping) para three.js r128 por CDN. */
(function(){
  THREE.OrbitControls = function(object, domElement){
    this.object = object; this.domElement = domElement;
    this.enabled = true;
    this.target = new THREE.Vector3();
    this.minDistance = 3; this.maxDistance = 280;
    this.enableDamping = true; this.dampingFactor = 0.08;
    this.enableZoom = true;
    this.rotateSpeed = 0.6; this.zoomSpeed = 0.9; this.panSpeed = 0.8;
    var scope = this;
    var spherical = new THREE.Spherical();
    var sphericalDelta = new THREE.Spherical();
    var scale = 1;
    var panOffset = new THREE.Vector3();
    var rotateStart = new THREE.Vector2();
    var rotateEnd = new THREE.Vector2();
    var rotateDelta = new THREE.Vector2();
    var panStart = new THREE.Vector2();
    var panEnd = new THREE.Vector2();
    var panDelta = new THREE.Vector2();
    var state = 'NONE';
    var EPS = 0.000001;
    this.update = function(){
      var offset = new THREE.Vector3();
      var quat = new THREE.Quaternion().setFromUnitVectors(object.up, new THREE.Vector3(0,1,0));
      var quatInverse = quat.clone().invert();
      offset.copy(object.position).sub(scope.target);
      offset.applyQuaternion(quat);
      spherical.setFromVector3(offset);
      spherical.theta += sphericalDelta.theta;
      spherical.phi += sphericalDelta.phi;
      spherical.phi = Math.max(EPS, Math.min(Math.PI - EPS, spherical.phi));
      spherical.radius *= scale;
      spherical.radius = Math.max(scope.minDistance, Math.min(scope.maxDistance, spherical.radius));
      scope.target.add(panOffset);
      offset.setFromSpherical(spherical);
      offset.applyQuaternion(quatInverse);
      object.position.copy(scope.target).add(offset);
      object.lookAt(scope.target);
      if(scope.enableDamping){
        sphericalDelta.theta *= (1 - scope.dampingFactor);
        sphericalDelta.phi *= (1 - scope.dampingFactor);
        panOffset.multiplyScalar(1 - scope.dampingFactor);
      } else { sphericalDelta.set(0,0,0); panOffset.set(0,0,0); }
      scale = 1;
    };
    function onMouseDown(e){
      if(!scope.enabled) return;
      if(e.button === 0) state = 'ROTATE';
      else if(e.button === 2) state = 'PAN';
      rotateStart.set(e.clientX, e.clientY);
      panStart.set(e.clientX, e.clientY);
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }
    function onMouseMove(e){
      if(state === 'ROTATE'){
        rotateEnd.set(e.clientX, e.clientY);
        rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(scope.rotateSpeed);
        sphericalDelta.theta -= 2 * Math.PI * rotateDelta.x / domElement.clientHeight;
        sphericalDelta.phi -= 2 * Math.PI * rotateDelta.y / domElement.clientHeight;
        rotateStart.copy(rotateEnd);
      } else if(state === 'PAN'){
        panEnd.set(e.clientX, e.clientY);
        panDelta.subVectors(panEnd, panStart).multiplyScalar(scope.panSpeed);
        var dist = object.position.distanceTo(scope.target);
        var v = new THREE.Vector3();
        v.setFromMatrixColumn(object.matrix, 0).multiplyScalar(-panDelta.x * dist * 0.001);
        panOffset.add(v);
        v.setFromMatrixColumn(object.matrix, 1).multiplyScalar(panDelta.y * dist * 0.001);
        panOffset.add(v);
        panStart.copy(panEnd);
      }
    }
    function onMouseUp(){
      state = 'NONE';
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
    function onWheel(e){
      if(!scope.enabled || !scope.enableZoom) return;
      e.preventDefault();
      if(e.deltaY < 0) scale /= Math.pow(0.95, scope.zoomSpeed);
      else scale *= Math.pow(0.95, scope.zoomSpeed);
    }
    function onContextMenu(e){ e.preventDefault(); }
    domElement.addEventListener('mousedown', onMouseDown);
    domElement.addEventListener('wheel', onWheel, {passive:false});
    domElement.addEventListener('contextmenu', onContextMenu);
    this.dispose = function(){
      domElement.removeEventListener('mousedown', onMouseDown);
      domElement.removeEventListener('wheel', onWheel);
      domElement.removeEventListener('contextmenu', onContextMenu);
    };
    this.update();
  };
})();
