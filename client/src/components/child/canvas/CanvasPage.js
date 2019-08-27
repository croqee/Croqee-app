import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { setTimer, invokeScore, setImageProcessing, setTimerDone } from '../../../js/actions';
import Loader from '../loader/Loader';

const styles = {
	canvas: {
		border: '1px solid #333',
		cursor: 'crosshair'
		// position: 'absolute',
		// left: '60px',
		// opacity: .8,
		// marginRight:'50px'
	},

	maindiv: {
		padding: '10px',
		// margin: 'auto 60px auto auto',
		width: '800px'
		// marginRight:'10px'
	},

	button: {
		border: '0px',
		// margin: '1px',
		height: '50px',
		minWidth: '75px'
	},

	colorSwatches: {
		red: { backgroundColor: 'red' },
		orange: { backgroundColor: 'orange' },
		yellow: { backgroundColor: 'yellow' },
		green: { backgroundColor: 'green' },
		blue: { backgroundColor: 'blue' },
		purple: { backgroundColor: 'purple' },
		black: { backgroundColor: 'black' }
	}
};

class CanvasPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		this.reset();
		this.props.setTimer(true);
	}

	draw(e) {
		//response to Draw button click
		this.setState({
			mode: 'draw'
		});
	}

	drawing(e) {
		//if the pen is down in the canvas, draw/erase

		if (this.state.pen === 'down') {
			this.ctx.beginPath();
			this.ctx.lineWidth = this.state.lineWidth;
			this.ctx.lineCap = 'round';

			if (this.state.mode === 'draw') {
				this.ctx.strokeStyle = this.state.penColor;
			}

			if (this.state.mode === 'erase') {
				this.ctx.strokeStyle = '#ffffff';
			}

			this.ctx.moveTo(this.state.penCoords[0], this.state.penCoords[1]); //move to old position
			this.ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY); //draw to new position
			this.ctx.stroke();

			this.setState({
				//save new position
				penCoords: [ e.nativeEvent.offsetX, e.nativeEvent.offsetY ]
			});
		}
	}

	penDown(e) {
		//mouse is down on the canvas
		this.setState({
			pen: 'down',
			penCoords: [ e.nativeEvent.offsetX, e.nativeEvent.offsetY ]
		});
	}

	penUp() {
		//mouse is up on the canvas
		this.setState({
			pen: 'up'
		});
	}

	reset() {
		//clears it to all white, resets state to original
		this.setState({
			mode: 'draw',
			pen: 'up',
			lineWidth: 1.6,
			penColor: 'black'
		});
		if (this.refs.canvas) {
			this.ctx = this.refs.canvas.getContext('2d');
			this.ctx.fillStyle = 'white';
			this.ctx.fillRect(0, 0, 800, 600);
			this.ctx.lineWidth = 10;
		}
	}

	sendDrawing() {
		// var canvas = this.refs.canvas.getContext('2d');
		var canvas = document.getElementById('canvas__drawing');
		console.log(canvas);

		if (canvas) {
			this.props.setImageProcessing(true);
			var dataURL = canvas.toDataURL('image/jpeg', 0.1).replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
			// var dataURL = canvas.toDataURL().replace(/^data:image\/(png|jpg|jpeg);base64,/, '');

			console.log(dataURL);
			this.props.setTimer(false);
			axios.post('/send_drawing', { dataURL: dataURL }).then((response) => {
				// console.log(response);
				let { score } = response.data;
				score = score || 0;

				if (response) {
					this.props.setTimer(true);
					this.props.setTimerDone(false);
				}
				this.props.setImageProcessing(false);
				this.props.invokeScore(score);
				this.reset();
			});
		}
	}
	componentDidUpdate(prevProps, prevStates) {
		if (prevProps.timerDone !== this.props.timerDone) {
			if (this.props.timerDone) {
				this.sendDrawing();
			}
		}
	}

	render() {
		let side = this.props.leftHand ? 'canvas_left_hand' : '';
		return (
			/* We should separate this to another component (Canvas) for modularity reasons. But as we are using but we can't use the'ref' attribute
             in the functional components. We have to figure a way out later
            */
			<React.Fragment>
				<span id="userScore" className={this.props.scoreClass}>
					Score: {this.props.currentScore && this.props.currentScore}
				</span>
				<div className={'canvas ' + side} style={styles.maindiv}>
					{this.props.imageProcessing && <Loader />}
					<span id="drawhere" />

					<canvas
						id="canvas__drawing"
						className="canvas__canvas "
						ref="canvas"
						width="800px"
						height="600px"
						style={styles.canvas}
						onMouseMove={(e) => this.drawing(e)}
						onMouseDown={(e) => this.penDown(e)}
						onMouseUp={(e) => this.penUp(e)}
					/>
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => {
	const { timer, showTimer, timerDone, scoreClass, currentScore, imageProcessing, leftHand } = state;
	return { timer, showTimer, timerDone, scoreClass, currentScore, imageProcessing, leftHand };
};
const mapDispatchToProps = (dispatch) => {
	return {
		setTimer: (payload) => dispatch(setTimer(payload)),
		invokeScore: (payload) => dispatch(invokeScore(payload)),
		setImageProcessing: (payload) => dispatch(setImageProcessing(payload)),
		setTimerDone: (payload) => dispatch(setTimerDone(payload))
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(CanvasPage);
