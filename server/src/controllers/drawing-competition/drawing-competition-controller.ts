import * as config from '../../config';
import { anatomyModels } from './anatomy-models';
import { CompetitionController } from './competition-controller';
import { iJoinedUser, iModel } from './interfaces';
import { stillLifeModels } from './still-life-models';
import * as jwt from 'jsonwebtoken';

require('../../db/models').connect(config.dbUri);
const User = require('mongoose').model('User');
import ScoreRepo from '../../db/repositories/score-repo';

export class DrawingCompetitionController extends CompetitionController {
  drawingField: string;
  protected players: iJoinedUser[] = [];
  protected models: iModel[] = [];
  protected lastDrawnModel: string;
  protected round: number;
  protected isBeginProcessed: boolean;
  protected isBeginCallbackSent: boolean;
  protected hasToBeResetAsUsersLeave: boolean;
  protected numOfUsersGotScored: number;

  constructor(
    socketIO: any,
    server: any,
    calculateScore: any,
    drawingField: string,
  ) {
    super(socketIO, server, drawingField);
    this.reset();
    this.trackEachUser(this.io, calculateScore);
  }

  reset() {
    if (this.drawingField === 'still-life') {
      this.models = stillLifeModels;
    } else if (this.drawingField === 'anatomy') {
      this.models = anatomyModels;
    }
    this.round = 1;
    this.isBeginProcessed = false;
    this.isBeginCallbackSent = false;
    this.hasToBeResetAsUsersLeave = false;
    this.numOfUsersGotScored = 0;
  }
  private stillLifeLastUpdateTime: any;
  private getNumberOfPlayingUsers(users: Array<iJoinedUser>) {
    return users.filter((u) => u.status === 'playing').length;
  }

  loop(io: any) {
    if (this.players.length != 0) {
      !this.hasToBeResetAsUsersLeave
        ? (this.hasToBeResetAsUsersLeave = true)
        : '';
      if (this.isBeginProcessed) {
        const currentTime = new Date().getTime();
        let timeDifference = currentTime - this.stillLifeLastUpdateTime;
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
      } else {
        if (
          this.numOfUsersGotScored >=
            this.getNumberOfPlayingUsers(this.players) ||
          this.players.length == 1
        ) {
          if (!this.isBeginCallbackSent) {
            this.isBeginCallbackSent = true;
            io.sockets.emit('join_club', this.models[this.round - 1]);
            this.players = this.players
              ? this.players.sort((a: iJoinedUser, b: iJoinedUser) => {
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
    } else if (this.hasToBeResetAsUsersLeave) {
      // reset every thing to defualt
      this.reset();
      this.hasToBeResetAsUsersLeave = false;
    }
  }

  private trackEachUser(io: any, calculateScore: any) {
    io.on('connection', (socket: any) => {
      let joinedUser: iJoinedUser;

      socket.on('username', (token: string) => {
        jwt.verify(token, config.jwtSecret, (err: any, decoded: any) => {
          if (!err) {
            let userId = '';
            if (typeof decoded.sub === 'string') {
              userId = decoded.sub;
            } else {
              userId = decoded;
            }

            return User.findById(userId, (userErr: any, user: any) => {
              if (!userErr && user) {
                const userIsNotAlreadyJoined =
                  this.players.filter((u: iJoinedUser) => u._id == user._id)
                    .length == 0;
                if (userIsNotAlreadyJoined) {
                  joinedUser = {
                    _id: user._id,
                    name: user.name,
                    status: 'recently joined',
                    score: 0,
                  };
                  this.players.push(joinedUser);
                  io.sockets.emit('update_user', this.players);

                  //Invoking my_drawing after the user is verified
                  socket.on('my_drawing', (dataURL: string) => {
                    let _score = 0;
                    if (dataURL != null) {
                      const param = {
                        dataURL,
                        model: this.lastDrawnModel,
                      };
                      calculateScore(param, (_res: any) => {
                        const result = JSON.parse(_res);
                        _score = Math.floor(result.score);
                        socket.emit('evaluated_score', {
                          score: _score,
                          img: result.img,
                        });
                        this.increaseNumberOfUsersGotScored();

                        const _index = this.findWithAttr(
                          this.players,
                          '_id',
                          joinedUser._id,
                        );
                        joinedUser.score = _score;
                        joinedUser.status == 'recently joined'
                          ? (joinedUser.status = 'playing')
                          : '';

                        this.players[_index] = joinedUser;
                        io.sockets.emit('update_user', this.players);
                        ScoreRepo.updateUserScore(
                          joinedUser._id,
                          this.models[this.round - 1].model,
                          _score,
                        );
                      });
                    } else {
                      socket.emit('evaluated_score', {
                        score: _score,
                        img: null,
                      });
                      this.increaseNumberOfUsersGotScored();

                      const _index = this.findWithAttr(
                        this.players,
                        '_id',
                        joinedUser._id,
                      );
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
        this.players = this.players.filter(
          (u: iJoinedUser) => u._id != joinedUser._id,
        );
        io.sockets.emit('update_user', this.players);
      });
    });
  }
  private increaseNumberOfUsersGotScored() {
    this.numOfUsersGotScored++;
  }
  private setNumberofUsersGotScoredToZero() {
    this.numOfUsersGotScored = 0;
  }
}
