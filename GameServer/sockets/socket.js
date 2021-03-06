function SocketManager() {
    this.senderInterval = -1;
    this.queueForSend = new Queue();
    
    this.addSendQueue = function(netSocket, data) { // net.Socket, string
        this.queueForSend.enqueue({
            netSocket: netSocket,
            data: data
        });
    };
    
    this.getCSocket = function(netSocket) { // net.Socket
        return new Socket(this, netSocket);
    };
    
    this.runSender = function() {
        if (this.senderInterval != -1) {
            clearInterval(this.senderInterval);
        }
        
        var queueForSend = this.queueForSend;
        
        this.senderInterval = setInterval(function() {
            if (queueForSend.count() > 0) {
                var sendData = queueForSend.dequeue();
                sendData.netSocket.write(sendData.data);
            }
        }, 50);
    };
}

function Socket(socketManager, netSocket) { // SocketManager, net.Socket
    this.socketManager = socketManager;
    this.netSocket = netSocket;
    this.localAddress = netSocket.localAddress;
    this.localPort = netSocket.localPort;
    this.remoteAddress = netSocket.remoteAddress;
    this.remotePort = netSocket.remotePort;
    
    this.write = function(data) {   // string
        this.socketManager.addSendQueue(this.netSocket, data);
    };
    
    this.on = function(eventName, func) {   // string, function
        return this.netSocket.on(eventName, func);
    };
}

function Queue() {
    this.array = new Array();
    
    this.enqueue = function(data) { // string
        this.array.push(data);
    };
    
    this.dequeue = function() {
        if (this.array.length > 0) {
            return this.array.shift();
        }
        
        return null;
    };
    
    this.count = function() {
        return this.array.length;
    };
}

exports.SocketManager = SocketManager;
