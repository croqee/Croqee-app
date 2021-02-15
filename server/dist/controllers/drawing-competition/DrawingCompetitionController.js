"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
const config_1 = __importDefault(require("../../config"));
const stillLifeModels_1 = require("./stillLifeModels");
const anatomyModels_1 = require("./anatomyModels");
const CompetitionController_1 = require("./CompetitionController");
require('../../db/models').connect(config_1.default.dbUri);
const User = require('mongoose').model('User');
const ScoreRepo = require('../../db/repositories/scoreRepo');
class DrawingCompetitionController extends CompetitionController_1.CompetitionController {
    constructor(socketIO, server, calculateScore, drawingField) {
        super(socketIO, server, drawingField);
        this.players = [];
        this.models = [];
        this.reset();
        this.trackEachUser(this.io, calculateScore);
    }
    reset() {
        if (this.drawingField === 'still-life') {
            this.models = stillLifeModels_1.stillLifeModels;
        }
        else if (this.drawingField === 'anatomy') {
            this.models = anatomyModels_1.anatomyModels;
        }
        this.round = 1;
        this.isBeginProcessed = false;
        this.isBeginCallbackSent = false;
        this.hasToBeResetAsUsersLeave = false;
        this.numOfUsersGotScored = 0;
    }
    getNumberOfPlayingUsers(users) {
        return users.filter((u) => u.status === 'playing').length;
    }
    loop(io) {
        if (this.players.length != 0) {
            !this.hasToBeResetAsUsersLeave ? (this.hasToBeResetAsUsersLeave = true) : '';
            if (this.isBeginProcessed) {
                var currentTime = new Date().getTime();
                var timeDifference = currentTime - this.stillLifeLastUpdateTime;
                timeDifference = Math.round(timeDifference / 1000);
                if (this.models[this.round - 1].givenTime <= timeDifference) {
                    this.isBeginProcessed = false;
                    io.sockets.emit('send_your_drawing');
                    this.lastDrawnModel = this.models[this.round - 1].model;
                    this.round++;
                    if (this.round > this.models.length) {
                        this.round = 1;
                    }
                }
            }
            else {
                if (this.numOfUsersGotScored >= this.getNumberOfPlayingUsers(this.players) ||
                    this.players.length == 1) {
                    if (!this.isBeginCallbackSent) {
                        this.isBeginCallbackSent = true;
                        io.sockets.emit('join_club', this.models[this.round - 1]);
                        this.players = this.players
                            ? this.players.sort((a, b) => {
                                return b.score - a.score;
                            })
                            : [];
                        setTimeout(() => {
                            if (!this.isBeginProcessed) {
                                io.sockets.emit('users_score', this.players);
                            }
                        }, 2500);
                        setTimeout(() => {
                            if (!this.isBeginProcessed) {
                                io.sockets.emit('start_drawing', this.models[this.round - 1]);
                                this.isBeginCallbackSent = false;
                                this.isBeginProcessed = true;
                                this.setNumberofUsersGotScoredToZero();
                                this.stillLifeLastUpdateTime = new Date().getTime();
                            }
                        }, 7000);
                    }
                }
            }
        }
        else if (this.hasToBeResetAsUsersLeave) {
            // reset every thing to defualt
            this.reset();
            this.hasToBeResetAsUsersLeave = false;
        }
    }
    trackEachUser(io, calculateScore) {
        io.on('connection', (socket) => {
            let joinedUser;
            socket.on('username', (token) => {
                jwt.verify(token, config_1.default.jwtSecret, (err, decoded) => {
                    if (!err) {
                        let userId = "";
                        if (typeof decoded.sub === "string") {
                            userId = decoded.sub;
                        }
                        else {
                            userId = decoded;
                        }
                        return User.findById(userId, (userErr, user) => {
                            if (!userErr && user) {
                                let userIsNotAlreadyJoined = this.players.filter((u) => u._id == user._id).length == 0;
                                if (userIsNotAlreadyJoined) {
                                    joinedUser = {
                                        _id: user._id,
                                        name: user.name,
                                        status: 'recently joined',
                                        score: 0
                                    };
                                    this.players.push(joinedUser);
                                    io.sockets.emit('update_user', this.players);
                                    //Invoking my_drawing after the user is verified
                                    socket.on('my_drawing', (dataURL) => {
                                        let _score = 0;
                                        if (dataURL != null) {
                                            let param = {
                                                dataURL: dataURL,
                                                model: this.lastDrawnModel
                                            };
                                            calculateScore(param, (_res) => {
                                                const result = JSON.parse(_res);
                                                _score = Math.floor(result.score);
                                                socket.emit('evaluated_score', { score: _score, img: result.img });
                                                this.increaseNumberOfUsersGotScored();
                                                let _index = this.findWithAttr(this.players, '_id', joinedUser._id);
                                                joinedUser.score = _score;
                                                joinedUser.status == 'recently joined'
                                                    ? (joinedUser.status = 'playing')
                                                    : '';
                                                this.players[_index] = joinedUser;
                                                io.sockets.emit('update_user', this.players);
                                                ScoreRepo.updateUserScore(joinedUser._id, this.models[this.round - 1].model, _score);
                                            });
                                        }
                                        else {
                                            socket.emit('evaluated_score', { score: _score, img: null });
                                            this.increaseNumberOfUsersGotScored();
                                            let _index = this.findWithAttr(this.players, '_id', joinedUser._id);
                                            joinedUser.score = _score;
                                            joinedUser.status == 'recently joined'
                                                ? (joinedUser.status = 'playing')
                                                : '';
                                            this.players[_index] = joinedUser;
                                            io.sockets.emit('update_user', this.players);
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
            });
            socket.on('disconnect', () => {
                this.players = this.players.filter((u) => u._id != joinedUser._id);
                io.sockets.emit('update_user', this.players);
            });
        });
    }
    increaseNumberOfUsersGotScored() {
        this.numOfUsersGotScored++;
    }
    setNumberofUsersGotScoredToZero() {
        this.numOfUsersGotScored = 0;
    }
}
exports.DrawingCompetitionController = DrawingCompetitionController;
//# sourceMappingURL=DrawingCompetitionController.js.map