var express = require("express");
var app = express();
var http = require("http").createServer(app);
var socketio = require("socket.io")(http);
var mongoClient = require("mongodb").MongoClient;
var opers = require("./modules/Operations.js");

app.use(express.static("static"));

http.listen(3000, function() {
  console.log("Listening on 3000...");
});

var client;

mongoClient.connect("mongodb://localhost/admin", function(err, db) {
  client = db;
  db.admin().listDatabases(function(err, dbs) {
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
        mongoClient.connect("mongodb://localhost/leaderboard", function(
          err,
          db
        ) {
          if (err) console.log(err);
          else {
            db.createCollection("results", function(err, coll) {
              coll.insert({ a: 1 }, function(err, result) {});
            });
          }
        });
      }
    }
  });
});

var players = [];

socketio.on("connection", function(client) {
  console.log("Klient się podłączył " + client.id);
  client.emit("onconnect", {
    clientName: client.id
  });

  client.on("disconnect", function() {
    for (let i = 0; i < players.length; i++) {
      if (players[i].id == client.id) {
        console.log("Disconnect playera o ID ", client.id);
        players.splice(i, 1);
        console.log("Tablica userów po usunięciu: ", players);
      }
    }
  });

  client.on("createPlayer", function(data) {
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

  client.on("wait", function() {
    if (players.length >= 2) {
      socketio.sockets.to(client.id).emit("wait", { wait: false });
    } else {
      socketio.sockets.to(client.id).emit("wait", { wait: true });
    }
  });

  client.on("updateRanking", function(data) {
    check_rows(data);
  });
});

function check_rows(data) {
  var dbo = client.db("leaderboard");
  console.log(data.nickname);
  opers.CheckRows(dbo, "results", data.nickname, data.points, function(exists) {
    if (!exists) {
      console.log("Nie ma takiego usera");
      add_row(data);
    } else {
      console.log("Jest taki user");
      opers.ShowRows(dbo, "results", function(rows) {
        rows.sort(function(b, a) {
          return parseFloat(a.points) - parseFloat(b.points);
        });
        socketio.sockets.emit("updateRanking", rows);
      });
    }
  });
}

function add_row(data) {
  var col = client.db("leaderboard").collection("results");
  opers.CreateRow(col, data, function(added) {
    var dbo = client.db("leaderboard");
    console.log("Dodano ", added);
    opers.ShowRows(dbo, "results", function(rows) {
      rows.sort(function(b, a) {
        return parseFloat(a.points) - parseFloat(b.points);
      });
      socketio.sockets.emit("updateRanking", rows);
    });
  });
}
