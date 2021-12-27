var express = require("express");
var app = express();
var http = require("http").createServer(app);
var socketio = require("socket.io")(http);
var mongoClient = require("mongodb").MongoClient;
var opers = require("./modules/Operations.js");

app.use(express.static("static"));

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

http.listen(PORT, HOST, function () {
  console.log("Listening on 3000...");
});

var client;

const uri = process.env.MONGODB_URI;

mongoClient.connect(
  uri,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    poolSize: 5,
  },
  function (err, db) {
    client = db;
    db.db("admin")
      .admin()
      .listDatabases(function (err, dbs) {
        if (err) console.log(err);
        else {
          var exists = false;
          for (let i = 0; i < dbs.databases.length; i++) {
            if (dbs.databases[i].name == "leaderboard") {
              exists = true;
              break;
            }
          }

          if (!exists) {
            mongoClient.connect(
              `${uri}/leaderboard`,
              function (err, db) {
                if (err) console.log(err);
              }
            );
          }
        }
      });
  }
);

var players = [];

socketio.on("connection", function (client) {
  client.emit("onconnect", {
    clientName: client.id,
  });

  client.on("disconnect", function () {
    for (let i = 0; i < players.length; i++) {
      if (players[i].id == client.id) {
        players.splice(i, 1);
      }
    }
  });

  client.on("createPlayer", function (data) {
    let exists = false;
    for (let i = 0; i < players.length; i++) {
      if (players[i].login == data.user) {
        exists = true;
        break;
      }
    }
    if (exists) {
      var data = {
        action: "USER_ALREADY_EXISTS",
        user: "",
      };
      socketio.sockets.to(client.id).emit("createPlayer", data);
    } else {
      var data = {
        action: "USER_ADDED",
        user: data.user,
      };
      players.push({ id: client.id, login: data.user });
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
    check_rows(data);
  });
});

function check_rows(data) {
  var dbo = client.db("leaderboard");
  const ObjectID = require("mongodb").ObjectID;
  opers.CheckRows(
    ObjectID,
    dbo,
    "results",
    data.nickname,
    data.points,
    function (exists) {
      if (!exists) {
        add_row(data);
      } else {
        opers.ShowRows(dbo, "results", function (rows) {
          rows.sort(function (b, a) {
            return parseFloat(a.points) - parseFloat(b.points);
          });
          socketio.sockets.emit("updateRanking", rows);
        });
      }
    }
  );
}

function add_row(data) {
  var col = client.db("leaderboard").collection("results");
  opers.CreateRow(col, data, function (added) {
    var dbo = client.db("leaderboard");
    opers.ShowRows(dbo, "results", function (rows) {
      rows.sort(function (b, a) {
        return parseFloat(a.points) - parseFloat(b.points);
      });
      socketio.sockets.emit("updateRanking", rows);
    });
  });
}
