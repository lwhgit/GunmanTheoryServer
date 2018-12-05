var net = require("net");

var loginServerPort = 8762;
var gameServerPort = 8763;

var server = null;

var ltgSocket = null;

var socketManager = new SocketManager();

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
            loge("Cannot connect to Game Server.");
            if (error.code == "ECONNREFUSED" || error.code == "ECONNRESET") {
                logw("Game Server is closed. Reconnect after 5sec.");
                setTimeout(connectToGameServer, 5000);
            }
        }).on("close", function(hasError) {
            if (!hasError) {
                logw("Game Server is closed. Reconnect after 5sec.");
                setTimeout(connectToGameServer, 5000);
            }
        }).on("data", function(data) {
            var msg = data.toString();
            var json = JSON.parse(msg);
            logi("LTG Received: %s", msg);
            
            if (json.request == "register") {
                
                var socket = socketManager.getSocketById(json.socketId);
                socket.write(JSON.stringify({
                    request: json.request,
                    result: json.result,
                    nickname: json.nickname,
                    socketId: json.socketId,
                    id: json.id
                }));
            }
        });
    } catch(e) {
        loge("Exception [connectToGameServer]: %s", e);
    }
}

function onSocketConnected(socket) {
    console.log("A socket connected.");
    socketManager.addSocket(socket);
}

function onSocketError(socket, error) {
    logi("A socket error. error: %s", error);
}

function onSocketClosed(socket, hasError) {
    if (socket) {
        logi("A socket closed. hasError: %s", hasError);
        socketManager.removeSocket(socket);
    }
}

function onSocketData(socket, data) {
    try {
        if (socket) {
            var msg = data.toString();
            var json = JSON.parse(msg);
            console.log("Data Received:\n%s", msg);
            
            if (ltgSocket == null || ltgSocket.destroyed) {
                logw("Game Server was closed.");
            } else {
                if (json.request == "register") {
                    var obj = {
                        request: json.request,
                        nickname: json.nickname,
                        socketId: socketManager.getSocketId(socket)
                    };
                    ltgSocket.write(JSON.stringify(obj));
                }
            }
            
            if (json.request == "resend") {
                socket.write(json.content);
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

function SocketManager() {
    this.socketList = new Array();
    
    this.addSocket = function(socket) {
        var id = this.getEmptyId();
        this.socketList[id] = socket;
    };
    
    this.removeSocket = function(socket) {
        var index = this.getSocketId(socket);
        if (index == -1) {
            return false;
        } else {
            this.socketList.splice(index, 1);
            return true;
        }
    };
    
    this.getSocketId = function(socket) {
        return this.socketList.indexOf(socket);
    };
    
    this.getSocketById = function(id) {
        return this.socketList[id];
    };
    
    this.getEmptyId = function() {
        for (var id = 0;id < this.socketList.length;id ++) {
            if (this.socketList[id] == null) {
                return id;
            }
        }
        return this.socketList.length;
    };
}

createServer();
connectToGameServer();
