import {error} from "shelljs";
import Any = jasmine.Any;
import arrayContaining = jasmine.arrayContaining;
const Score = require('mongoose').model('Score');
const User = require('mongoose').model('User');
// const UsersWithScores = require('mongoose').model('UsersWithScores')

interface iUserScore {
	modelId: string;
	score: number;
	date: Date;
}

interface iUserInfo {
	email: String;
	name: string;
	img: any;
}
interface iuserScoresData {
	totalScores: number;
	userRank: number | null;
	userFounded: boolean;
	data: [];
}


exports.updateUserScore = function (_userId: string, _modelId: string, _score: number) {
	User.findOne({
	_id: _userId,
}).then((user: any) => {

	const userScoresArr = user.scores;
		let scoreIndex: number;
		userScoresArr.forEach((s:iUserScore, index:number)=> s.modelId ===_modelId ? scoreIndex = index :  null);

		  if ( scoreIndex === undefined){
			const _userScore = {
				userId: _userId,
				modelId: _modelId,
				score: _score,
				date: new Date()
			};
			user.scores.push(_userScore);
			console.log(user.scores);
			user.save(function (err: any) {
				if (err) {
					console.error('ERROR!');
				}
			});
		} else {

			  let existingScoreArr =  userScoresArr[scoreIndex];

			  if (existingScoreArr.score < _score){
				  existingScoreArr.score = _score;
				  existingScoreArr.date = new Date;
				  user.scores[scoreIndex] = existingScoreArr;
				  console.log(user);
				  user.save(function (err: any) {
					if (err) {
						console.error('ERROR!');
					}
				  });
			  }
		  }
		}).catch((err : any) => console.log(err));

};

exports.getUsersTotalScore = function (user: any, callback: any) {
		// console.log(user);


	if(user){
		let query :string= user._id;



	User.aggregate([
		{
			'$match': {},
		},
		{
			'$unwind':'$scores'
		},{
		'$group':{
				_id: {
					_id:'$_id',
					email:'$email',
					name:'$name',
					img:'$img',
				},
				totalScore:{$sum:"$scores.score"}
			}
		},{
		"$sort":{
			totalScore: -1
		  }
		},
		{
		"$match": {
			"_id._id":query
		}
		}

	]).exec()
		.then((res: any)=>{

			console.log(res);



			if(res){
				let userFoundend: boolean = false;
				let finalResults: any = [];
				let data: iuserScoresData = {
					totalScores : res.length,
					userRank: null,
					userFounded: false,
					data: []
				};
				if(user){
					console.log(data.totalScores);
					console.log(res[3]._id.email);
					console.log(user.email );
					let topTen: any = res.splice(0,9);
					let jaber: any = topTen.filter( (item:any) =>item._id.email === user.email);
					console.log(jaber);
					// let topten: any = topTen.filter( (item:any) =>item._id._id === user._id);
					let topten: any = topTen.findIndex( (item:any) => user._id === item._id._id );
					console.log(topten);

				}





			}

		})
		.catch((err:any) =>console.log(err));

	}



};





exports._getUsersTotalScore = function (user: any, callback: any) {
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
					// console.log(res);
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
											name: res2.name,
											img: res2.img
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
						console.log(finalResults[0]);
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
						name: res2.name,
						img: res2.img
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
