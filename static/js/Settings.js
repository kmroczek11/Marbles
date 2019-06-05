var settings = {
  platformGeometry: new THREE.PlaneGeometry(2000, 2000, 50, 50),

  platformMaterial: new THREE.MeshBasicMaterial({
    color: 0x000000,
    side: THREE.DoubleSide
  }),

  edgeGeometry: new THREE.BoxGeometry(2000, 200, 20),

  edgeMaterial: new THREE.MeshBasicMaterial({
    color: 0xd3d3d3,
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

  marbleMaterial: new THREE.MeshBasicMaterial({
    color: 0xff0000
  })
};
