import { Server } from 'http';
import { User } from '../../db/models/user';
import * as ScoreRepo from '../../db/repositories/score-repo';
import { getIdFromToken } from '../../lib/jwt';
import { anatomyModels } from './anatomy-models';
import { CompetitionController } from './competition-controller';
import { IJoinedUser, IModel } from './interfaces';
import { stillLifeModels } from './still-life-models';

type CalculateScore = (
  param: { dataURL: string; model: string },
  cb: (res: string) => void,
) => void;
export class DrawingCompetitionController extends CompetitionController {
  drawingField: string;
  protected players: IJoinedUser[] = [];
  protected models: IModel[] = [];
  protected lastDrawnModel: string;
  protected round: number;
  protected isBeginProcessed: boolean;
  protected isBeginCallbackSent: boolean;
  protected hasToBeResetAsUsersLeave: boolean;
  protected numOfUsersGotScored: number;

  constructor(
    server: Server,
    calculateScore: CalculateScore,
    drawingField: string,
  ) {
    super(server, drawingField);
    this.reset();
    this.trackEachUser(calculateScore);
  }

  reset(): void {
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
  private stillLifeLastUpdateTime: number;
  private getNumberOfPlayingUsers(users: Array<IJoinedUser>) {
    return users.filter((u) => u.status === 'playing').length;
  }

  loop(): void {
    if (this.players.length != 0) {
      this.hasToBeResetAsUsersLeave = true;

      if (this.isBeginProcessed) {
        const currentTime = new Date().getTime();
        let timeDifference = currentTime - this.stillLifeLastUpdateTime;
        timeDifference = Math.round(timeDifference / 1000);
        if (this.models[this.round - 1].givenTime <= timeDifference) {
          this.isBeginProcessed = false;
          this.io.sockets.emit('send_your_drawing');
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
            this.io.sockets.emit('join_club', this.models[this.round - 1]);
            this.players = this.players
              ? this.players.sort((a: IJoinedUser, b: IJoinedUser) => {
                  return b.score - a.score;
                })
              : [];
            setTimeout(() => {
              if (!this.isBeginProcessed) {
                this.io.sockets.emit('users_score', this.players);
              }
            }, 2500);
            setTimeout(() => {
              if (!this.isBeginProcessed) {
                this.io.sockets.emit(
                  'start_drawing',
                  this.models[this.round - 1],
                );
                this.isBeginCallbackSent = false;
                this.isBeginProcessed = true;
                this.setNumberofUsersGotScoredToZero();
                this.stillLifeLastUpdateTime = Date.now();
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

  private trackEachUser(calculateScore: CalculateScore) {
    this.io.on('connection', (socket) => {
      let joinedUser: IJoinedUser;

      socket.on('username', async (token: string) => {
        const userId = await getIdFromToken(token);

        const user = await User.findById(userId);
        const userIsNotAlreadyJoined = this.players.every(
          (u) => u._id != user._id,
        );

        if (!userIsNotAlreadyJoined) return;

        joinedUser = {
          _id: user._id,
          name: user.name,
          score: 0,
          status: 'recently joined',
        };
        this.players.push(joinedUser);
        this.io.sockets.emit('update_user', this.players);

        //Invoking my_drawing after the user is verified
        socket.on('my_drawing', (dataURL: string) => {
          let score = 0;
          if (dataURL != null) {
            const param = {
              dataURL,
              model: this.lastDrawnModel,
            };
            calculateScore(param, async (res) => {
              const result = JSON.parse(res);
              score = Math.floor(result.score);
              socket.emit('evaluated_score', {
                img: result.img,
                score,
              });
              this.increaseNumberOfUsersGotScored();

              const index = this.findWithAttr(
                this.players,
                '_id',
                joinedUser._id,
              );
              joinedUser.score = score;
              joinedUser.status == 'recently joined'
                ? (joinedUser.status = 'playing')
                : '';

              this.players[index] = joinedUser;
              this.io.sockets.emit('update_user', this.players);
              await ScoreRepo.updateUserScore(
                joinedUser._id,
                this.models[this.round - 1].model,
                score,
              );
            });
          } else {
            socket.emit('evaluated_score', {
              img: null,
              score,
            });
            this.increaseNumberOfUsersGotScored();

            const index = this.findWithAttr(
              this.players,
              '_id',
              joinedUser._id,
            );
            joinedUser.score = score;
            joinedUser.status == 'recently joined'
              ? (joinedUser.status = 'playing')
              : '';
            this.players[index] = joinedUser;
            this.io.sockets.emit('update_user', this.players);
          }
        });
      });

      socket.on('disconnect', () => {
        this.players = this.players.filter(
          (u: IJoinedUser) => u._id != joinedUser._id,
        );
        this.io.sockets.emit('update_user', this.players);
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
