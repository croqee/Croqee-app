const Score = require('mongoose').model('Score');
const User = require('mongoose').model('User');
exports.updateUserScore = function (_userId, _modelId, _score) {
    Score.findOne({
        userId: _userId,
        modelId: _modelId
    }).then((userScore) => {
        if (userScore && userScore.score < _score) {
            userScore.score = _score;
            userScore.date = new Date();
            userScore.save(function (err) {
                if (err) {
                    console.error('ERROR!');
                }
            });
        }
        else if (!userScore) {
            const _userScore = new Score({
                userId: _userId,
                modelId: _modelId,
                score: _score,
                date: new Date()
            });
            _userScore.save(function (err) {
                if (err) {
                    console.error('ERROR!');
                }
            });
        }
    });
};
exports.getUsersTotalScore = function (callback) {
    Score.aggregate([
        { $match: {} },
        { $group: { _id: '$userId', total: { $sum: '$score' } } },
        { $sort: { total: -1 } }
    ])
        .exec()
        .then((res) => {
        if (res) {
            res.forEach((element, i) => {
                User.findOne({ _id: element._id }).then((res2) => {
                    const userInfo = {
                        email: res2.email,
                        name: res2.name
                    };
                    res[i].user = userInfo;
                    if (i === res.length - 1) {
                        callback(res);
                    }
                });
            });
        }
    });
};
exports.getScoredModels = function (callback) {
    Score.distinct('modelId')
        .exec()
        .then((res) => {
        if (res) {
            callback(res);
        }
    });
};
//# sourceMappingURL=scoreRepo.js.map