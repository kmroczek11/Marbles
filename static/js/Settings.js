var settings = {
  platformGeometry: new THREE.PlaneGeometry(2000, 2000, 50, 50),

  platformMaterial: new THREE.MeshBasicMaterial({
    color: 0x000000,
    side: THREE.DoubleSide
  }),

  edgeGeometry: new THREE.BoxGeometry(2000, 50, 50),

  edgeMaterial: new THREE.MeshBasicMaterial({
    color: 0xd3d3d3,
    side: THREE.DoubleSide
  }),

  wallGeometry: new THREE.BoxGeometry(200, 50, 50),
  wallMaterial: new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    map: new THREE.TextureLoader().load("../gfx/wall.jpg")
  })
};
