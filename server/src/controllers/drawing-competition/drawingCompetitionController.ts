const jwt = require("jsonwebtoken");
import config from "../../config";
import { iJoinedUser, iModel } from "./interfaces";
import { stillLifeModels } from "./stillLifeModels";
import { anatomyModels } from "./anatomyModels";
import { CompetitionController } from "./CompetitionController";
import {
  getRound,
  setRound,
  increamentRound,
  setPlayer,
  getPlayer,
  setLastDrawnModel,
  getLastDrawnModel,
} from "./gameStateRepositories";

require("../../db/models").connect(config.dbUri);
const User = require("mongoose").model("User");
const ScoreRepo = require("../../db/repositories/scoreRepo");

export class DrawingCompetitionController extends CompetitionController {
  drawingField: string;
  // protected players: iJoinedUser[] = [];
  protected models: iModel[] = [];
  //protected lastDrawnModel: string;
  //protected round: number;
  protected isBeginProcessed: boolean;
  protected isBeginCallbackSent: boolean;
  protected hasToBeResetAsUsersLeave: boolean;
  protected numOfUsersGotScored: number;

  constructor(
    socketIO: any,
    server: any,
    calculateScore: any,
    drawingField: string
  ) {
    super(socketIO, server, drawingField);
    this.reset();
    this.trackEachUser(this.io, calculateScore);
  }

  reset() {
    if (this.drawingField === "still-life") {
      this.models = stillLifeModels;
    } else if (this.drawingField === "anatomy") {
      this.models = anatomyModels;
    }
    setRound(1, this.drawingField);
    this.isBeginProcessed = false;
    this.isBeginCallbackSent = false;
    this.hasToBeResetAsUsersLeave = false;
    this.numOfUsersGotScored = 0;
  }
  private stillLifeLastUpdateTime: any;
  private getNumberOfPlayingUsers(users: Array<iJoinedUser>) {
    return users.filter((u) => u.status === "playing").length;
  }

  async loop(io: any) {
    let players: any = await getPlayer(this.drawingField);
    if (players && players.length !== 0) {
      !this.hasToBeResetAsUsersLeave
        ? (this.hasToBeResetAsUsersLeave = true)
        : "";
      if (this.isBeginProcessed) {
        var currentTime = new Date().getTime();
        var timeDifference = currentTime - this.stillLifeLastUpdateTime;
        timeDifference = Math.round(timeDifference / 1000);
        let round: any = await getRound(this.drawingField);

        if (this.models[round - 1].givenTime <= timeDifference) {
          this.isBeginProcessed = false;
          io.sockets.emit("send_your_drawing");
          let lastDrawnModel = this.models[round - 1].model;
          setLastDrawnModel(lastDrawnModel, this.drawingField);
          // this.lastDrawnModel = this.models[round - 1].model;
          round = await increamentRound(this.drawingField);

          if (round > this.models.length) {
            setRound(1, this.drawingField);
          }
        }
      } else {
        if (
          this.numOfUsersGotScored >= this.getNumberOfPlayingUsers(players) ||
          players.length == 1
        ) {
          if (!this.isBeginCallbackSent) {
            this.isBeginCallbackSent = true;
            const round: any = await getRound(this.drawingField);
            io.sockets.emit("join_club", this.models[round - 1]);

            players = players
              ? players.sort((a: iJoinedUser, b: iJoinedUser) => {
                  return b.score - a.score;
                })
              : [];

            //we might have to sync it
            setPlayer(players, this.drawingField);

            setTimeout(() => {
              if (!this.isBeginProcessed) {
                io.sockets.emit("users_score", players);
              }
            }, 2500);
            setTimeout(async () => {
              if (!this.isBeginProcessed) {
                const round: any = await getRound(this.drawingField);
                io.sockets.emit("start_drawing", this.models[round - 1]);
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
    io.on("connection", (socket: any) => {
      let joinedUser: iJoinedUser;
      // setPlayer([], this.drawingField);
      socket.on("username", (token: string) => {
        jwt.verify(token, config.jwtSecret, (err: any, decoded: any) => {
          if (!err) {
            let userId = "";
            if (typeof decoded.sub === "string") {
              userId = decoded.sub;
            } else {
              userId = decoded;
            }

            return User.findById(userId, async (userErr: any, user: any) => {
              if (!userErr && user) {
                let players: any = await getPlayer(this.drawingField);

                let userIsNotAlreadyJoined =
                  players.filter((u: iJoinedUser) => u._id == user._id)
                    .length == 0;

                if (userIsNotAlreadyJoined) {
                  joinedUser = {
                    _id: user._id,
                    name: user.name,
                    status: "recently joined",
                    score: 0,
                  };
                  players.push(joinedUser);

                  setPlayer(players, this.drawingField);
                  io.sockets.emit("update_user", players);

                  //Invoking my_drawing after the user is verified
                  socket.on("my_drawing", async (dataURL: string) => {
                    let _score: number = 0;
                    let lastDrawnModel: any = await getLastDrawnModel(
                      this.drawingField
                    );
                    console.log(lastDrawnModel);
                    console.log("lastDrawnModel");

                    if (dataURL != null) {
                      let param = {
                        dataURL: dataURL,
                        model: lastDrawnModel,
                      };
                      calculateScore(param, async (_res: any) => {
                        const result = JSON.parse(_res);
                        _score = Math.floor(result.score);
                        socket.emit("evaluated_score", {
                          score: _score,
                          img: result.img,
                        });
                        this.increaseNumberOfUsersGotScored();
                        let players: any = await getPlayer(this.drawingField);
                        let _index = this.findWithAttr(
                          players,
                          "_id",
                          joinedUser._id
                        );
                        joinedUser.score = _score;
                        joinedUser.status == "recently joined"
                          ? (joinedUser.status = "playing")
                          : "";

                        players[_index] = joinedUser;
                        setPlayer(players, this.drawingField);
                        io.sockets.emit("update_user", players);
                        const round: any = await getRound(this.drawingField);
                        ScoreRepo.updateUserScore(
                          joinedUser._id,
                          this.models[round - 1].model,
                          _score
                        );
                      });
                    } else {
                      socket.emit("evaluated_score", {
                        score: _score,
                        img: null,
                      });
                      this.increaseNumberOfUsersGotScored();
                      let players: any = await getPlayer(this.drawingField);
                      console.log("line 202");
                      console.log(players);
                      let _index = this.findWithAttr(
                        players,
                        "_id",
                        joinedUser._id
                      );
                      joinedUser.score = _score;
                      joinedUser.status == "recently joined"
                        ? (joinedUser.status = "playing")
                        : "";
                      players[_index] = joinedUser;
                      setPlayer(players, this.drawingField);
                      io.sockets.emit("update_user", players);
                    }
                  });
                }
              }
            });
          }
        });
      });

      socket.on("disconnect", async () => {
        let players: any = await getPlayer(this.drawingField);
        console.log("players on disconnect before ");
        console.log(players);

        players = players.filter((u: iJoinedUser) => u._id != joinedUser._id);
        console.log("players on disconnect after");
        console.log(players);
        setPlayer(players, this.drawingField);
        const _players = await getPlayer(this.drawingField);

        console.log("players on redis", _players);
        io.sockets.emit("update_user", players);
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
