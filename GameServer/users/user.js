function UserManager() {
    this.userList = new Array();
    
    this.isNicknameExists = function(nickname) {
        for (var i = 0;i < this.userList.length;i ++) {
            var user = this.userList[i];
            if (user) {
                if (user.nickname == nickname) {
                    return true;
                }
            }
        }
        return false;
    };
    
    this.getUserById = function(id) {
        for (var i = 0;i < this.userList.length;i ++) {
            var user = this.userList[i];
            if (user) {
                if (user.id == id) {
                    return user;
                }
            }
        }
        return null;
    };
    
    this.getUserBySocket = function(socket) {
        for (var i = 0;i < this.userList.length;i ++) {
            var user = this.userList[i];
            if (user) {
                if (user.socket == socket) {
                    return user;
                }
            }
        }
        return null;
    };
    
    this.getUserByNickname = function(nickname) {
        for (var i = 0;i < this.userList.length;i ++) {
            var user = this.userList[i];
            if (user) {
                if (user.nickname == nickname) {
                    return user;
                }
            }
        }
        return null;
    };
    
    this.addUser = function(socket, nickname) {
        var id = this.getEmptyId();
        this.userList[id] = new User(id, socket, nickname);
        return this.userList[id];
    };
    
    this.removeUser = function(user) {
        this.userList[this.userList.indexOf(user)] = null;
    };
    
    this.getEmptyId = function() {
        for (var id = 0;id < this.userList.length;id ++) {
            if (this.userList[id] == null) {
                return id;
            }
        }
        return this.userList.length;
    };
    
    this.getJSON = function() {
        var obj = [];
        for (var i = 0;i < this.userList.length;i ++) {
            var user = this.useList[i];
            if (user) {
                obj.push(JSON.parse(user.getJSON()));
            }
        }
        
        return JSON.stringify(obj);
    };
}

function User(id, socket, nickname) {
    this.id = id;
    this.socket = socket;
    this.nickname = nickname;
    this.roomId = -1;
    
    this.getJSON = function() {
        var obj = {
            id: this.id,
            socket: this.socket,
            nickname: this.nickname,
            roomId: this.roomId,
        };
        
        return JSON.stringify(obj);
    };
}

exports.UserManager = UserManager;
