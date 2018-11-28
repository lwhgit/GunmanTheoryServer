var http = require("http");
var net = require("net");

var user = require("./users/user");

var UserManager = user.UserManager;
var AuthenticatorManager = user.AuthenticatorManager;

var loginServerPort = 8762;
var gameServerPort = 8763;

var lgtSocket = null;
var server = null;

var userManager = new UserManager();
var authManager = new AuthenticatorManager();

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
    
    server.listen(gameServerPort, function() {
        logi("Game Server is running on *:%s", gameServerPort);
    });
}

function onSocketConnected(socket) {
    var reg = new RegExp(".*:.*:.*:([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})");
    var ipv4 = reg.exec(socket.remoteAddress)[1];
    logi("A socket connected.\n  Local address: %s\n  Local port: %s\n  Remote address: %s\n  Remote port: %s", socket.localAddress, socket.localPort, socket.remoteAddress, socket.remotePort);
    if (ipv4 == "127.0.0.1") {
        logv("Refresh ltgSocket");
        lgtSocket = socket;
    }
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
    console.log("\u001b[36m", text);
}

function logv(text) {
    console.log("\u001b[35m", text);
}

function logw(text) {
    console.log("\u001b[33m", text);
}

function loge(text) {
    console.log("\u001b[31m", text);
}

createServer();
