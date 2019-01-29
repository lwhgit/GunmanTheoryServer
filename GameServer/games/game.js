var util = require("./util");
var gamemember = require("./gamemember");

var TURN_DIRECTION_CW = 0;
var TURN_DIRECTION_CCW = 1;

function Game(room) {   // Room
    this.room = room;
    this.gameMemberList = gamemember.memberList2gameMemberList(room.memberList);
    this.round = 0;
    this.turnDirection = TURN_DIRECTION_CCW;
    this.currentTurn = 0;
    
    this.initRound = function() {
        this.shuffleMember();
        this.setFirstTurn();
        
        this.sendAll(JSON.stringify({
            request: "game info",
            game: this.getSimplizedGame()
        }));
    };
    
    this.onData = function(user, json) {    // User, string
        var gameMember = this.getGameMemberByUser(user);
    };
    
    this.onTurnChanged = function() {
        
    };
    
    this.start = function() {
        this.initRound();
    };
    
    this.shuffleMember = function() {
        for (var i = 0;i < 8;i ++) {
            var ti = util.randomRange(0, 8);
            var tmp = this.gameMemberList[i];
            this.gameMemberList[i] = this.gameMemberList[ti];
            this.gameMemberList[ti] = tmp;
        }
    };
    
    this.setFirstTurn = function() {
        for (var i = 0;i < 8;i ++) {
            var gameMember = this.gameMemberList[i];
            if (gameMember.member) {
                if (gameMember.member.auth.id != -1) {
                    this.currentTurn = i;
                    break;
                }
            }
        }
    };
    
    this.sendAll = function(data) { // string
        for (var i = 0;i < 8;i ++) {
            var gameMember = this.gameMemberList[i];
            if (gameMember.member) {
                gameMember.member.send(data);
            }
        }
    };
    
    this.getGameMemberByUser = function(user) { // User
        for (var i = 0;i < gameMemberList.length;i ++) {
            var gameMember = gameMemberList[i];
            
            if (gameMember.user == user) {
                return gameMember;
            }
        }
        return null;
    };
    
    this.getSimplizedGame = function() {
        var obj = {
            room: this.room.getSimplizedRoom(),
            gameMemberList: [],
            round: this.round,
            currentTurn: this.currentTurn
        };
        
        for (var i = 0;i < 8;i ++) {
            obj.gameMemberList.push(this.gameMemberList[i].getSimplizedGameMember());
        }
        
        return obj;
    };
}

exports.Game = Game;
