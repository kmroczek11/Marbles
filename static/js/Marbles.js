class Marbles {
  constructor(rows) {
    this.collidableMarblesList2D = [];
    this.collidableMarblesList1D = [];
    this.marblesColorsArray = [];
    this.rows = rows;
    this.points = 0;
    this.createMarbles(rows);
  }

  create2DArray(rows) {
    var arr = [];

    for (var i = 0; i < rows; i++) {
      arr[i] = [];
    }

    return arr;
  }

  createMarbles(rows) {
    this.marblesColorsArray = this.create2DArray(rows);
    this.collidableMarblesList2D = this.create2DArray(rows);
    var x = -1000;
    var y = 100;
    var z = -2000;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < 10; j++) {
        var marbleMaterial = new THREE.MeshLambertMaterial({});
        var marble = new THREE.Mesh(settings.marbleGeometry, marbleMaterial);
        marble.position.set(x, y, z);
        var randomIndex = game.generateRandomColor(marble);
        marble.name = "marble_" + i + " " + j;
        marble.castShadow = true;
        marble.receiveShadow = false;
        this.collidableMarblesList2D[i][j] = marble;
        this.marblesColorsArray[i][j] = randomIndex;
        this.collidableMarblesList1D.push(marble);
        game.scene.add(marble);
        x += 220;
      }
      x = -1000;
      z += 300;
    }
  }

  destroyMarbles(strikedMarble) {
    var id = strikedMarble.substring(
      strikedMarble.indexOf("_") + 1,
      strikedMarble.length
    );
    var row = parseInt(id.split(" ")[0]);
    var column = parseInt(id.split(" ")[1]);
    // console.log("Wiersz:", row, "Kolumna:", column);
    var color = game.marbleForShooting.randomColor;

    this.checkPoints(row, column, color);
  }

  checkPoints(row, column, color) {
    if (this.deleteStriked(row, column, color)) {
      this.goLeft(row, column, color);
      this.goRight(row, column, color);
      this.goUp(row, column, color);
      console.log("Punkty", this.points);
    }
    game.marbleForShooting.position.set(0, 100, 900);
  }

  //w lewy bok
  goLeft(row, column, color) {
    for (let i = column - 1; i >= 0; i--) {
      if (this.marblesColorsArray[row][i] == color) {
        console.log("Kolejny kolor obok z lewej.");
        this.removeMarbleFromScene(this.collidableMarblesList2D[row][i]);
        this.removeMarbleFromList1D(this.collidableMarblesList2D[row][i]);
        this.removeMarbleFromList2D(row, i);
        this.points++;
      } else {
        break;
      }
    }
  }

  //usunięcie trafionej
  deleteStriked(row, column, color) {
    if (this.marblesColorsArray[row][column] == color) {
      this.removeMarbleFromScene(this.collidableMarblesList2D[row][column]);
      this.removeMarbleFromList1D(this.collidableMarblesList2D[row][column]);
      this.removeMarbleFromList2D(row, column);
      this.points++;
      return true;
    }
  }

  //w prawy bok
  goRight(row, column, color) {
    for (let i = column + 1; i < 10; i++) {
      if (this.marblesColorsArray[row][i] == color) {
        console.log("Kolejny kolor obok z prawej.");
        this.removeMarbleFromScene(this.collidableMarblesList2D[row][i]);
        this.removeMarbleFromList1D(this.collidableMarblesList2D[row][i]);
        this.removeMarbleFromList2D(row, i);
        this.points++;
      } else {
        break;
      }
    }
  }

  //w górę
  goUp(row, column, color) {
    for (let i = row - 1; i >= 0; i--) {
      if (this.marblesColorsArray[i][column] == color) {
        console.log("Kolejny kolor obok w górę.");
        this.removeMarbleFromScene(this.collidableMarblesList2D[i][column]);
        this.removeMarbleFromList1D(this.collidableMarblesList2D[row][i]);
        this.removeMarbleFromList2D(i, column);
        this.points++;
      } else {
        break;
      }
    }
  }

  removeMarbleFromScene(marble) {
    var selectedObject = game.scene.getObjectByName(marble.name);
    game.scene.remove(selectedObject);
    game.animate();
  }

  removeMarbleFromList1D(marble) {
    for (let i = 0; i < this.collidableMarblesList1D.length; i++) {
      if (this.collidableMarblesList1D[i] == marble) {
        this.collidableMarblesList1D.splice(i, 1);
      }
    }
  }

  removeMarbleFromList2D(i, j) {
    this.collidableMarblesList2D[i][j] = "";
    console.log(this.collidableMarblesList2D);
  }
}
