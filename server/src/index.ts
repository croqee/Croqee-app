import http from 'http';
import path from 'path';
import express, { ErrorRequestHandler } from 'express';
import 'express-async-errors';
import logger from 'morgan';
import passport from 'passport';
import * as socketIO from 'socket.io';
import * as socketIoClient from 'socket.io-client';
import * as config from './config';
import { DrawingCompetitionController } from './controllers/drawing-competition/drawing-competition-controller';
import { connectDb } from './db/models';
import { getUsersTotalScore } from './db/repositories/score-repo';
import { authMiddleware } from './middleware/auth-check';
import { localLoginStrategy } from './passport/local-login';
import { localSignupStrategy } from './passport/local-signup';
import { router as apiRoutes } from './routes/api';
import { router as authRoutes } from './routes/auth';
import { router as imageRoutes } from './routes/images';
import { router as scoreRoutes } from './routes/score';
import { router as userImage } from './routes/user-image';

const app = express();
const client = socketIoClient.connect('http://server_python:9699', {
  reconnect: true,
});

interface HttpError extends Error {
  status?: number;
}

void connectDb(config.dbUri);

// tell the app to parse HTTP body messages
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static('uploads'));
// pass the passport middleware
app.use(passport.initialize());

// load passport strategies
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

// pass the authenticaion checker middleware
app.use('/api', authMiddleware);
app.use('/score', authMiddleware);
app.use('/images', authMiddleware);

// routes

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/score', scoreRoutes);
app.use('/images', imageRoutes);
app.use('/user-image', userImage);

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, '../../client/build')));
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
});

getUsersTotalScore();

app.post('/send_drawing', (req, res, _next) => {
  const param = {
    dataURL: req.body.dataURL,
    model: req.body.model,
    canvasWidth: req.body.canvasWidth,
    canvasHeight: req.body.canvasHeight,
  };
  calculateScore(param, function (_res: any) {
    const result = JSON.parse(_res);
    res.json({
      score: Math.floor(result.score),
      img: result.img,
    });
  });
});

app.use((_req, _res, next) => {
  const error = new Error('Not Found') as HttpError;
  error.status = 404;
  next(error);
});

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  res.status(error.status || 500);

  res.json({
    error: {
      message: error.message,
    },
  });
};

app.use(errorHandler);

const server = http.createServer(app);

const calculateScore = (param: any, cb: Function) => {
  client.emit('calculate_score', param, function (res: any) {
    cb(res);
  });
};
//Drawing competitions
new DrawingCompetitionController(
  socketIO,
  server,
  calculateScore,
  'still-life',
);
new DrawingCompetitionController(socketIO, server, calculateScore, 'anatomy');

server.listen(process.env.PORT || 8080);
