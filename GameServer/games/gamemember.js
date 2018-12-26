var util = require("./util");
var card = require("./card");

var PROBABILITY_STATE_KEEP = 0;
var PROBABILITY_STATE_INCREASE = 1;
var PROBABILITY_STATE_DECREASE = 2;

function GameMember(member) {
    this.member = member;
    this.shootProbability = util.randomRange(10, 30);
    this.probabilityState = PROBABILITY_STATE_KEEP;
    this.activeCard = card.getRandomCard();
    this.state = {
        burglar: false,
        meditation: false,
        armor: false,
        insurance: false,
        supporter: false,
        struggle: false
    };
    
    this.getSimplizedGameMember = function() {
        var obj = null;
        if (this.member) {
            obj = {
                member: this.member.getSimplizedUser(),
                shootProbability: this.shootProbability,
                probabilityState: this.probabilityState,
                activeCard: this.activeCard
            };
        } else {
            obj = {
                member: null
            };
        }
        
        return obj;
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
