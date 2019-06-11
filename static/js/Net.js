class Net {
  constructor() {
    console.log("Konstruktor klasy Net.");
    this.client = io();
    this.client.on("onconnect", function (data) {
      game.playerId = data.clientName;
      console.log("Twoje ID", game.playerId);
    });

    this.client.on("createPlayer", function (data) {
      console.log("Stworzono usera.");
      ui.changeStatus(data);
    });

    this.client.on("wait", function (data) {
      ui.waitForPlayer = data.wait;
    });

    this.client.on("updateRanking", function (data) {
      ui.refreshLeaderboard(data);
    });
  }

  action(action, user) {
    this.client.emit("createPlayer", { action: action, user: user });
  }

  waitForPlayer() {
    this.client.emit("wait");
  }

  updateRanking(nickname, points) {
    this.client.emit("updateRanking", { nickname: nickname, points: points });
  }
}
