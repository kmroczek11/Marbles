var express = require("express");
var app = express();
var http = require("http").createServer(app);
var socketio = require("socket.io")(http);

app.use(express.static("static"));

http.listen(3000, function() {
  console.log("Listening on 3000...");
});

socketio.on("connection", function(client) {
  console.log("Klient się podłączył " + client.id);
});
