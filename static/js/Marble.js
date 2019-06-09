class Marble extends THREE.Mesh {
  constructor(x, y, z) {
    super();
    this.geometry = settings.marbleGeometry
    this.material = new THREE.MeshLambertMaterial({});
    this.castShadow = true;
    this.receiveShadow = false;
    this.randomizeColor()
    this.position.set(x, y, z)
    return this;
  }

  randomizeColor() {
    var color = settings.colors[Math.floor(Math.random() * 3)]
    this.material.color.setHex(color)
  }

  getColor() {
    return this.material.color.getHex()
  }

}
