var settings = {
  platformGeometry: new THREE.PlaneGeometry(10000, 10000, 50, 50),

  platformMaterial: new THREE.MeshToonMaterial({
    color: 0xbbaaff,
    side: THREE.DoubleSide
  }),

  edgeGeometry: new THREE.BoxGeometry(10000, 300, 50),

  edgeMaterial: new THREE.MeshNormalMaterial({
    opacity: 0.1,
    side: THREE.DoubleSide
  }),

  marbleGeometry: new THREE.SphereGeometry(
    100,
    50,
    50,
    0,
    Math.PI * 2,
    0,
    Math.PI * 2
  ),

  marbleMaterial: new THREE.MeshLambertMaterial({})
};
