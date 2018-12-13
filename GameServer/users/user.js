function UserManager() {
    this.userList = new Array();
    
    this.registerUser = function(auth, socket) {
        var user = new User(auth, socket);
        this.userList.push(user);
        return user;
    };
    
    this.removeUser = function(user) {
        var index = this.userList.indexOf(user);
        
        if (index >= 0) {
            this.userList.splice(index, 1);
        }
    };
    
    this.getUserBySocket = function(socket) {
        for (var i = 0;i < this.userList.length;i ++) {
            var user = this.userList[i];
            if (user.socket == socket) {
                return user;
            }
        }
        return null;
    };
    
    this.getUserByAuth = function(auth) {
        for (var  i = 0;i < this.userList.length;i ++) {
            var user = this.userList[i];
            if (user.auth == auth) {
                return user;
            }
        }
        return null;
    };
    
    this.canUseAuth = function(auth) {
        for (var i = 0;i < this.userList.length;i ++) {
            if (this.userList[i].auth == auth) {
                return false;
            }
        }
        
        return true;
    };
    
    this.getSimplizedUserList = function() {
        var obj = [];
        for (var i = 0;i < this.userList.length;i ++) {
            var user = this.userList[i];
            obj.push(user.getSimplizedUser());
        }
        
        return obj;
    };
}

function User(auth, socket) {
    this.auth = auth;
    this.socket = socket;
    this.roomId = -1;
    
    this.getAuth = function() {
        return this.auth;
    };
    
    this.send = function(data) {
        this.socket.write(data);
    };
    
    this.bindRoom = function(room) {
        this.room = room;
    };
    
    this.unbindRoom = function() {
        this.room = null;
    };
    
    this.getId = function() {
        return this.auth.id;
    };
    
    this.getNickname = function() {
        return this.auth.nickname;
    };
    
    this.getSimplizedUser = function() {
        var obj = {
            authId: this.getId(),
            authNickname: this.getNickname(),
            room: { }
        };
        
        if (this.room) {
            obj.room.id = this.room.id;
            obj.room.name = this.room.name;
        } else {
            obj.room.id = -1;
        }
        
        return obj;
    };
}

function AuthenticatorManager() {
    this.authList = new Array();
    
    this.registerAuth = function(nickname) {
        var id = this.getEmptyId();
        var auth = new Authenticator(id, nickname);
        this.authList[id] = auth;
        return auth;
    };
    
    this.removeAuth = function(auth) {
        var index = this.authList.indexOf(auth);
        if (index == -1) {
            return false;
        } else {
            this.authList.splice(index, 1);
            return true;
        }
    };
    
    this.getEmptyId = function() {
        for (var id = 0;id < this.authList.length;id ++) {
            if (this.authList[id] == null) {
                return id;
            }
        }
        return this.authList.length;
    };
    
    this.isNicknameExists = function(nickname) {
        for (var i = 0;i < this.authList.length;i ++) {
            var auth = this.authList[i];
            if (auth) {
                if (auth.nickname == nickname) {
                    return true;
                }
            }
        }
        return false;
    };
    
    
    this.getAuth = function(id, nickname) {
        for (var id = 0;id < this.authList.length;id ++) {
            var auth = this.authList[id];
            
            if (auth.id == id && auth.nickname == nickname) {
                return auth;
            }
        }
        return null;
    };
    
    this.getAuthById = function(id) {
        for (var i = 0;i < this.authList.length;i ++) {
            var auth = this.authList[i];
            if (auth) {
                if (auth.id == id) {
                    return auth;
                }
            }
        }
        return null;
    };
    
    this.getAuthByNickname = function(nickname) {
        for (var i = 0;i < this.authList.length;i ++) {
            var auth = this.authList[i];
            if (auth) {
                if (auth.nickname == nickname) {
                    return auth;
                }
            }
        }
        return null;
    };
    
    this.getSimplizedAuthList = function() {
        var obj = [];
        for (var id = 0;id < this.authList.length;id ++) {
            var auth = this.authList[id];
            if (auth != null) {
                obj.push(auth.getSimplizedAuth());
            }
        }
        
        return obj;
    };
}

function Authenticator(id, nickname) {
    this.id = id;
    this.nickname = nickname;
    
    this.getSimplizedAuth = function() {
        var obj = {
            id: this.id,
            nickname: this.nickname
        };
        
        return obj;
    };
}

exports.UserManager = UserManager;
exports.AuthenticatorManager = AuthenticatorManager;
exports.onUserAdded = function(user) {
    
};
exports.onUserRemoved = function(user) {
    
};
