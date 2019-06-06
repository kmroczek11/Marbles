class Marble extends THREE.Mesh {
  constructor() {
    super();
    this.geometry = new THREE.SphereGeometry(
      100,
      50,
      50,
      0,
      Math.PI * 2,
      0,
      Math.PI * 2
    );
    this.material = new THREE.MeshLambertMaterial({});
    this.castShadow = true;
    this.receiveShadow = true;
    return this;
  }

  set materialColor(color) {
    this.material.color.setHex(color);
  }
}
