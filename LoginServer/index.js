var net = require("net");

var loginServerPort = 8762;
var gameServerPort = 8763;

var server = null;

var ltgSocket = null;

function createServer() {
    server = net.createServer(function(socket) {
        onSocketConnected(socket);
        
        socket.on("error", function(error) {
            onSocketError(socket, error);
        }).on("close", function(hasError) {
            onSocketClosed(socket, hasError);
        }).on("data", function(data) {
            onSocketData(socket, data);
        });
    });
    
    server.listen(loginServerPort, function() {
        logi("Login Server is running on *:%s", loginServerPort);
    });
}

function connectToGameServer() {
    try {
        ltgSocket = net.connect({
            port: gameServerPort,
            host: "127.0.0.1"
        }, function() {
            logi("Connected to Game Server.");
        });
        
        ltgSocket.on("error", function(error) {
            loge("LTG Socket error: %s", error.error);
            if (error.code == "ECONNREFUSED" || error.code == "ECONNRESET") {
                logw("Game Server is closed. Reconnect after 5sec.");
                setTimeout(connectToGameServer, 5000);
            }
        }).on("close", function(hasError) {
            if (!hasError) {
                logw("Game Server is closed. Reconnect after 5sec.");
                setTimeout(connectToGameServer, 5000);
            }
        });
    } catch(e) {
        loge(e);
    }
}

function onSocketConnected(socket) {
    console.log("A socket connected.");
}

function onSocketError(socket, error) {
    logi("A socket error. error: %s", error);
}

function onSocketClosed(socket, hasError) {
    if (socket) {
        logi("A socket closed. hasError: %s", hasError);
    }
}

function onSocketData(socket, data) {
    if (socket) {
        var msg = data.toString();
        var cmd = JSON.parse(msg);
        logi("Data Received: %s", msg);
        
    }
}

function logi(text) {
    console.log("\u001b[36m" + text);
}

function logv(text) {
    console.log("\u001b[35m" + text);
}

function logw(text) {
    console.log("\u001b[33m" + text);
}

function loge(text) {
    console.log("\u001b[31m" + text);
}

createServer();
connectToGameServer();
