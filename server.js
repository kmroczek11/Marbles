var express = require("express");
var app = express();
var http = require("http").createServer(app);
var socketio = require("socket.io")(http);
var mongoClient = require("mongodb").MongoClient;
var ObjectID = require("mongodb").ObjectID;

app.use(express.static("static"));

http.listen(3000, function () {
  console.log("Listening on 3000...");
});

var _db;

mongoClient.connect("mongodb://localhost/admin", function (err, db) {
  _db = db;
  db.admin().listDatabases(function (err, dbs) {
    if (err) console.log(err);
    else {
      var exists = false;
      for (let i = 0; i < dbs.databases.length; i++) {
        if (dbs.databases[i].name == "leaderboard") {
          console.log("Ranking już stworzono");
          exists = true;
          break;
        }
      }

      if (!exists) {
        mongoClient.connect("mongodb://localhost/leaderboard", function (
          err,
          db
        ) {
          if (err) console.log(err);
          else {
            db.createCollection("results", function (err, coll) {
              coll.insert({ a: 1 }, function (err, result) { });
            });
          }
        });
      }
    }
  });
});

var players = [];

socketio.on("connection", function (client) {
  console.log("Klient się podłączył " + client.id);
  client.emit("onconnect", {
    clientName: client.id
  });

  client.on("disconnect", function () {
    for (let i = 0; i < players.length; i++) {
      if (players[i].id == client.id) {
        console.log("Disconnect playera o ID ", client.id);
        players.splice(i, 1);
        console.log("Tablica userów po usunięciu: ", players);
      }
    }
  });

  client.on("createPlayer", function (data) {
    if (players.includes(data.user)) {
      var data = {
        action: "USER_ALREADY_EXISTS",
        user: ""
      };
      socketio.sockets.to(client.id).emit("createPlayer", data);
    } else {
      console.log("Dodawanie usera.");
      var data = {
        action: "USER_ADDED",
        user: data.user
      };
      players.push({ id: client.id, login: data.user });
      console.log("Tablica userów po dodaniu usera: ", players);
      socketio.sockets.to(client.id).emit("createPlayer", data);
    }
  });

  client.on("wait", function () {
    if (players.length >= 2) {
      socketio.sockets.to(client.id).emit("wait", { wait: false });
    } else {
      socketio.sockets.to(client.id).emit("wait", { wait: true });
    }
  });

  client.on("updateRanking", function (data) {
    var coll;
    var add = true;
    mongoClient.connect(
      "mongodb://localhost/leaderboard",
      function (err, db) {
        if (err) {
          throw err;
        } else {
          db.collection("results", function (err, collection) {
            if (err) {
              throw err;
            } else {
              collection.find({}, function (err, results) {
                results.each(function (err, res) {
                  console.log("Wiersz", res);
                  if (res != null) {
                    console.log("Kolekcja nie jest pusta");
                    if (res.nickname == data.nickname) {
                      res.points = data.points;
                      add = false;
                    }
                  }
                });
              });
            }

            if (add) {
              var collection = db.collection("results");
              var data = { nickname: data.nickname, points: data.points };
              collection.insert(data, function (err, result) {
                console.log("Dodano wynik");
              });
            }
          });

          db.collection("results", function (err, collection) {
            collection.find({}, function (err, result) {
              coll = result;
            });
          });
        }
      }.bind(data)
    );

    socketio.sockets.emit("updateRanking", coll);
  });
});
