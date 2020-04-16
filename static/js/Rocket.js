class Rocket extends THREE.Mesh {
  constructor(x, y, z) {
    super();
    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
    var loader = new THREE.STLLoader();
    loader.load(
      "../models/rocket.stl",
      function (geometry) {
        this.geometry = geometry;
        this.material = new THREE.MeshNormalMaterial();
      }.bind(this)
    );
    this.name = "rocket";
    this.rotation.x = Math.PI / 2;
    this.scale.set(1.5, 1.5, 1.5); // ustaw skalę modelu
    return this;
  }
}
