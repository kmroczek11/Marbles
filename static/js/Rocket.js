class Rocket extends THREE.Mesh {
  constructor(x, z) {
    super();
    this.position.x = x;
    this.position.y = 70;
    this.position.z = z;
    var loader = new THREE.STLLoader();
    loader.load(
      "../models/rocket.stl",
      function(geometry) {
        this.geometry = geometry;
        this.material = new THREE.MeshBasicMaterial({
          map: new THREE.TextureLoader().load("../gfx/rocketTexture.jpg")
        });
      }.bind(this)
    );
    this.name = "rocket";
    this.rotation.x = Math.PI / 2;
    this.scale.set(2, 2, 2); // ustaw skalę modelu
    return this;
  }
}
