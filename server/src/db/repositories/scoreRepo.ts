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

exports.getUsersTotalScore = function(page:number,callback: any, offset:number = 10) {
	getTotalScorePages((totalPages:number)=>{
	Score.aggregate([
		{ $match: {} },
		{ $group: { _id: '$userId', total: { $sum: '$score' } } },
		{ $sort: { total: -1 }
	 },
	 {"$skip": (page - 1) * offset },
	 {"$limit": offset }
		
	])
		.exec()
		.then((res: any) => {
			let data:any = {
				page:page,
				totalPages:totalPages,
			  data:[]};
			if (res) {
				let counter = 0;
				res.forEach((element: any, i:number) => {
					User.findOne({ _id: element._id }).then((res2: any) => {
						const userInfo: iUserInfo = {
							email: res2.email,
							name: res2.name
						};
						res[i].user = userInfo;
						res[i].rank = (i + 1) + ((page - 1) * offset);
						++counter;
						if (counter === res.length) {
							data.data = res;
							callback(data);
						}
					});
				});
			}
		});
	})
};

let getTotalScorePages = function(callback:any, offset:number = 10) {
	Score.aggregate([
		{ $match: {} },
		{ $group: { _id: '$userId'} 
	 }
	])
		.exec()
		.then((res: any) => {
			if (res) {
				let pageSize:number = Math.ceil(res.length / offset);
				callback(pageSize);
			}
		});
};

exports.getScoredModels = function(callback: any) {
	Score.distinct( 'modelId')
		.exec()
		.then((res: any) => {
			if (res) {
        callback(res);
			}
		});
};