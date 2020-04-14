import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Canvas from '../../child/canvas/Canvas';
import { getUser, setTimer, setImageProcessing, invokeScore, setPageToNavigateAfterLogin } from '../../../js/actions';
import Timer from '../../child/timer/Timer';
import EmptyTimer from '../../child/timer/EmptyTimer';
import HandSide from '../../child/handside/HandSide';
import DrawingModel from '../../child/model/DrawingModel';

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
			const dataURL = canvas.toDataURL('image/jpeg', 0.8).replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
			this.props.setTimer({ showTimer: false, timer: 30 });
			const model = this.props.activeModel.model==="stillLife"?"geometrical5":"geometrical3";
			axios.post('/send_drawing', { dataURL: dataURL, model: model }).then((response) => {
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
	navigateToClubPage = () => {
		this.props.setPageToNavigateAfterLogin('/clubs');
		this.props.history.push('/clubs');
	};
	render() {
		let { baseURL, shouldResetCanvas } = this.state;
		let { user } = this.props;
		let side = this.props.leftHand ? 'model_left_hand' : '';
		return (
			<div>
				<div className="croqee-video-section">
					<span className="croqee-video-section__title">Video goes here</span>
				</div>

				<div className={`drawing-environment ${side}`}>
					{this.props.showTimer && <Timer timerClass='timer--home-page'/>}
					<DrawingModel side={side} />
					<Canvas
						isInHomePage={true}
						setBaseUrl={this.setBaseUrl}
						shouldResetCanvas={shouldResetCanvas}
						setShouldResetCanvas={this.setShouldResetCanvas}
						canStartDrawing={true}
						baseURL={baseURL}
						navigateToClubPage = {this.navigateToClubPage}
					/>
				</div>
				<HandSide />

				<div id="home_bottom">
					<img id="home_bottom_triangle" src="/triangle.png" />
					<button onClick={() => this.navigateToClubPage()} id="home_bottom_button">
						Compete with others
					</button>
				</div>
			</div>
		);
	}
}
const mapStateToProps = (state) => {
	const {
		events,
		user,
		showTimer,
		scoreClass,
		currentScore,
		leftHand,
		timerDone,
		startImageProcessing,
		activeModel
	} = state;
	return {
		events,
		user,
		showTimer,
		scoreClass,
		currentScore,
		leftHand,
		timerDone,
		startImageProcessing,
		activeModel
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		getUser: () => dispatch(getUser()),
		setTimer: (payload) => dispatch(setTimer(payload)),
		setImageProcessing: (payload) => dispatch(setImageProcessing(payload)),
		invokeScore: (payload) => dispatch(invokeScore(payload)),
		setPageToNavigateAfterLogin: (payload) => dispatch(setPageToNavigateAfterLogin(payload))
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(PrototypePage);
