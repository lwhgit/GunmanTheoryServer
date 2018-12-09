var http = require("http");
var net = require("net");

var user = require("./users/user");
var room = require("./rooms/room");

var UserManager = user.UserManager;
var AuthenticatorManager = user.AuthenticatorManager;
var RoomManager = room.RoomManager;

var loginServerPort = 8762;
var gameServerPort = 8763;

var ltgSocket = null;
var server = null;

var userManager = new UserManager();
var authManager = new AuthenticatorManager();
var roomManager = new RoomManager();

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
    /*
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
    }*/
    
    logi("A socket connected.");
}

function onSocketError(socket, error) {
    logi("A socket error. error: %s", error);
}

function onSocketClosed(socket, hasError) {
    if (socket) {
        logi("A socket closed. hasError: %s", hasError);
        if (socket == ltgSocket) {
            ltgSocket = null;
        }
    }
}

function onSocketData(socket, data) {
    try {
        var msg = data.toString();
        console.log("Data Received:\n%s", msg);
        var json = JSON.parse(msg);
        
        if (ltgSocket) {
            if (socket) {
                if (socket == ltgSocket) {
                    if (json.request == "register") {
                        var nickname = json.nickname;
                        if (authManager.isNicknameExists(nickname)) {
                            socket.write(JSON.stringify({
                                request: "register",
                                result: "failed",
                                socketId: json.socketId,
                                nickname: nickname,
                                message: "This nickname already exists."
                            }));
                        } else {
                            var auth = authManager.registerAuth(nickname);
                            socket.write(JSON.stringify({
                                request: "register",
                                result: "successed",
                                socketId: json.socketId,
                                nickname: auth.nickname,
                                id: auth.id
                            }));
                        }
                    }
                } else if (socket != ltgSocket) {
                    var user = userManager.getUserBySocket(socket);
                    
                    if (user) {
                        if (json.request == "create room") {
                            if (!user.room) {
                                var room = roomManager.createRoom(user, {
                                    name: "New Room",
                                    maxPersonnel: 8
                                });
                                user.send(JSON.stringify({
                                    request: "create rooms",
                                    result: "successed",
                                    roomId: room.id
                                }));
                            } else {
                                user.send(JSON.stringify({
                                    request: "create rooms",
                                    result: "failed"
                                }));
                            }
                        }
                    } else {
                        if (json.request == "login") {
                            var auth = authManager.getAuth(json.id, json.nickname);
                            
                            if (auth) {
                                if (userManager.canUseAuth(auth)) {
                                    userManager.registerUser(auth, socket)
                                    socket.write(JSON.stringify({
                                        request: "login",
                                        result: "successed"
                                    }));
                                } else {
                                    socket.write(JSON.stringify({
                                        request: "login",
                                        result: "failed",
                                        message: "Cannot use this auth."
                                    }));
                                }
                            } else {
                                socket.write(JSON.stringify({
                                    request: "login",
                                    result: "failed",
                                    message: "This auth not exists."
                                }));
                            }
                        }
                    }
                }
            }
        } else {
            if (json.request == "refresh ltgSocket") {
                logv("Refresh ltgSocket");
                ltgSocket = socket;
            }
        }
    } catch(e) {
        console.log("Exception [onSocketData]: " + e + "\ntack: " + e.stack);
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

createServer();
