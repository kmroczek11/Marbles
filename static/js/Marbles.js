class Marbles {
  constructor() {
    this.marbles = [];
    this.even = 1;
    this.points = 0;
    this.createField();
  }

  createField() {
    var x = settings.startingX;
    var y = 100;
    var z = settings.startingZ;
    for (var i = 0; i < 4; i++) {
      this.marbles[i] = [];
      if (i % 2 == 1) x += 110;
      for (var j = 0; j < 10; j++) {
        this.marbles[i][j] = this.createMarble(x, y, z);
        if (i == 0) this.marbles[i][j].setColor(settings.dummyMarbleColor);
        x += 220;
      }
      x = settings.startingX;
      z += 300;
    }
  }

  createMarble(x, y, z) {
    var marble = new Marble(x, y, z);
    game.scene.add(marble);
    return marble;
  }

  each(callback) {
    for (var i = 0; i < this.marbles.length; i++)
      for (var j = 0; j < this.marbles[i].length; j++)
        if (this.marbles[i][j]) callback(this.marbles[i][j], i, j);
  }

  handleCollision(shootingMarble, collided, row, col) {
    this.marbles.push([]);
    var firstHalf = shootingMarble.position.x + 20 < collided.position.x;
    var backHit = shootingMarble.position.z - 100 < collided.position.z;
    row = backHit ? row : row + 1;
    var uneven = row % 2 == this.even;
    col = firstHalf ? (backHit ? col - 1 : col) : col + 1;
    if (uneven && !backHit) col--;
    if (this.marbles[row][col]) {
      row--;
      col = firstHalf ? col - 1 : col + 1;
    }
    col = this.restrictNumber(col, 0, 9, function () {
      if (backHit) row++;
    });

    this.appendMarble(shootingMarble, row, col);
    this.destroyMarbles(row, col, shootingMarble.getColor());
  }

  appendMarble(marble, row, col) {
    var uneven = row % 2 == this.even;
    marble.position.x = settings.startingX + 220 * col + (uneven ? 110 : 0);
    marble.position.z = settings.startingZ + 300 * row;
    this.marbles[row][col] = marble;
  }

  restrictNumber(num, min, max, callback) {
    if (num < min) {
      num = min;
      callback();
    }
    if (num > max) {
      num = max;
      callback();
    }
    return num;
  }

  addRow() {
    if (this.even == 0) this.even = 1;
    else this.even = 0;

    this.each(function (marble) {
      marble.position.z += 300;
    });
    this.marbles.unshift([]);

    var x = settings.startingX;
    var y = 100;
    var z = settings.startingZ;
    if (!this.even) x += 110;
    for (var j = 0; j < 10; j++) {
      this.marbles[0][j] = this.createMarble(x, y, z);
      this.marbles[0][j].setColor(settings.dummyMarbleColor);
      x += 220;
    }
    for (var j = 0; j < 10; j++) {
      if (this.marbles[1][j]) this.marbles[1][j].randomizeColor();
    }
  }

  contains(array, element) {
    for (var i = 0; i < array.length; i++) if (array[i] == element) return true;
    return false;
  }

  destroyMarbles(row, col, color) {
    var that = this;
    var result = [this.marbles[row][col]];
    var temp = [];
    var cont = true;

    while (cont) {
      cont = false;
      for (var i = 0; i < result.length; i++)
        this.each(function (marble) {
          if (
            result[i].position.distanceTo(marble.position) < 400 &&
            marble.getColor() == color &&
            !that.contains(result, marble)
          ) {
            cont = true;
            temp.push(marble);
          }
        });

      result.push(...temp);
      temp = [];
    }

    if (result.length > 2) {
      for (var i = 0; i < result.length; i++) {
        this.removeMarble(result[i]);
      }
      this.points -= 100;
      $("#points").html(this.points + " points");
      net.updateRanking(ui.login, this.points);
    }
  }

  removeMarble(toRemove) {
    var that = this;
    game.scene.remove(toRemove);
    this.each(function (marble, i, j) {
      if (marble == toRemove) {
        that.marbles[i][j] = null;
        that.points += 100;
        return;
      }
    });
  }
}
