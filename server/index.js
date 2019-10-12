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

const { pythonServerEndPoint, emptyDataUrl } = require('./serverglobalvariables');

require('./models').connect(config.dbUri);
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
	let dataURL = req.body.dataURL;
	node_client.invoke('DrawingDistance', dataURL, function(error, res2, more) {
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
let stillLifeModels = [
	{
		model: 'model_1',
		givenTime: 30,
		timer: 30
	},
	{
		model: 'model_2',
		givenTime: 30,
		timer: 30
	},
	{
		model: 'model_3',
		givenTime: 30,
		timer: 30
	}
];
let stillLifeRound = 1;
let isStillLifeBeginProcessed = false;
let hasToBeResetAsUsersLeave = false;
let numOfUsersGotScored = 0;

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
			model: 'model_1',
			givenTime: 30,
			timer: 30
		},
		{
			model: 'model_2',
			givenTime: 30,
			timer: 30
		},
		{
			model: 'model_3',
			givenTime: 30,
			timer: 30
		}
	];
	stillLifeRound = 1;
	isStillLifeBeginProcessed = false;
	hasToBeResetAsUsersLeave = false;
	numOfUsersGotScored = 0;
}

const io = socketIO(server);
setInterval(() => {
	console.log('num of users ' + stillLifePlayers.length);
	console.log('num of scored users ' + numOfUsersGotScored);
	if (stillLifePlayers.length != 0) {
		console.log(isStillLifeBeginProcessed);
		if (isStillLifeBeginProcessed) {
			!hasToBeResetAsUsersLeave ? (hasToBeResetAsUsersLeave = true) : '';
			stillLifeModels[stillLifeRound - 1].timer--;
			if (stillLifeModels[stillLifeRound - 1].timer == 0) {
				isStillLifeBeginProcessed = false;
				io.sockets.emit('send_your_drawing');
				stillLifeModels[stillLifeRound - 1].timer = stillLifeModels[stillLifeRound - 1].givenTime;
				stillLifeRound++;
				if (stillLifeRound > stillLifeModels.length) {
					stillLifeRound = 1;
				}
			}
		} else {
			if (numOfUsersGotScored >= stillLifePlayers.length || stillLifePlayers.length == 1) {
				setTimeout(() => {
					io.sockets.emit('start_drawing', stillLifeModels[stillLifeRound - 1]);
					isStillLifeBeginProcessed = true;
					numOfUsersGotScored = 0;
				}, 5000);
			}
		}
	} else {
		if (hasToBeResetAsUsersLeave) {
			// reset every thing to defualt
			resetStillLife();
			hasToBeResetAsUsersLeave = false;
		}
	}
}, 1000);

io.on('connection', (socket) => {
	let joinedUser;
	console.log('New client connected');

	socket.on('username', (user) => {
		joinedUser = user;
		let userIsValid = joinedUser && joinedUser._id != null;
		let userIsNotAlreadyJoined = stillLifePlayers.filter((u) => u._id == joinedUser._id).length == 0;
		if (userIsValid && userIsNotAlreadyJoined) {
			joinedUser.status = 'recently joined';
			joinedUser.score = 0;
			stillLifePlayers.push(joinedUser);
			console.log('stillLifePlayers');
			console.log(stillLifePlayers);
			numOfUsersGotScored++;
			io.sockets.emit('update_user', stillLifePlayers);
		}
		socket.on('my_drawing', (dataURL) => {
			let _score = 0;
			if (dataURL != null) {
				node_client.invoke('DrawingDistance', dataURL, function(error, res2, more) {
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
	});

	socket.on('disconnect', () => {
		console.log('user disconnected');
		stillLifePlayers = stillLifePlayers.filter((u) => u != joinedUser);
		console.log('stillLifePlayers');
		console.log(stillLifePlayers);
	});
});

server.listen(process.env.PORT || 8080);
