class Marbles {
  constructor() {
    this.colors = [0xff0000, 0x00ff00, 0x0000ff];
    this.collidableMarblesList = [];
    this.createMarbles();
  }

  createMarbles() {
    var x = -1000;
    var y = 100;
    var z = -2000;
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 10; j++) {
        var marbleMaterial = new THREE.MeshLambertMaterial({
          color: 0x000000
        });
        var marble = new THREE.Mesh(settings.marbleGeometry, marbleMaterial);
        marble.position.set(x, y, z);
        var randomIndex = Math.floor(Math.random() * 3 + 0);
        marble.material.color.setHex(this.colors[randomIndex]);
        marble.name = "marble";
        marble.castShadow = true;
        marble.receiveShadow = false;
        this.collidableMarblesList.push(marble);
        game.scene.add(marble);
        x += 220;
      }
      x = -1000;
      z += 300;
    }
  }
}
