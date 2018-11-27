function RoomManager() {
    this.roomList = null;
    
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
    
    this.createRoom = function(user, name, config) {
        var id = this.getEmptyId();
        this.roomList[id] = new Room(id, user, config);
        return this.roomList[id];
    };
    
    this.removeRoom = function(room) {
        this.roomList[this.roomList.indexOf(room)] = null;
    };
    
    this.getEmptyId = function() {
        for (var id = 0;id < this.roomList.length;id ++) {
            if (this.roomList[id] == null) {
                return id;
            }
        }
        return this.roomList.length;
    };
    
    this.getJSON = function() {
        var obj = [];
        
        for (var i = 0;i < this.roomList.length;i ++) {
            var room = this.roomList[i];
            if (room) {
                obj.push(JSON.parse(room.getJSON()));
            }
        }
        
        return JSON.stringify(obj);
    };
}

function Room(id, chief, config) {
    this.id = id;
    this.chief = chief;
    this.memberList = new Array();
    this.config = config;
    
    this.addMember = function(member) {
        this.memberList.push(member);
    };
    
    this.removeMember = function(member) {
        this.memberList.splice(this.memberList.indexOf(member), 1);
    };
    
    this.getJSON = function() {
        var obj = {
            id: this.id,
            chief: JSON.parse(this.chief.getJSON()),
            name: this.name,
            memberList: new Array(),
        };
        
        for (var i = 0;i < this.memberList.length;i ++) {
            obj.memberList.push(JSON.parse(this.memberList[i].getJSON()));
        }
        
        return JSON.stringify(obj);
    };
}

function RoomConfig() {
    this.name = "New Room";
    this.maxPersonnel = 8;
}

exports.RoomManager = RoomManager;
