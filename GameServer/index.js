var http = require("http");
var net = require("net");

var user = require("./users/user");

var UserManager = user.UserManager;

var port = 8762;

var server = net.createServer(function(socket) {
    onSocketConnected(socket);
    
    socket.on("error", function(error) {
        onSocketError(socket, error);
    }).on("close", function(hasError) {
        onSocketClosed(socket, hasError);
    }).on("data", function(data) {
        onSocketData(socket, data);
    });
});

server.listen(port, function() {
    console.log("Game Server is running on *:%s", port);
});

var userManager = new UserManager();

function onSocketConnected(socket) {
    console.log("A socket connected.");
}

function onSocketError(socket, error) {
    console.log("A socket error. error: %s", error);
}

function onSocketClosed(socket, hasError) {
    if (socket) {
        console.log("A socket closed. hasError: %s", hasError);
        var user = userManager.getUserBySocket(socket);
        if (user) {
            userManager.removeUser(user);
            console.log("A user [%s] was removed.", user.id);
        }
    }
}

function onSocketData(socket, data) {
    if (socket) {
        var msg = data.toString();
        var cmd = JSON.parse(msg);
        var user = userManager.getUserBySocket(socket);
        console.log("Data Received: %s", msg);
        
        if (cmd.request == "join") {
            if (userManager.isNicknameExists(cmd.nickname)) {
                socket.write(JSON.stringify({
                    request: "join",
                    success: false,
                    message: "This nickname is already used."
                }));
            } else {
                user = userManager.addUser(socket, cmd.nickname);
                console.log("A user [%s] was added.", user.id);
                socket.write(JSON.stringify({
                    request: "join",
                    success: false,
                    message: "Successfully joinned.",
                    id: user.id
                }));
            }
        } else if (cmd.request == "create_room") {
            if (user) {
                // TO DO
            } else {
                socket.write(JSON.stringify({
                    request: "create_room",
                    success: false,
                    message: "You are not joinned.",
                }));
            }
        }
    }
}
