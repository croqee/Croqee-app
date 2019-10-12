import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Canvas from '../../child/canvas/CanvasPage';
import config from '../../../modules/config';
import { getUser, setTimer, invokeScore, setImageProcessing, setTimerDone } from '../../../js/actions';
import Timer from '../../child/timer/Timer';
import EmptyTimer from '../../child/timer/EmptyTimer';
import HandSide from '../../child/handside/HandSide';
import UserPendingLoader from '../../child/userpendingloader/UserPendingLoader';
import socketIOClient from 'socket.io-client';
import CompeteCanvasPage from '../../child/canvas/CompeteCanvasPage';
import CompetePageUsers from '../../child/competepageusers/CompetePageUsers';
import {socketEndPoint} from '../../../clientglobalvariables'

class CompetePage extends React.Component {
	constructor(props) {
		super(props);
		let socket;
		this.state = {
			existingPlayer: false,
			endpoint:socketEndPoint,
			baseURL: '',
			resetCanvas: false,
			startDrawing: false,
			hasUserDrawnOnCanvas: false,
			playingUsers: [],
			model:{}
		};
	}
	componentDidMount() {
		this.socket = socketIOClient(this.state.endpoint);
		this.socket.emit('username', this.props.user);
		this.socket.on('update_user', (users) => {
			console.log(users);
			this.setState({
				playingUsers: users
			});
		});
		this.socket.on('start_drawing', (model) => {
			this.setState({model:model})
			console.log('start drawing');
			console.log(model);
			this.setState({ startDrawing: true });
			this.props.setTimer({ showTimer: true, timer: model.givenTime/100 });
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
							.toDataURL('image/jpeg', 0.1)
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
	}
	componentWillUnmount() {
		this.socket.close();
	  }
	setResetCanvasToFalse = () => {
		this.setState({
			resetCanvas: false
		});
	};
	setHasUserDrawnOnCanvas = (bool) => {
		this.setState({
			hasUserDrawnOnCanvas: bool
		});
	};
	render() {
		let side = this.props.leftHand ? 'model_left_hand' : '';
		let baseURL = this.state.baseURL;
		let startDrawing = this.state.startDrawing;
		let playingUsers = this.state.playingUsers;
		return (
			<React.Fragment>
				{!startDrawing && (
					<div className="compete-page__wait-for-game">
						{' '}
						<UserPendingLoader caption={'Please wait until the next round begins...'} />
					</div>
				)}
		<CompetePageUsers playingUsers={playingUsers}/>
				{/* <UserPendingLoader caption={"Waiting for users to join the competition. Stay tuned and warm up!"}/> */}
				{this.props.showTimer ? <Timer /> : <EmptyTimer noText={true}/>}
				<span id="userScore" className={'userscore ' + this.props.scoreClass}>
					Score: {this.props.currentScore && this.props.currentScore}
					{baseURL ? (
						<img className="userscore__drawing" src={baseURL} />
					) : (
						<div className="userscore__drawing" />
					)}
					
					{this.state.model.model =="model_1" && <img className="userscore__model" src="./shapes_1.png" />}
					{this.state.model.model =="model_2" && <img className="userscore__model" src="./shapes_2.png" />}
					{this.state.model.model =="model_3" && <img className="userscore__model" src="./shapes_3.png" />}

				</span>
				<div>
					
					
				{this.state.model.model =="model_1" && <img src="./shapes_1.png" className={'modelImg draw_and_model ' + side} />}
				{this.state.model.model =="model_2" && <img src="./shapes_2.png" className={'modelImg draw_and_model ' + side} />}
				{this.state.model.model =="model_3" && <img src="./shapes_3.png" className={'modelImg draw_and_model ' + side} />}

					<div>
						<CompeteCanvasPage
							showGuideLine={false}
							resetCanvas={this.state.resetCanvas}
							setResetCanvasToFalse={this.setResetCanvasToFalse}
							setHasUserDrawnOnCanvas={this.setHasUserDrawnOnCanvas}
						/>
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
