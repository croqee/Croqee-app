"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const passport_1 = __importDefault(require("passport"));
const config_1 = __importDefault(require("./config"));
const http_1 = __importDefault(require("http"));
const drawingCompetitionController_1 = require("./controllers/drawing-competition/drawingCompetitionController");
const app = express();
const logger = require('morgan');
const zerorpc = require('zerorpc');
const socketIO = require('socket.io');
const { pythonServerEndPoint } = require('./serverglobalvariables');
require('./models').connect(config_1.default.dbUri);
var node_client = new zerorpc.Client();
node_client.connect(pythonServerEndPoint);
// tell the app to parse HTTP body messages
app.use(body_parser_1.default.json());
app.use(body_parser_1.default({ limit: '50mb' }));
app.use(body_parser_1.default.urlencoded({ extended: false }));
// pass the passport middleware
app.use(passport_1.default.initialize());
// load passport strategies
const localSignupStrategy = require('./passport/local-signup');
const localLoginStrategy = require('./passport/local-login');
passport_1.default.use('local-signup', localSignupStrategy);
passport_1.default.use('local-login', localLoginStrategy);
// pass the authenticaion checker middleware
const authCheckMiddleware = require('./middleware/auth-check');
app.use('/api', authCheckMiddleware);
// routes
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);
app.use(logger('dev'));
app.use(body_parser_1.default.json());
app.use(express.static(path_1.default.join(__dirname, '../client/build')));
app.post('/send_drawing', (req, res, next) => {
    let param = {
        dataURL: req.body.dataURL,
        model: 'geometrical5'
    };
    node_client.invoke('DrawingDistance', param, function (error, res2, more) {
        const result = JSON.parse(res2);
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
const server = http_1.default.createServer(app);
const io = socketIO(server);
new drawingCompetitionController_1.drawingCompetitionController(io, node_client, "still_life");
server.listen(process.env.PORT || 8080);
//# sourceMappingURL=index.js.map