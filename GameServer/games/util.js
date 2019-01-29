function randomRange(r1, r2) { // double, double
    return Math.floor(Math.random() * (r2 - r1) + r1);
}

exports.randomRange = randomRange;
