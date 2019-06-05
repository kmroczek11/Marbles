class Marbles {
  constructor() {
    console.log("Konstruktor klasy Marbles.");
    this.colors = [0xff0000, 0x00ff00, 0x0000ff];
    this.collidableMarblesList = [];
    this.createMarbles(4);
  }

  createMarbles(rows) {
    var x = -900;
    var y = 100;
    var z = -900;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < 10; j++) {
        var marbleMaterial = new THREE.MeshBasicMaterial({
          color: 0x000000
        });
        var marble = new THREE.Mesh(settings.marbleGeometry, marbleMaterial);
        marble.position.set(x, y, z);
        var randomIndex = Math.floor(Math.random() * 3 + 0);
        marble.material.color.setHex(this.colors[randomIndex]);
        marble.name = "marble";
        this.collidableMarblesList.push(marble);
        game.scene.add(marble);
        x += 200;
      }
      x = -900;
      z += 200;
    }
  }
}
