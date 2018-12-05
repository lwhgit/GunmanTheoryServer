var http = require("http");
var net = require("net");

var user = require("./users/user");

var UserManager = user.UserManager;
var AuthenticatorManager = user.AuthenticatorManager;

var loginServerPort = 8762;
var gameServerPort = 8763;

var ltgSocket = null;
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
    logi("A socket connected.");
    logi("    Local address: %s", socket.localAddress);
    logi("    Local port: %s", socket.localPort);
    logi("    Remote address: %s", socket.remoteAddress);
    logi("    Remote port: %s", socket.remotePort);
    
    if (ipv4 == "127.0.0.1") {
        logv("Refresh ltgSocket");
        ltgSocket = socket;
        ltgSocket.write("{}");
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
    try {
        if (ltgSocket) {
        
            if (socket) {
                var msg = data.toString();
                var json = JSON.parse(msg);
                logi("Data Received: %s", msg);
                
                if (socket == ltgSocket) {
                    logi("flag0");
                    if (json.request == "register") {
                        logi("flag1");
                        var nickname = json.nickname;
                        if (authManager.isNicknameExists(nickname)) {
                            logi("flag2");
                            socket.write(obj2json({
                                request: "register",
                                result: "failed",
                                socketId: json.socketId,
                                nickname: nickname,
                                message: "This nickname already exists."
                            }));
                        } else {
                            logi("flag3");
                            var auth = authManager.registerAuth(nickname);
                            socket.write(obj2json({
                                request: "register",
                                result: "successed",
                                socketId: json.socketId,
                                nickname: auth.nickname,
                                id: auth.id
                            }));
                        }
                    }
                } else {
                    
                }
            }
        }
    } catch(e) {
        loge("Exception [onSocketData]: " + e);
    }
}

function logi(text) {
    var str = "console.log('\\u001b[36m" + text + "'";
    
    for (var i = 1;i < arguments.length;i ++) {
        str += ", '" + arguments[i] + "'";
    }
    str += ");"
    eval(str);
}

function logv(text) {
    var str = "console.log('\\u001b[35m" + text + "'";
    
    for (var i = 1;i < arguments.length;i ++) {
        str += ", '" + arguments[i] + "'";
    }
    str += ");"
    eval(str);
}

function logw(text) {
    var str = "console.log('\\u001b[33m" + text + "'";
    
    for (var i = 1;i < arguments.length;i ++) {
        str += ", '" + arguments[i] + "'";
    }
    str += ");"
    eval(str);
}

function loge(text) {
    var str = "console.log('\\u001b[31m" + text + "'";
    
    for (var i = 1;i < arguments.length;i ++) {
        str += ", '" + arguments[i] + "'";
    }
    str += ");"
    eval(str);
}

function obj2json(obj) {
    return JSON.stringify(obj);
}

createServer();
