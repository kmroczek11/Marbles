var game;
var marbles;
var net;
var ui;
var items;
$(document).ready(function () {
  items = new Items();
  game = new Game();
  marbles = new Marbles();

  net = new Net();
  ui = new Ui();
});
