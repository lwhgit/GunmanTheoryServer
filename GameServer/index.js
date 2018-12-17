var http = require("http");
var net = require("net");
var WebSocket = require("ws");

var user = require("./users/user");
var room = require("./rooms/room");

var WebSocketServer = WebSocket.Server;

var UserManager = user.UserManager;
var AuthenticatorManager = user.AuthenticatorManager;
var RoomManager = room.RoomManager;

var wssServerPort = 8772;
var loginServerPort = 8762;
var gameServerPort = 8763;

var wss = null;
var ws = null;
var ltgSocket = null;
var server = null;

var userManager = new UserManager();
var authManager = new AuthenticatorManager();
var roomManager = new RoomManager();

function openWebSocketServer() {
    wss = new WebSocketServer({
        port: wssServerPort
    });
    
    wss.on("connection", function(_ws) {
        logi("WS connected.");
        
        ws = _ws;
        ws.on("message", function(message) {
            console.log(message);
            var json = JSON.parse(message);
            
            if (json.request == "ask auth list") {
                ws.send(JSON.stringify({
                    request: "ask auth list",
                    authList: authManager.getSimplizedAuthList()
                }, null, 4));
            } else if (json.request == "ask user list") {
                ws.send(JSON.stringify({
                    request: "ask user list",
                    userList: userManager.getSimplizedUserList()
                }, null, 4));
            } else if (json.request == "ask room list") {
                ws.send(JSON.stringify({
                    request: "ask room list",
                    roomList: roomManager.getSimplizedRoomList()
                }, null, 4));
            }
        });
        
        ws.on("close", function() {
            logi("WS disconnected.");
        })
    });
}

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
}

function onSocketError(socket, error) {
    logi("A socket error. error: %s", error);
}

function onSocketClosed(socket, hasError) {
    if (socket) {
        logi("A socket closed. hasError: %s", hasError);
        if (socket == ltgSocket) {
            ltgSocket = null;
        } else if (socket != ltgSocket) {
            var user = userManager.getUserBySocket(socket);
            if (user) {
                var auth = user.getAuth();
                if (user.room) {
                    var room = user.room;
                    room.removeMember(user);
                    onUserLeftRoom(user, room);
                }
                authManager.removeAuth(auth);
                userManager.removeUser(user);
                onAuthUnregistered(auth);
                onUserLoggedOut(user);
            }
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
                            
                            onAuthRegistered(auth);
                        }
                    }
                } else if (socket != ltgSocket) {
                    var user = userManager.getUserBySocket(socket);
                    
                    if (user) {
                        if (json.request == "create room") {
                            if (!user.room) {
                                
                                var config = json.config;
                                
                                if (config == null) {
                                    config = {
                                        name: "New Room",
                                        maxPersonnel: 8
                                    };
                                }
                                
                                var room = roomManager.createRoom(user, config);
                                
                                user.send(JSON.stringify({
                                    request: "create room",
                                    result: "successed",
                                    roomId: room.id
                                }));
                                onRoomCreated(room);
                            } else {
                                user.send(JSON.stringify({
                                    request: "create room",
                                    result: "failed",
                                    message: "You are already in room."
                                }));
                            }
                        } else if (json.request == "enter room") {
                            if (!user.room) {
                                var room = roomManager.getRoomById(json.roomId);
                                if (room.getCurrentPersonnel() < room.getMaxPersonnel()) {
                                    room.addMember(user);
                                    user.send(JSON.stringify({
                                        request: "enter room",
                                        result: "successed"
                                    }));
                                    onUserEnteredRoom(user, room);
                                } else {
                                    user.send(JSON.stringify({
                                        request: "enter room",
                                        result: "failed",
                                        message: "The room is full."
                                    }));
                                }
                            } else {
                                user.send(JSON.stringify({
                                    request: "create room",
                                    result: "failed",
                                    message: "You are already in room."
                                }));
                            }
                        } else if (json.request == "leave room") {
                            if (user.room) {
                                var room = user.room;
                                room.removeMember(user);
                                onUserLeftRoom(user, room);
                                user.send(JSON.stringify({
                                    request: "leave room",
                                    result: "successed"
                                }));
                                onUserLeftRoom(user, user.room);
                            } else {
                                user.send(JSON.stringify({
                                    request: "leave room",
                                    result: "failed",
                                    message: "You are not in room."
                                }));
                            }
                        } else if (json.request == "ask auth list") {
                            user.send(JSON.stringify({
                                request: "ask auth list",
                                authList: authManager.getSimplizedAuthList()
                            }, null, 4));
                        } else if (json.request == "ask user list") {
                            user.send(JSON.stringify({
                                request: "ask user list",
                                userList: userManager.getSimplizedUserList()
                            }, null, 4));
                        } else if (json.request == "ask room list") {
                            user.send(JSON.stringify({
                                request: "ask room list",
                                roomList: roomManager.getSimplizedRoomList()
                            }, null, 4));
                        } else if (json.request == "ask room member list") {
                            var room = user.room;
                            
                            if (room) {
                                var memberList = room.getSimplizedRoom().memberList;
                                user.send(JSON.stringify({
                                    request: "ask room member list",
                                    result: "successed",
                                    memberList: memberList
                                }));
                            } else {
                                user.send(JSON.stringify({
                                    request: "ask room member list",
                                    result: "failed",
                                    message: "You are not in room."
                                }));
                            }
                        }
                    } else {
                        if (json.request == "login") {
                            var auth = authManager.getAuth(json.id, json.nickname);
                            
                            if (auth) {
                                if (userManager.canUseAuth(auth)) {
                                    var user = userManager.registerUser(auth, socket);
                                    
                                    socket.write(JSON.stringify({
                                        request: "login",
                                        result: "successed"
                                    }));
                                    
                                    onUserLoggedIn(user);
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
        console.log("[Exception in onSocketData]: " + e + "\n[stack]: " + e.stack);
    }
}

function onAuthRegistered(auth) {
    
    if (ws != null) {
        ws.send(JSON.stringify({
            request: "auth registered",
            auth: auth.getSimplizedAuth()
        }, null, 4));
    }
}

function onAuthUnregistered(auth) {
    if (ws != null) {
        ws.send(JSON.stringify({
            request: "auth unregistered",
            auth: auth.getSimplizedAuth()
        }, null, 4));
    }
}

function onUserLoggedIn(user) {
    if (ws != null) {
        ws.send(JSON.stringify({
            request: "user loggedIn",
            user: user.getSimplizedUser()
        }, null, 4));
    }
}

function onUserLoggedOut(user) {
    if (ws != null) {
        ws.send(JSON.stringify({
            request: "user loggedOut",
            user: user.getSimplizedUser()
        }, null, 4));
    }
}

function onRoomCreated(room) {
    if (ws != null) {
        ws.send(JSON.stringify({
            request: "room created",
            room: room.getSimplizedRoom()
        }, null, 4));
    }
}

function onUserEnteredRoom(user, room) {
    room.sendAll(JSON.stringify({
        request: "member entered"
    }));
}

function onUserLeftRoom(user, room) {
    if (room.getCurrentPersonnel() == 0) {
        roomManager.removeRoom(room);
        if (ws != null) {
            ws.send(JSON.stringify({
                request: "room removed",
                room: room.getSimplizedRoom()
            }, null, 4));
        }
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

openWebSocketServer();
createServer();
