var logBox = $("#logBox");
var consoleInputArea = $("#consoleInputArea");
var authListBox = $("#authListBox");
var userListBox = $("#userListBox");
var roomListBox = $("#roomListBox");

var roomItemBox = $(".roomItemBox");
var roomConfigBox = $("#roomConfigBox");

var ws = null;

var autoReconnect = true;
var autoReconnectTimeout = -1;

var authList = new Array();
var userList = new Array();

consoleInputArea.on("keydown", function(event) {
    if (event.keyCode == 13) {
        commandInput(consoleInputArea.val());
        return false;
    }
});

function connectToWebSocketServer() {
    try {
        ws = new WebSocket("ws://localhost:8772");
    } catch (e) {
        console.log(e);
    }

    ws.onopen = function(event) {
        logi("Connected.");
        ws.send(JSON.stringify({
            request: "ask auth list"
        }));
        ws.send(JSON.stringify({
            request: "ask user list"
        }));
        ws.send(JSON.stringify({
            request: "ask room list"
        }));
    };
    
    ws.onmessage = function(event) {
        onWebsSocketMessage(event.data);
    };
    
    ws.onerror = function(event) {
        console.log(event);
        logi("Error. Try to reconnect after 1sec.");
        if (autoReconnect) {
            autoReconnectTimeout = setTimeout(function() {
                connectToWebSocketServer();
            }, 1000);
        }
    };
}

function commandInput(cmd) {
    logi("&#62;" + cmd);
    
    var s = cmd.split(" ");
    
    consoleInputArea.val("");
    
    if (s[0] == "cls") {
        logBox.children().remove();
    } else if (s[0] == "request") {
        ws.send(JSON.stringify({
            request: cmd.split("request ")[1]
        }));
    } else if (s[0] == "stop") {
        if (ws.readyState == WebSocket.OPEN) {
            ws.close();
            logi("WebSocket closed.");
        }
        autoReconnect = false;
        if (autoReconnectTimeout >= 0) {
            clearTimeout(autoReconnectTimeout);
            autoReconnectTimeout = -1;
        }
        logi("Stopped auto reconnection.");
    } else if (s[0] == "start") {
        autoReconnect = true;
        connectToWebSocketServer();
    }
}

function onWebsSocketMessage(message) {
    try {
        logi("Received message.");
        logi(message);
        var json = JSON.parse(message);
        
        if (json.request == "ask auth list") {
            var list = json.authList;
            
            for (var i = 0;i < list.length;i ++) {
                addAuthItem(list[i]);
            }
        } else if (json.request == "ask user list") {
            var list = json.userList;
            
            for (var i = 0;i < list.length;i ++) {
                addUserItem(list[i]);
            }
        } else if (json.request == "ask room list") {
            var list = json.roomList;
            
            for (var i = 0;i < list.length;i ++) {
                addRoomItem(list[i]);
            }
        } else if (json.request == "auth registered") {
            var auth = json.auth;
            addAuthItem(auth);
        } else if (json.request == "auth unregistered") {
            var auth = json.auth;
            removeAuthItem(auth);
        } else if (json.request == "user loggedIn") {
            var user = json.user;
            addUserItem(user);
        } else if (json.request == "user loggedOut") {
            var user = json.user;
            removeUserItem(user);
        } else if (json.request == "room created") {
            var room = json.room;
            addRoomItem(room);
        } else if (json.request == "room removed") {
            var room = json.room;
            removeRoomItem(room);
        }
    } catch(e) {
        console.log("[Exception in onWebsSocketMessage]: " + e + "\n[stack]: " + e.stack);
    }
}

function addAuthItem(auth) {
    var authItem = $("<div class='authItemBox'>id: <span class='idView'>" + auth.id + "</span><br>nickname: <span class='nicknameView'>" + auth.nickname +"</span></div>");
    authListBox.append(authItem);
}

function removeAuthItem(auth) {
    var items = authListBox.children();
    
    for (var i = 0;i < items.length;i ++) {
        var item = items.eq(i);
        var idView = item.find(".idView");
        var id = parseInt(idView.text());
        
        if (id == auth.id) {
            item.remove();
        }
    }
}

function addUserItem(user) {
    var userItem = $("<div class='userItemBox'>auth id: <span class='idView'>" + user.authId + "</span><br>auth nickname: <span class='nicknameView'>" + user.authNickname +"</span></div>");
    userListBox.append(userItem);
}

function removeUserItem(user) {
    var items = userListBox.children();
    
    for (var i = 0;i < items.length;i ++) {
        var item = items.eq(i);
        var idView = item.find(".idView");
        var id = parseInt(idView.text());
        
        if (id == user.authId) {
            item.remove();
        }
    }
}

function addRoomItem(room) {
    var roomItem = $("<div class='roomItemBox'>id: <span class='idView'>" + room.id + "</span><br>room name: <span class='nameView'>" + room.config.name +"</span></div>");
    roomListBox.append(roomItem);
    roomItemBox = $(".roomItemBox");
    
    roomItemBox.on("mouseenter", function(event) {
        var target = event.target;
        var roomId = parseInt($(target).find(".idView").text());
        console.log(roomId);
        /*var x = target.offsetLeft;
        var y = target.offsetTop;
        roomConfigBox.css("left", (x - 512 - 8) + "px");
        roomConfigBox.css("top", y + "px");*/
        roomConfigBox.css("opacity", "1");
        roomConfigBox.css("display", "block");
    });
    
    roomItemBox.on("mouseleave", function(event) {
        roomConfigBox.css("opacity", "0");
        roomConfigBox.css("display", "none");
    });
}

function removeRoomItem(room) {
    var items = roomListBox.children();
    
    for (var i = 0;i < items.length;i ++) {
        var item = items.eq(i);
        var idView = item.find(".idView");
        var id = parseInt(idView.text());
        
        if (id == room.id) {
            item.remove();
        }
    }
}

function logi(text) {
    text = text.toString();
    var tmp = text.split("\n");
    for (var i = 0;i < tmp.length;i ++) {
        var line = $("<div class='logLine'><pre>" + tmp[i] + "</pre></div>");
        logBox.append(line);
    }
    logBox.scrollTop(logBox.children().length * 24)
}

connectToWebSocketServer();
