var net = require("net");

var port = 8762;

var server = net.createServer(function(socket) {
    console.log("A socket connected.");
});

server.listen(port, function() {
    console.log("Game Server is running on *:%s", port);
});
