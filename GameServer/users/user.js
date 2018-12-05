function UserManager() {
    this.userList = new Array();
    
    this.registerUser = function(auth, socket) {
        if (!this.canUseAuth(auth)) {
            return null;
        }
        
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
    
    this.canUseAuth = function(auth) {
        for (var i = 0;i < this.userList.length;i ++) {
            if (this.userList[i].auth == auth) {
                return false;
            }
        }
        
        return true;
    };
}

function User(auth, socket) {
    this.auth = auth;
    this.socket = socket;
    
    this.send = function(data) {
        this.socket.write(data);
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
            var auth = this.authList[i];
            
            if (auth.id == id && auth.nickname == nickname) {
                return authl
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
}

function Authenticator(id, nickname) {
    this.id = id;
    this.nickname = nickname;
}

exports.UserManager = UserManager;
exports.AuthenticatorManager = AuthenticatorManager;
exports.onUserAdded = function(user) {
    
};
exports.onUserRemoved = function(user) {
    
};
