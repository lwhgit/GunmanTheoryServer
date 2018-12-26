var util = require("./games/util");

var PROBABILITY_STATE_KEEP = 0;
var PROBABILITY_STATE_INCREASE = 1;
var PROBABILITY_STATE_DECREASE = 2;

function GameMember(member) {
    this.member = member;
    this.shootProbability = util.randomRange(10, 30);
    this.probabilityState = PROBABILITY_STATE_KEEP;
    this.activeCard = Card.getRandomCard();
    this.state = {
        burglar: false,
        meditation: false,
        armor: false,
        insurance: false,
        curse: false,
        supporter: false,
        struggle: false
    };
    
    this.getSimplizedGameMember = function() {
        var obj = {
            member: this.memebr.getSimplizedUser(),
            shootProbability: this.shootProbability,
            probabilityState: this.probabilityState,
            activeCard: this.activeCard
        };
    };
}

function memberList2gameMemberList(memberList) {
    var list = [];
    
    for (var i = 0;i < 8;i ++) {
        var member = memberList[i];
        list.push(new GameMember(member));
    }
    
    return list;
}

exports.memberList2gameMemberList = memberList2gameMemberList;
