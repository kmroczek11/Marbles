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
        var marble = new Marble();
        marble.position.set(x, y, z);
        var randomIndex = Math.floor(Math.random() * 3 + 0);
        marble.materialColor = settings.colors[randomIndex];
        marble.name = "marble_" + i + " " + j;
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
    var data = this.getRowAndColumn(strikedMarble);
    // console.log("Wiersz:", row, "Kolumna:", column);
    var color = game.marbleForShooting.randomColor;

    this.checkPoints(data[0], data[1], color);
  }

  getRowAndColumn(strikedMarble) {
    var id = strikedMarble.substring(
      strikedMarble.indexOf("_") + 1,
      strikedMarble.length
    );
    var row = parseInt(id.split(" ")[0]);
    var column = parseInt(id.split(" ")[1]);
    return [row, column];
  }

  checkPoints(row, column, color) {
    console.log(row, column, color);
    this.goUp(row, column, color);
    console.log("Punkty", this.points);
    if (this.points > 2) {
      game.marbleForShooting.position.set(0, 100, 900);
    } else {
      //manipulacja kulką, którą strzelaliśmy, dodanie jej do rzędu kulek
      game.marbleForShooting.position.z += 100;
      var data = this.getRowAndColumn(game.strikedMarble);
      var row = data[0] + 1;
      var column = data[1];
      game.marbleForShooting.name = "marble_" + row + " " + column;
      console.log("Id nowej kulki", game.marbleForShooting.name);
      this.collidableMarblesList1D.push(game.marbleForShooting);
      if (this.collidableMarblesList2D[row] == undefined) {
        console.log("Stworzenie pustego rzędu.");
        this.collidableMarblesList2D[row] = [];
        this.marblesColorsArray[row] = [];
        for (let i = 0; i < 10; i++) {
          this.collidableMarblesList2D[row][i] = null;
          this.marblesColorsArray[row][i] = null;
        }
        this.collidableMarblesList2D[row][column] = game.marbleForShooting;
        this.marblesColorsArray[row][column] =
          game.marbleForShooting.randomColor;
        // console.log("Tablica meshy", this.collidableMarblesList2D);
        // console.log("Tablica kolorów", this.marblesColorsArray);
      } else {
        this.collidableMarblesList2D[row][column] = game.marbleForShooting;
        this.marblesColorsArray[row][column] =
          game.marbleForShooting.randomColor;
        // console.log("Tablica meshy", this.collidableMarblesList2D);
        // console.log("Tablica kolorów", this.marblesColorsArray);
      }
      game.createMarbleForShooting();
    }

    this.points = 0;
  }

  // //w górę
  // goUp(row, column, color) {
  //   for (let i = row - 1; i >= 0; i--) {
  //     if (this.marblesColorsArray[i][column] == color) {
  //       console.log("Kolejny kolor obok w górę.");
  //       this.removeMarbleFromScene(this.collidableMarblesList2D[i][column]);
  //       this.removeMarbleFromList1D(this.collidableMarblesList2D[row][i]);
  //       this.removeMarbleFromList2D(i, column);
  //       this.points++;
  //     } else {
  //       break;
  //     }
  //   }
  // }

  goUp(row, column, color) {
    for (let i = row; i >= 0; i--) {
      if (this.marblesColorsArray[i][column] == color) {
        console.log("Index " + i + " " + column + " w górę zgadza się.");
        this.removeMarbleFromScene(this.collidableMarblesList2D[i][column]);
        this.removeMarbleFromList1D(this.collidableMarblesList2D[row][i]);
        this.removeMarbleFromList2D(i, column);
        this.points++;
        this.goLeft(i, column, color);
        this.goRight(i, column, color);
      } else {
        break;
      }
    }
  }

  //w lewy bok
  goLeft(row, column, color) {
    for (let i = column - 1; i >= 0; i--) {
      if (this.marblesColorsArray[row][i] == color) {
        console.log("Index " + i + " " + column + " w lewo zgadza się.");
        this.removeMarbleFromScene(this.collidableMarblesList2D[row][i]);
        this.removeMarbleFromList1D(this.collidableMarblesList2D[row][i]);
        this.removeMarbleFromList2D(row, i);
        this.points++;
        this.goUp(row, i, color);
      } else {
        break;
      }
    }
  }

  //w prawy bok
  goRight(row, column, color) {
    for (let i = column + 1; i < 10; i++) {
      if (this.marblesColorsArray[row][i] == color) {
        console.log("Index " + i + " " + column + " w prawo zgadza się.");
        this.removeMarbleFromScene(this.collidableMarblesList2D[row][i]);
        this.removeMarbleFromList1D(this.collidableMarblesList2D[row][i]);
        this.removeMarbleFromList2D(row, i);
        this.points++;
        this.goUp(row, i, color);
      } else {
        break;
      }
    }
  }

  removeMarbleFromScene(marble) {
    console.log("Usuwanie " + marble.name);
    var selectedObject = game.scene.getObjectByName(marble.name);
    game.scene.remove(selectedObject);
  }

  removeMarbleFromList1D(marble) {
    for (let i = 0; i < this.collidableMarblesList1D.length; i++) {
      if (this.collidableMarblesList1D[i] == marble) {
        this.collidableMarblesList1D.splice(i, 1);
      }
    }
  }

  removeMarbleFromList2D(row, column) {
    //usuwanie z tablicy meshów i kolorów
    this.collidableMarblesList2D[row][column] = null;
    this.marblesColorsArray[row][column] = null;
    var rowIsEmpty = true;
    for (let i = 0; i < 10; i++) {
      if (this.collidableMarblesList2D[row][i] != null) {
        rowIsEmpty = false;
        break;
      }
    }
    if (rowIsEmpty) {
      console.log("Pusty rząd.");
      this.collidableMarblesList2D.splice(row, 1);
      this.marblesColorsArray.splice(row, i);
    }
    // console.log("Tablica meshy", this.collidableMarblesList2D);
    // console.log("Tablica kolorów", this.marblesColorsArray);
  }
}
