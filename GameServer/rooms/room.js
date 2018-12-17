function RoomManager() {
    this.roomList = new Array();
    
    this.createRoom = function(user, config) {
        var id = this.getEmptyId();
        this.roomList[id] = new Room(id, user, config);
        return this.roomList[id];
    };
    
    this.removeRoom = function(room) {
        var index = this.roomList.indexOf(room);
        if (index == -1) {
            return false;
        } else {
            this.roomList[index] = null;
            return true;
        }
    };
    
    this.getRoomById = function(id) {
        for (var i = 0;i < this.roomList.length;i ++) {
            var room = this.roomList[i];
            if (room) {
                if (room.id == id) {
                    return room;
                }
            }
        }
        return null;
    };
    
    this.getEmptyId = function() {
        for (var id = 0;id < this.roomList.length;id ++) {
            if (this.roomList[id] == null) {
                return id;
            }
        }
        return this.roomList.length;
    };
    
    this.getSimplizedRoomList = function() {
        var obj = [];
        
        for (var i = 0;i < this.roomList.length;i ++) {
            var room = this.roomList[i];
            if (room != null) {
                obj.push(room.getSimplizedRoom());
            }
        }
        
        return obj;
    };
}

function Room(id, chief, config) {
    this.id = id;
    this.chief = chief;
    this.memberList = new Array(8);
    this.config = config;
    
    this.addMember = function(member) {
        var i = this.getEmptyMemberSpace();
        this.memberList[i] = member;
        member.bindRoom(this);
    };
    
    this.removeMember = function(member) {
        var i = this.memberList.indexOf(member);
        this.memberList[i] = null;
        member.unbindRoom();
    };
    
    this.sendAll = function(data) {
        for (var i = 0;i < this.memberList.length;i ++) {
            var member = this.memberList[i];
            if (member != null) {
                member.send(data);
            }
        }
    };
    
    this.getSimplizedRoom = function() {
        var obj = {
            id: this.id,
            chief: {
                id: this.chief.getId(),
                nickname: this.chief.getNickname()
            },
            memberList: [],
            config: this.config
        };
        
        for (var i = 0;i < this.memberList.length;i ++) {
            var member = this.memberList[i];
            if (member == null) {
                obj.memberList.push({
                    authId: -1,
                    authNickname: null,
                    room: null
                });
            } else {
                obj.memberList.push(member.getSimplizedUser());
            }
        }
        
        return obj;
    };
    
    this.getEmptyMemberSpace = function() {
        for (var i = 0;i < 8;i ++) {
            if (this.memberList[i] == null) {
                return i;
            }
        }
        
        return -1;
    };
    
    this.getCurrentPersonnel = function() {
        var count = 0;
        
        for (var i = 0;i < 8;i ++) {
            var member = this.memberList[i];
            if (member != null) {
                count ++;
            }
        }
        
        return count;
    };
    
    this.getMaxPersonnel = function() {
        return this.config.maxPersonnel;
    };
    
    this.addMember(this.chief);
}

function RoomConfig() {
    this.name = "New Room";
    this.maxPersonnel = 8;
}

exports.RoomManager = RoomManager;
