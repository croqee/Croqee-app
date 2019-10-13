import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Canvas from '../../child/canvas/CanvasPage';
import CanvasPage from '../../child/canvas/CanvasPage';
import config from '../../../modules/config';
import { getUser, setTimer, setImageProcessing, invokeScore } from '../../../js/actions';
import Timer from '../../child/timer/Timer';
import EmptyTimer from '../../child/timer/EmptyTimer';
import HandSide from '../../child/handside/HandSide';

class PrototypePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			baseURL: '',
			shouldResetCanvas: false
		};
	}
	componentDidMount() {
		this.props.getUser();
	}
	sendDrawing() {
		var canvas = document.getElementById('canvas__drawing');

		if (canvas) {
			this.props.setImageProcessing(true);
			var dataURL = canvas.toDataURL('image/jpeg', 0.1).replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
			this.props.setTimer({ showTimer: false, timer: 30 });
			axios.post('/send_drawing', { dataURL: dataURL }).then((response) => {
				let score = response.data.score;
				this.setState({ baseURL: 'data:image/png;base64, ' + response.data.img });
				// this.props.setBaseUrl('data:image/png;base64, ' + response.data.img);
				score = score || 0;
				this.props.setImageProcessing(false);
				this.props.invokeScore(score);
				this.setShouldResetCanvas(true);
			});
		}
	}

	componentDidUpdate(prevProps, prevStates) {
		if (prevProps.startImageProcessing !== this.props.startImageProcessing) {
			if (this.props.startImageProcessing) {
				this.sendDrawing();
			}
		}
	}
	setBaseUrl = (baseURL) => {
		this.setState({ baseURL: baseURL });
	};
	setShouldResetCanvas = (bool) => {
		this.setState({
			shouldResetCanvas: bool
		});
	};
	render() {
		let { baseURL, shouldResetCanvas } = this.state;
		let { user } = this.props;
		let side = this.props.leftHand ? 'model_left_hand' : '';
		return (
			<React.Fragment>
				{this.props.showTimer ? <Timer /> : <EmptyTimer />}
				<span id="userScore" className={'userscore ' + this.props.scoreClass}>
					Score: {this.props.currentScore && this.props.currentScore}
					{baseURL && <img className="userscore__drawing" src={baseURL} />}
					<img className="userscore__model" src="./shapes_1.png" />
				</span>
				<div>
					<img src="./shapes_1.png" className={'modelImg draw_and_model ' + side} />
					<div>
						<CanvasPage
							isInHomePage={true}
							setBaseUrl={this.setBaseUrl}
							shouldResetCanvas={shouldResetCanvas}
							setShouldResetCanvas={this.setShouldResetCanvas}
						/>
					</div>
					<HandSide />
				</div>
				<div id="home_bottom">
					<img id="home_bottom_triangle" src="/triangle.png" />
					<button onClick={() => this.props.history.push('/clubs')} id="home_bottom_button">
						Compete with others
					</button>
				</div>
			</React.Fragment>
		);
	}
}
const mapStateToProps = (state) => {
	const { events, user, showTimer, scoreClass, currentScore, leftHand, timerDone, startImageProcessing } = state;
	return { events, user, showTimer, scoreClass, currentScore, leftHand, timerDone, startImageProcessing };
};
const mapDispatchToProps = (dispatch) => {
	return {
		getUser: () => dispatch(getUser()),
		setTimer: (payload) => dispatch(setTimer(payload)),
		setImageProcessing: (payload) => dispatch(setImageProcessing(payload)),
		invokeScore: (payload) => dispatch(invokeScore(payload))
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(PrototypePage);
