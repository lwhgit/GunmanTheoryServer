function UserManager() {
    this.userList = new Array();
}

function User(auth, socket) {
    this.auth = auth;
    this.socket = socket;
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
