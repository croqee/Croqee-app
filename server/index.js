const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const logger = require('morgan');
const zerorpc = require('zerorpc');
const passport = require('passport');
const config = require('./config');
const helpers = require('./helpers');

const http = require('http');
const socketIO = require('socket.io');

const jwt = require('jsonwebtoken');

const { pythonServerEndPoint, emptyDataUrl } = require('./serverglobalvariables');

require('./models').connect(config.dbUri);

const User = require('mongoose').model('User');

var node_client = new zerorpc.Client();
node_client.connect(pythonServerEndPoint);

// tell the app to parse HTTP body messages
app.use(bodyParser.json());
app.use(bodyParser({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
// pass the passport middleware
app.use(passport.initialize());

// load passport strategies
const localSignupStrategy = require('./passport/local-signup');
const localLoginStrategy = require('./passport/local-login');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

// pass the authenticaion checker middleware
const authCheckMiddleware = require('./middleware/auth-check');
app.use('/api', authCheckMiddleware);

// routes
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client/build')));

app.post('/', (req, res, next) => {
	res.json({
		greet: 'Hey! Croqee App here!',
		note: 'something...bla bla'
	});
});

app.post('/send_drawing', (req, res, next) => {
	// let dataURL = req.body.dataURL;
	// node_client.invoke('DrawingDistance', dataURL, function(error, res2, more) {
	// 	result = JSON.parse(res2);
	// 	res.json({
	// 		score: Math.floor(result.score),
	// 		img: result.img
	// 	});
	// });
	let param = {
		dataURL: req.body.dataURL,
		model: 'geometrical5'
	};
	node_client.invoke('DrawingDistance', param, function(error, res2, more) {
		result = JSON.parse(res2);

		res.json({
			score: Math.floor(result.score),
			img: result.img
		});
	});
});

//avoid python server sleeping
setInterval(() => {
	node_client.invoke('wakeUp');
}, 10000);

app.use((req, res, next) => {
	const error = new Error('Not Found');
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);

	res.json({
		error: {
			message: error.message
		}
	});
});

const server = http.createServer(app);

let stillLifePlayers = [];
let stillLifeModels = [];
let lastStillLifeDrawnModel;
let stillLifeRound;
let isStillLifeBeginProcessed;
let isStillLifeBeginCallbackSent;
let hasToBeResetAsUsersLeave;
let numOfUsersGotScored;
resetStillLife();

function findWithAttr(array, attr, value) {
	for (var i = 0; i < array.length; i += 1) {
		if (array[i][attr] === value) {
			return i;
		}
	}
	return -1;
}
function resetStillLife() {
	stillLifeModels = [
		{
			model: 'geometrical1',
			givenTime: 40
		},
		{
			model: 'geometrical2',
			givenTime: 40
		},
		{
			model: 'geometrical3',
			givenTime: 40
		},
		{
			model: 'geometrical4',
			givenTime: 40
		},
		{
			model: 'geometrical5',
			givenTime: 40
		}
	];
	stillLifeRound = 1;
	isStillLifeBeginProcessed = false;
	isStillLifeBeginCallbackSent = false;
	hasToBeResetAsUsersLeave = false;
	numOfUsersGotScored = 0;
}
var stillLifeLastUpdateTime;
function getNumberOfPlayingUsers(users){
	return users.filter( u => u.status === 'playing').length;
}

const io = socketIO(server);

//Still Life game loop
setInterval(() => {
	if (stillLifePlayers.length != 0) {
		!hasToBeResetAsUsersLeave ? (hasToBeResetAsUsersLeave = true) : '';
		if (isStillLifeBeginProcessed) {
			var currentTime = new Date().getTime();
			var timeDifference = currentTime - stillLifeLastUpdateTime;
			timeDifference = Math.round(timeDifference / 1000);
			if (stillLifeModels[stillLifeRound - 1].givenTime <= timeDifference) {
				isStillLifeBeginProcessed = false;
				io.sockets.emit('send_your_drawing');
				lastStillLifeDrawnModel = stillLifeModels[stillLifeRound - 1].model;
				stillLifeRound++;
				if (stillLifeRound > stillLifeModels.length) {
					stillLifeRound = 1;
				}
			}
		} else {
		
			if (numOfUsersGotScored >= getNumberOfPlayingUsers(stillLifePlayers)|| stillLifePlayers.length == 1) {
				if (!isStillLifeBeginCallbackSent) {
					isStillLifeBeginCallbackSent = true;
					io.sockets.emit('join_club', stillLifeModels[stillLifeRound - 1]);
					stillLifePlayers = stillLifePlayers
						? stillLifePlayers.sort((a, b) => {
								return b.score - a.score;
							})
						: [];
					setTimeout(() => {
						if (!isStillLifeBeginProcessed) {
							io.sockets.emit('users_score', stillLifePlayers);
						}
					}, 2500);
					setTimeout(() => {
						if (!isStillLifeBeginProcessed) {
							io.sockets.emit('start_drawing', stillLifeModels[stillLifeRound - 1]);
							isStillLifeBeginCallbackSent = false;
							isStillLifeBeginProcessed = true;
							numOfUsersGotScored = 0;
							stillLifeLastUpdateTime = new Date().getTime();
						}
					}, 7000);
				}
			}
		}
	} else if (hasToBeResetAsUsersLeave) {
		// reset every thing to defualt
		resetStillLife();
		hasToBeResetAsUsersLeave = false;
	}
}, 80);

io.on('connection', (socket) => {
	let joinedUser = {};

	socket.on('username', (token) => {
		jwt.verify(token, config.jwtSecret, (err, decoded) => {
			if (!err) {
				const userId = decoded.sub;
				return User.findById(userId, (userErr, user) => {
					if (!userErr && user) {
						let userIsNotAlreadyJoined = stillLifePlayers.filter((u) => u._id == user._id).length == 0;
						if (userIsNotAlreadyJoined) {
							joinedUser = {
								_id: user._id,
								name: user.name,
								status: 'recently joined',
								score: 0
							};
							stillLifePlayers.push(joinedUser);
							io.sockets.emit('update_user', stillLifePlayers);

							//Invoking my_drawing after the user is verified
							socket.on('my_drawing', (dataURL) => {
								let _score = 0;
								if (dataURL != null) {
									let param = {
										dataURL: dataURL,
										model: lastStillLifeDrawnModel
									};
									node_client.invoke('DrawingDistance', param, function(error, res2, more) {
										result = JSON.parse(res2);
										_score = Math.floor(result.score);
										socket.emit('evaluated_score', { score: _score, img: result.img });
										numOfUsersGotScored++;

										let _index = findWithAttr(stillLifePlayers, '_id', joinedUser._id);
										joinedUser.score = _score;
										joinedUser.status == 'recently joined' ? (joinedUser.status = 'playing') : '';
										stillLifePlayers[_index] = joinedUser;
										io.sockets.emit('update_user', stillLifePlayers);
									});
								} else {
									socket.emit('evaluated_score', { score: _score, img: null });
									numOfUsersGotScored++;

									let _index = findWithAttr(stillLifePlayers, '_id', joinedUser._id);
									joinedUser.score = _score;
									joinedUser.status == 'recently joined' ? (joinedUser.status = 'playing') : '';
									stillLifePlayers[_index] = joinedUser;
									io.sockets.emit('update_user', stillLifePlayers);
								}
							});
						}
					}
				});
			}
		});
	});

	socket.on('disconnect', () => {
		stillLifePlayers = stillLifePlayers.filter((u) => u._id != joinedUser._id);
		io.sockets.emit('update_user', stillLifePlayers);
	});
});

server.listen(process.env.PORT || 8080);
