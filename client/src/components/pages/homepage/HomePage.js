import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Canvas from '../../child/canvas/Canvas';
import { getUser, setTimer, setImageProcessing, invokeScore, setPageToNavigateAfterLogin } from '../../../js/actions';
import Timer from '../../child/timer/Timer';
import HandSide from '../../child/handside/HandSide';
import DrawingModel from '../../child/model/DrawingModel';
import PropTypes from 'prop-types';

class HomePage extends React.Component {
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
			const model = this.props.activeModel.model === "stillLife" ? "geometrical5" : "woman-figure-8";
			axios.post('/send_drawing', { dataURL: dataURL, model: model, canvasWidth: this.props.canvasWidth, canvasHeight: this.props.canvasHeight }).then((response) => {
				let score = response.data.score;
				this.setState({ baseURL: 'data:image/png;base64, ' + response.data.img });
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
		this.props.setPageToNavigateAfterLogin('/competes');
		this.props.history.push('/competes');
	};
	render() {
		let { baseURL, shouldResetCanvas } = this.state;
		let { user } = this.props;
		let side = this.props.leftHand ? 'model_left_hand' : '';
		return (
			<div>
				<div className="croqee-video-section">
					<span className="croqee-video-section__title">This is just a sample video</span>
					<video autoPlay muted loop class="croqee-video-section__video">
						<source src={require("../../../videos/drawing.mp4")} type="video/mp4" />
							Your browser does not support HTML5 video.
                             </video>
				</div>

				<div className={`drawing-environment ${side}`}>
					{this.props.showTimer && <Timer />}
					<DrawingModel side={side} />
					<Canvas
						isInHomePage={true}
						setBaseUrl={this.setBaseUrl}
						shouldResetCanvas={shouldResetCanvas}
						setShouldResetCanvas={this.setShouldResetCanvas}
						canStartDrawing={true}
						baseURL={baseURL}
						navigateToClubPage={this.navigateToClubPage}
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
		activeModel, 
		canvasWidth,
		canvasHeight
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
		activeModel,
		canvasWidth,
		canvasHeight
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
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

HomePage.propTypes = {
};