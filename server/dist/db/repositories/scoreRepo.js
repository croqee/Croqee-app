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
exports.getUsersTotalScore = function (user, callback) {
    getTotalScores((totalScores) => {
        Score.aggregate([
            { $match: {} },
            { $group: { _id: '$userId', total: { $sum: '$score' } } },
            {
                $sort: { total: -1 }
            }
        ])
            .exec()
            .then((res) => {
            if (res) {
                let userFoundend = false;
                let finalResults = [];
                let data = {
                    totalScores,
                    userRank: null,
                    userFounded: false,
                    data: []
                };
                let counter = 0;
                const iteration = res.length < 10 ? res.length : 10;
                for (let i = 0; i < iteration; i++) {
                    if (res[i]) {
                        finalResults[i] = res[i];
                        User.findOne({ _id: finalResults[i]._id }).then((res2) => {
                            const userInfo = {
                                email: res2.email,
                                name: res2.name
                            };
                            finalResults[i].user = userInfo;
                            finalResults[i].rank = i + 1;
                            if (user.email === res2.email) {
                                userFoundend = true;
                                data.userRank = i + 1;
                                data.userFounded = true;
                            }
                            counter++;
                            if (counter === iteration) {
                                getUserScorePosition(data, userFoundend, res, finalResults, user, (data) => {
                                    callback(data);
                                });
                                return;
                            }
                        });
                    }
                }
            }
        });
    });
};
let getUserScorePosition = function (data, userFoundend, res, finalResults, user, callback) {
    let counter = 0;
    let index = -1;
    const obj = res.filter((_obj) => _obj._id == user._id)[0];
    index = res.indexOf(obj);
    if (index != -1 && !userFoundend) {
        const iteration = res.length - index < 3 ? res.length - index : 3;
        for (let i = 0; i < iteration; i++) {
            let _index = index;
            User.findOne({ _id: res[index]._id }).then((res2) => {
                if (res2) {
                    const userInfo = {
                        email: res2.email,
                        name: res2.name
                    };
                    res[_index].user = userInfo;
                    res[_index].rank = _index + 1;
                    if (user.email === res2.email) {
                        userFoundend = true;
                        data.userRank = _index + 1;
                        data.userFounded = true;
                    }
                    finalResults.push(res[_index]);
                    ++counter;
                    if (counter === iteration) {
                        finalResults.sort((a, b) => a.rank - b.rank);
                        data.data = finalResults;
                        callback(data);
                        return;
                    }
                }
                console.log(_index);
            });
            ++index;
        }
    }
    else {
        finalResults.sort((a, b) => a.rank - b.rank);
        data.data = finalResults;
        callback(data);
    }
};
let getTotalScores = function (callback) {
    Score.aggregate([
        { $match: {} },
        {
            $group: { _id: '$userId' }
        }
    ])
        .exec()
        .then((res) => {
        if (res) {
            callback(res.length);
        }
    });
};
exports.getScoredModels = function (callback) {
    Score.distinct('modelId').exec().then((res) => {
        if (res) {
            callback(res);
        }
    });
};
//# sourceMappingURL=scoreRepo.js.map