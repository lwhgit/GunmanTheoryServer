var util = require("./games/util");

function Card() {
    this.cardList = {
        "burglar": {
            "name": "강도",
            "text": "죽인 사람에게서 돈을 4배 더 많이 빼앗아온다.(1회에 한함)",
            "image": "cardBurglar"
        },
        "armor": {
            "name": "방탄복",
            "text": "7달러를 지불한다. 총에 맞아도 죽지 않는다.(1회에 한함)",
            "image": "cardArmor"
        },
        "escape": {
            "name": "도주",
            "text": "모인 돈의 25%를 갖고 현재 라운드에서 도망간다.",
            "image": "cardEscape"
        },
        "reverse": {
            "name": "역주행",
            "text": "턴이 반대로 돌아간다.",
            "image": "cardReverse"
        },
        "sponsorA": {
            "name": "후원자 A",
            "text": "즉시 50달러를 받는다.",
            "image": "cardSponsorA"
        },
        "sponsorB": {
            "name": "후원자 B",
            "text": "자신의 턴이 올떄마다 10달러씩 받는다.(중첩 안됨)",
            "image": "cardSponsorB"
        },
        "meditation": {
            "name": "명상",
            "text": "자신의 격발 확률이 더 쉽게 조절된다.(중첩 안됨)",
            "image": "cardMeditation"
        },
        "marksman": {
            "name": "명사수",
            "text": "사용즉시 격발확률이 90%가 된다.",
            "image": "cardMarksman"
        },
        "curse": {
            "name": "저주",
            "text": "자신이 공격한 대상의 격발확률이 10%로 변한다.(1회에 한함)",
            "image": "cardCurse"
        },
        "insurance": {
            "name": "보험",
            "text": "10달러를 지불한다. 사망시 80달러를 받는다.(중첩 안됨)",
            "image": "cardInsurance"
        },
        "destruction": {
            "name": "파괴",
            "text": "모든 플레이어의 카드가 제거된다.",
            "image": "cardDestruction"
        },
        "struggle": {
            "name": "발악",
            "text": "자신의 격발확률이 25% 감소하는 대신, 자기 턴이 한번 더 온다.",
            "image": "cardStruggle"
        }
    };
    
    
    this.getRandomCard = function() {
        var keies = [];
        
        for (var key in this.cardList) {
            keies.push(key);
        }
        
        var index = keies[util.randomRange(0, keies.length)];
        
        return this.cardList[index];
    };
}
