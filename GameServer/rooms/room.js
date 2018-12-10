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
}

function Room(id, chief, config) {
    this.id = id;
    this.chief = chief;
    this.chief.bindRoom(this);
    this.memberList = new Array();
    this.config = config;
    
    this.addMember = function(member) {
        this.memberList.push(member);
        member.bindRoom(this);
    };
    
    this.removeMember = function(member) {
        this.memberList.splice(this.memberList.indexOf(member), 1);
        member.unbindRoom();
    };
    
    
}

function RoomConfig() {
    this.name = "New Room";
    this.maxPersonnel = 8;
}

exports.RoomManager = RoomManager;
