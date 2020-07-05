const Score = require('mongoose').model('Score');
const User = require('mongoose').model('User');

interface iUserScore {
	user: string;
	score: number;
}

interface iUserInfo {
	email: String;
	name: string;
}
interface iuserScoresData {
	totalScores: number;
	userRank: number | null;
	userFounded: boolean;
	data: [];
}
exports.updateUserScore = function (_userId: string, _modelId: string, _score: number) {
	Score.findOne({
		userId: _userId,
		modelId: _modelId
	}).then((userScore: any) => {
		if (userScore && userScore.score < _score) {
			userScore.score = _score;
			userScore.date = new Date();
			userScore.save(function (err: any) {
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
			_userScore.save(function (err: any) {
				if (err) {
					console.error('ERROR!');
				}
			});
		}
	}).catch();
};

exports.getUsersTotalScore = function (user: any, callback: any) {
	if (user) {
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
					if (res) {
						let userFoundend: boolean = false;
						let finalResults: any = [];
						let data: iuserScoresData = {
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
								User.findOne({ _id: finalResults[i]._id }).then((res2: any) => {
									if (res2) {
										const userInfo: iUserInfo = {
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
											getUserScorePosition(data, userFoundend, res, finalResults, user, (data: any) => {
												callback(data);
											});
											return;
										}
									}
								}).catch((err: any) => console.log(err));
							}
						}
					}
				}).catch((err: any) => console.log(err));
		});
	}
};
let getUserScorePosition = function (
	data: iuserScoresData,
	userFoundend: boolean,
	res: any,
	finalResults: any,
	user: any,
	callback: any
) {
	let counter = 0;
	let index = -1;
	const obj = res.filter((_obj: any) => _obj._id == user._id)[0];
	index = res.indexOf(obj);
	if (index != -1 && !userFoundend) {
		const iteration = res.length - index < 3 ? res.length - index : 3;
		for (let i = 0; i < iteration; i++) {
			let _index = index;
			User.findOne({ _id: res[index]._id }).then((res2: any) => {
				if (res2) {
					const userInfo: iUserInfo = {
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
						finalResults.sort((a: any, b: any) => a.rank - b.rank);
						data.data = finalResults;
						callback(data);
						return;
					}
				}
				console.log(_index);
			}).catch((err: any) => console.log(err));
			++index;
		}
	} else {
		finalResults.sort((a: any, b: any) => a.rank - b.rank);
		data.data = finalResults;
		callback(data);
	}
};

let getTotalScores = function (callback: any) {
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
		}).catch((err: any) => console.log(err));
};

exports.getScoredModels = function (callback: any) {
	Score.distinct('modelId').exec().then((res: any) => {
		if (res) {
			callback(res);
		}
	});
};
