class Ui {
  constructor() {
    console.log("Konstruktor klasy Ui.");
    this.waitForPlayer = null;
    this.login = null;
    this.layout();
    this.clicks();
  }

  layout() {
    var overlay = $("<div>");
    overlay.addClass("overlay");
    overlay.appendTo("body");

    var statusBar = $("<div>");
    statusBar.addClass("statusBar");
    $("body").append(statusBar);

    var status = $("<p>");
    status.addClass("status");
    status.html("STATUS");
    statusBar.append(status);

    var boxToLogin = $("<div>");
    boxToLogin.addClass("boxToLogin");
    overlay.append(boxToLogin);

    var loginP = $("<p>");
    loginP.addClass("loginP");
    loginP.html("LOGOWANIE");
    boxToLogin.append(loginP);

    var nickname = $("<input>");
    nickname.addClass("nickname");
    boxToLogin.append(nickname);

    var login = $("<button>");
    login.addClass("login");
    login.html("LOGUJ");
    boxToLogin.append(login);

    var reset = $("<button>");
    reset.addClass("reset");
    reset.html("RESET");
    boxToLogin.append(reset);

    var waitProgress = $("<div>");
    waitProgress.addClass("wait");
    waitProgress.html("Czekaj na drugiego gracza...");
    var loading = $("<img>");
    loading.addClass("loading");
    loading.attr("src", "../gfx/loading.gif");
    waitProgress.append(loading);

    overlay.append(waitProgress);
  }

  clicks() {
    $(".login").click(function() {
      var login = $(".nickname").val();
      net.action("ADD_USER", login);
    });

    $(".reset").click(function() {
      net.action("RESET", "");
    });
  }

  changeStatus(data) {
    if (data.user != "") {
      this.login = data.user;
      $(".boxToLogin").remove();
      const wait = setInterval(function() {
        net.waitForPlayer();
        if (ui.waitForPlayer == false) {
          $(".overlay").remove();
          $(".statusBar").remove();
          game.canPlay = true;
          clearInterval(wait);
        } else {
          $(".wait").css("display", "flex");
        }
      }, 500);
      $(".status").html(data.action + "<br/>" + "Witaj " + data.user + "!");
    } else {
      $(".status").html(data.action);
    }
  }

  refreshLeaderboard(results) {
    console.log("Tworzę leaderboard");
    $("#leaderboard").html(
      "<tr>\
        <th>Nickname</th>\
        <th>Punkty</th>\
    </tr>"
    );
    for (let i = 0; i < results.length; i++) {
      var tr = $("<tr>");
      console.log(results[i]);
      var nickname = $("<td>").html(results[i].nickname);
      if (results[i].nickname == ui.login) {
        nickname.css({ color: "red" });
      }
      tr.append(nickname);
      var points = $("<td>").html(results[i].points);
      if (results[i].nickname == ui.login) {
        points.css({ color: "red" });
      }
      tr.append(points);
      $("#leaderboard").append(tr);
    }
  }
}
