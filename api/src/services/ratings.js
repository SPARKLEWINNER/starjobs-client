var controller = {
    calculate: function (stars) {
        var oneTotal = oneStar * 1;
        var twoTotal = twoStar * 2;
        var threeTotal = threeStar * 3;
        var fourTotal = fourStar * 4;
        var fiveTotal = fiveStar * 5;
        var totalClicks = oneStar + twoStar + threeStar + fourStar + fiveStar;
        var totalStars = oneTotal + twoTotal + threeTotal + fourTotal + fiveTotal;
        var avgStars = totalStars / totalClicks;
        return avgStars;
    }
};

module.exports = controller;
