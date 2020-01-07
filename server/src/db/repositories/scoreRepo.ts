const Score = require('mongoose').model('Score');
const User = require('mongoose').model('User');

interface iUserScore {
	user: string;
	score: number;
}

interface iUserInfo {
	email: string;
	name: string;
}

exports.updateUserScore = function(_userId: string, _modelId: string, _score: number) {
	Score.findOne({
		userId: _userId,
		modelId: _modelId
	}).then((userScore: any) => {
		if (userScore && userScore.score < _score) {
			userScore.score = _score;
			userScore.date = new Date();
			userScore.save(function(err: any) {
				if (err) {
					console.error('ERROR!');
				}
			});
		} else if (!userScore) {
			const _userScore = new Score({
				userId: _userId,
				modelId: _modelId,
				score: _score,
				date: new Date()
			});
			_userScore.save(function(err: any) {
				if (err) {
					console.error('ERROR!');
				}
			});
		}
	});
};

exports.getUsersTotalScore = function(user: any, callback: any) {
	getTotalScores((totalScores: number) => {
		Score.aggregate([
			{ $match: {} },
			{ $group: { _id: '$userId', total: { $sum: '$score' } } },
			{
				$sort: { total: -1 }
			}
		])
			.exec()
			.then((res: any) => {
				let data: any = {
					totalScores,
					data: []
				};
				if (res) {
					let userFoundend: boolean = false;
					let finalResults: any = [];
					let counter = 0;
					for (let i = 0; i < 10; i++) {
						if (res[i]) {
							finalResults[i] = res[i];
							User.findOne({ _id: finalResults[i]._id }).then((res2: any) => {
								const userInfo: iUserInfo = {
									email: res2.email,
									name: res2.name
								};
								finalResults[i].user = userInfo;
								finalResults[i].rank = i + 1;
								counter++;
							});
						}
					}
    					let counter2 = 0;
						let index = -1;
						for (let i = 0; i < 2; i++) {
							if (i === 0) {
								const obj = res.filter((_obj: any) => _obj._id == user._id)[0];
								index = res.indexOf(obj);
								// if (index <= finalResults.length) {
								// 	console.log("3rrrrrrrrrrrrrrrrrrrrTRIGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG")

								// 	data.data = finalResults;
								// 	callback(data);
								// 	return;
								// }
							}
								finalResults[finalResults.length] = res[index];
								User.findOne({ _id: finalResults[finalResults.length - 1]._id }).then((res2: any) => {
									const userInfo: iUserInfo = {
										email: res2.email,
										name: res2.name
									};
									finalResults[finalResults.length - 1].user = userInfo;
									finalResults[finalResults.length - 1].rank = index + 1;
									++counter2;
									if (true) {
										console.log("1rrrrrrrrrrrrrrrrrrrrTRIGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG")
										data.data = finalResults;
										callback(data);
										return;
									}
								});
								index++;
							
						}
					}
			});
	});
};

let getTotalScores = function(callback: any) {
	Score.aggregate([
		{ $match: {} },
		{
			$group: { _id: '$userId' }
		}
	])
		.exec()
		.then((res: any) => {
			if (res) {
				callback(res.length);
			}
		});
};

exports.getScoredModels = function(callback: any) {
	Score.distinct('modelId').exec().then((res: any) => {
		if (res) {
			callback(res);
		}
	});
};
