import React from 'react';
import { connect } from 'react-redux';
import { getUser, setTimer, invokeScore, setImageProcessing, setTimerDone } from '../../../js/actions';
import Timer from '../../child/timer/Timer';
import HandSide from '../../child/handside/HandSide';
import UserPendingLoader from '../../child/userpendingloader/UserPendingLoader';
import socketIOClient from 'socket.io-client';
import { socketEndPoint } from '../../../clientglobalvariables';
import Auth from '../../../modules/Auth';
import Canvas from '../../child/canvas/Canvas';
import DrawingModel from '../../child/model/DrawingModel';

class CompetePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			existingPlayer: false,
			endpoint: socketEndPoint,
			baseURL: '',
			resetCanvas: false,
			startDrawing: false,
			canJoinClub: false,
			hasUserDrawnOnCanvas: false,
			playingUsers: [],
			model: {},
			canStartDrawing: false,
			hasJoined: false,
			showUserScores: false,
			isFirstTimePlaying: true,
			drawingField: this.props.history.location.pathname[this.props.history.location.pathname.length - 1] === "/" ? this.props.history.location.pathname : this.props.history.location.pathname + '/'
		};
	}
	componentDidMount() {
		console.log(this.props.history)
		this.socket = socketIOClient(this.state.endpoint, { path: `${this.state.drawingField}/socket.io` });
		const token = Auth.getToken();
		this.socket.emit('username', token);
		this.socket.on('update_user', (users) => {
			console.log(users);
			this.setState({
				playingUsers: users
			});
		});
		this.socket.on('join_club', (model) => {
			console.log("should join")
			if (!this.state.hasJoined) {
				this.setState({
					canJoinClub: true,
					hasJoined: true,
					model: model
				});
			}
		});

		this.socket.on('start_drawing', (model) => {
			if (this.state.hasJoined) {
				this.setState({ model: model });
				console.log('start drawing');
				console.log(model);
				this.setState({
					startDrawing: true,
					showUserScores: false,
				});
				this.props.setTimer({ showTimer: true, timer: model.givenTime });
			}
		});
		this.socket.on('send_your_drawing', () => {
			if (this.state.startDrawing) {
				let canvas = document.getElementById('canvas__drawing');
				if (canvas) {
					this.props.setImageProcessing(true);
					this.props.setTimer({ showTimer: false, timer: 0 });
					let dataURL = null;
					if (this.state.hasUserDrawnOnCanvas) {
						dataURL = canvas
							.toDataURL('image/jpeg', 0.8)
							.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
					}
					this.socket.emit('my_drawing', dataURL);
				}
			}
		});
		this.socket.on('evaluated_score', (scoreDetails) => {
			if (this.state.startDrawing) {
				console.log(scoreDetails.score);
				this.props.setImageProcessing(false);

				this.setState(
					{
						baseURL: scoreDetails.img != null ? 'data:image/png;base64, ' + scoreDetails.img : null,
						resetCanvas: true
					},
					() => {
						this.props.invokeScore(scoreDetails.score);
						this.setHasUserDrawnOnCanvas(false);
					}
				);
				//this.reset();
			}
		});

		this.socket.on('users_score', (stillLifePlayers) => {
			if (!this.state.isFirstTimePlaying) {
				this.setState({
					showUserScores: true,
					playingUsers: stillLifePlayers
				});
			} else {
				this.setState({
					isFirstTimePlaying: false
				})
			}
		});
	}
	componentWillUnmount() {
		this.socket.close();
		this.props.setTimer({ showTimer: false, timer: 0 });
		this.props.setTimerDone(true);
	}
	setShouldResetCanvas = (bool) => {
		this.setState({
			resetCanvas: bool
		});
	};
	setHasUserDrawnOnCanvas = (bool) => {
		this.setState({
			hasUserDrawnOnCanvas: bool
		});
	};
	render() {
		const side = this.props.leftHand ? 'model_left_hand' : '';
		const { baseURL, playingUsers, startDrawing, canJoinClub, showUserScores } = this.state;
		return (
			<React.Fragment>
				{!canJoinClub && (
					<div className="compete-page__wait-for-game">
						<UserPendingLoader caption={'Please wait until the next round begins...'} />
					</div>
				)}
				<div>
					<br />
					<div className={`drawing-environment ${side}`}>
						{this.props.showTimer && <Timer />}
						<DrawingModel
							model={this.state.model}
							side={side}
							compete={true}
							playingUsers={playingUsers}
							showUserScores={showUserScores}
							user={this.props.user}
							imgPath={this.state.drawingField} />
						<Canvas
							shouldResetCanvas={this.state.resetCanvas}
							setShouldResetCanvas={this.setShouldResetCanvas}
							setHasUserDrawnOnCanvas={this.setHasUserDrawnOnCanvas}
							canStartDrawing={startDrawing}
							canJoinClub={canJoinClub}
							isCompeting={true}
							baseURL={baseURL}
							model={this.state.model}
							imgPath={this.state.drawingField} />
					</div>
					<HandSide />

				</div>

			</React.Fragment>
		);
	}
}
const mapStateToProps = (state) => {
	const {
		events,
		user,
		showTimer,
		leftHand,
		timer,
		timerDone,
		scoreClass,
		currentScore,
		imageProcessing,
		startImageProcessing
	} = state;
	return {
		events,
		user,
		showTimer,
		leftHand,
		timer,
		timerDone,
		scoreClass,
		currentScore,
		imageProcessing,
		startImageProcessing
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		getUser: () => dispatch(getUser()),
		setTimer: (payload) => dispatch(setTimer(payload)),
		invokeScore: (payload) => dispatch(invokeScore(payload)),
		setImageProcessing: (payload) => dispatch(setImageProcessing(payload)),
		setTimerDone: (payload) => dispatch(setTimerDone(payload))
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(CompetePage);
