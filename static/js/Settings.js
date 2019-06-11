var settings = {
  platformGeometry: new THREE.PlaneGeometry(10000, 10000, 50, 50),

  platformMaterial: new THREE.MeshToonMaterial({
    color: 0x9988ee,
    side: THREE.DoubleSide
  }),

  edgeGeometry: new THREE.BoxGeometry(10000, 300, 200),

  edgeMaterial: new THREE.MeshNormalMaterial({
    opacity: 0.1,
    side: THREE.DoubleSide
  }),

  colors: [0xff00ff, 0xffff00, 0x00ffff, 0x45f442],

  dummyMarbleColor: 0x00000f,

  marbleGeometry: new THREE.SphereGeometry(
    100,
    50,
    50,
    0,
    Math.PI * 2,
    0,
    Math.PI * 2
  ),

  startingX: -1000,
  startingZ: -1900,
  finishZ: 700,
};
