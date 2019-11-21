const jwt = require('jsonwebtoken');
import config from '../config';
require('../models').connect(config.dbUri);
const User = require('mongoose').model('User');

interface iJoinedUser{
    _id: string,
    name: string,
    status: string,
    score: number
}
interface iModel{
    model:string,
    givenTime:number
}
export class StillLifeClubController {
    
    constructor(io:any, node_client:any) {
        this.resetStillLife();
        this.stillLifeloop(io);
        this.trackEachUser(io, node_client);
    }
  
    
    private stillLifePlayers:iJoinedUser[] = [];
    private stillLifeModels:iModel[] = [];
    private lastStillLifeDrawnModel:string;
    private stillLifeRound:number;
    private isStillLifeBeginProcessed:boolean;
    private isStillLifeBeginCallbackSent:boolean;
    private hasToBeResetAsUsersLeave:boolean;
    private numOfUsersGotScored:number;

    
    private findWithAttr(array:Array<any>, attr:string, value:string) {
        for (var i = 0; i < array.length; i += 1) {
            if (array[i][attr] === value) {
                return i;
            }
        }
        return -1;
    }
    private resetStillLife() {
        this.stillLifeModels = [
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
        this.stillLifeRound = 1;
        this.isStillLifeBeginProcessed = false;
        this.isStillLifeBeginCallbackSent = false;
        this.hasToBeResetAsUsersLeave = false;
        this.numOfUsersGotScored = 0;
    }
    private stillLifeLastUpdateTime:any;
    private getNumberOfPlayingUsers(users:Array<iJoinedUser>){
        return users.filter( u => u.status === 'playing').length;
    }
    
    
    //Still Life game loop
    private stillLifeloop(io:any){
    setInterval(() => {
        if (this.stillLifePlayers.length != 0) {
            !this.hasToBeResetAsUsersLeave ? (this.hasToBeResetAsUsersLeave = true) : '';
            if (this.isStillLifeBeginProcessed) {
                var currentTime = new Date().getTime();
                var timeDifference = currentTime - this.stillLifeLastUpdateTime;
                timeDifference = Math.round(timeDifference / 1000);
                if (this.stillLifeModels[this.stillLifeRound - 1].givenTime <= timeDifference) {
                    this.isStillLifeBeginProcessed = false;
                    io.sockets.emit('send_your_drawing');
                    this.lastStillLifeDrawnModel = this.stillLifeModels[this.stillLifeRound - 1].model;
                    this.stillLifeRound++;
                    if (this.stillLifeRound > this.stillLifeModels.length) {
                        this.stillLifeRound = 1;
                    }
                }
            } else {
            
                if (this.numOfUsersGotScored >= this.getNumberOfPlayingUsers(this.stillLifePlayers)|| this.stillLifePlayers.length == 1) {
                    if (!this.isStillLifeBeginCallbackSent) {
                        this.isStillLifeBeginCallbackSent = true;
                        io.sockets.emit('join_club', this.stillLifeModels[this.stillLifeRound - 1]);
                        this.stillLifePlayers = this.stillLifePlayers
                            ? this.stillLifePlayers.sort((a:iJoinedUser, b:iJoinedUser) => {
                                    return b.score - a.score;
                                })
                            : [];
                        setTimeout(() => {
                            if (!this.isStillLifeBeginProcessed) {
                                io.sockets.emit('users_score', this.stillLifePlayers);
                            }
                        }, 2500);
                        setTimeout(() => {
                            if (!this.isStillLifeBeginProcessed) {
                                io.sockets.emit('start_drawing', this.stillLifeModels[this.stillLifeRound - 1]);
                                this.isStillLifeBeginCallbackSent = false;
                                this.isStillLifeBeginProcessed = true;
                                this.setNumberofUsersGotScoredToZero();
                                this.stillLifeLastUpdateTime = new Date().getTime();
                            }
                        }, 7000);
                    }
                }
            }
        } else if (this.hasToBeResetAsUsersLeave) {
            // reset every thing to defualt
            this.resetStillLife();
            this.hasToBeResetAsUsersLeave = false;
        }
    }, 80);
}
private trackEachUser(io:any, node_client:any){
    const increaseNumberOfUsersGotScored = this.increaseNumberOfUsersGotScored;
    io.on('connection', (socket:any) => {
        let joinedUser: iJoinedUser;
    
        socket.on('username', (token:string) => {
            jwt.verify(token, config.jwtSecret, (err:any, decoded:any) => {
                if (!err) {
                    const userId = decoded.sub;
                    return User.findById(userId, (userErr:any, user:any) => {
                        if (!userErr && user) {
                            let userIsNotAlreadyJoined = this.stillLifePlayers.filter((u:iJoinedUser) => u._id == user._id).length == 0;
                            if (userIsNotAlreadyJoined) {
                                joinedUser = {
                                    _id: user._id,
                                    name: user.name,
                                    status: 'recently joined',
                                    score: 0
                                };
                                this.stillLifePlayers.push(joinedUser);
                                io.sockets.emit('update_user', this.stillLifePlayers);
    
                                //Invoking my_drawing after the user is verified
                                socket.on('my_drawing', (dataURL:string) => {
                                    let _score:number = 0;
                                    if (dataURL != null) {
                                        let param = {
                                            dataURL: dataURL,
                                            model: this.lastStillLifeDrawnModel
                                        };
                                        node_client.invoke('DrawingDistance', param, function(error:any, res2:any, more:any) {
                                            const result = JSON.parse(res2);
                                            _score = Math.floor(result.score);
                                            socket.emit('evaluated_score', { score: _score, img: result.img });
                                            increaseNumberOfUsersGotScored();
    
                                            let _index = this.findWithAttr(this.stillLifePlayers, '_id', joinedUser._id);
                                            joinedUser.score = _score;
                                            joinedUser.status == 'recently joined' ? (joinedUser.status = 'playing') : '';
                                            this.stillLifePlayers[_index] = joinedUser;
                                            io.sockets.emit('update_user', this.stillLifePlayers);
                                        });
                                    } else {
                                        socket.emit('evaluated_score', { score: _score, img: null });
                                        increaseNumberOfUsersGotScored();
    
                                        let _index = this.findWithAttr(this.stillLifePlayers, '_id', joinedUser._id);
                                        joinedUser.score = _score;
                                        joinedUser.status == 'recently joined' ? (joinedUser.status = 'playing') : '';
                                        this.stillLifePlayers[_index] = joinedUser;
                                        io.sockets.emit('update_user', this.stillLifePlayers);
                                    }
                                });
                            }
                        }
                    });
                }
            });
        });
    
        socket.on('disconnect', () => {
            this.stillLifePlayers = this.stillLifePlayers.filter((u:iJoinedUser) => u._id != joinedUser._id);
            io.sockets.emit('update_user', this.stillLifePlayers);
        });
    });
}
private increaseNumberOfUsersGotScored(){
    this.numOfUsersGotScored++;
}
private setNumberofUsersGotScoredToZero(){
    this.numOfUsersGotScored = 0;
}
}