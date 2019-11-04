import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Canvas from '../../child/canvas/CanvasPage';
import CanvasPage from '../../child/canvas/CanvasPage';
import config from '../../../modules/config';
import { getUser, setTimer, setImageProcessing, invokeScore, setPageToNavigateAfterLogin} from '../../../js/actions';
import Timer from '../../child/timer/Timer';
import EmptyTimer from '../../child/timer/EmptyTimer';
import HandSide from '../../child/handside/HandSide';
import DrawingModel from '../../child/model/DrawingModel';

class PrototypePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			baseURL: '',
			shouldResetCanvas: false,
		};
	}
	componentDidMount() {
		this.props.getUser();

	}
	sendDrawing() {
		var canvas = document.getElementById('canvas__drawing');

		if (canvas) {
			this.props.setImageProcessing(true);
			var dataURL = canvas.toDataURL('image/jpeg', 0.8).replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
			this.props.setTimer({ showTimer: false, timer: 30 });
			console.log(dataURL);
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
	navigateToClubPage = ()=>{
		this.props.setPageToNavigateAfterLogin('/clubs');
		this.props.history.push('/clubs');
	}
	render() {
		let { baseURL, shouldResetCanvas} = this.state;
		let { user } = this.props;
		let side = this.props.leftHand ? 'model_left_hand' : '';
		return (
			<div>
				{this.props.showTimer ? <Timer /> : <EmptyTimer />}
				{/* <span id="userScore" className={'userscore ' + this.props.scoreClass}>
					Score: {this.props.currentScore && this.props.currentScore}
					{baseURL && <img className="userscore__drawing" src={baseURL} />}
					<img className="userscore__model" src="./still-life-models/geometrical5.png"/>
				</span> */}
				<div className="drawing-environment">
					{/* <img src="./shapes_1.png" className={'modelImg draw_and_model ' + side} /> */}
					<DrawingModel side={side} />
						<CanvasPage
							isInHomePage={true}
							setBaseUrl={this.setBaseUrl}
							shouldResetCanvas={shouldResetCanvas}
							setShouldResetCanvas={this.setShouldResetCanvas}
							canStartDrawing={true}
							baseURL={baseURL}
						/>
					<HandSide />
				</div>
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
	const { events, user, showTimer, scoreClass, currentScore, leftHand, timerDone, startImageProcessing } = state;
	return { events, user, showTimer, scoreClass, currentScore, leftHand, timerDone, startImageProcessing };
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
