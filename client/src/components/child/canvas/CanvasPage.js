import React from 'react';
import { connect } from 'react-redux';
import { setTimer, invokeScore, setImageProcessing, setTimerDone } from '../../../js/actions';
import Loader from '../loader/Loader';

const styles = {
	canvas: {
		border: '1px solid #333',
		cursor: 'crosshair'
	},

	maindiv: {
		padding: '10px',
		width: '800px'
	}
};

class CanvasPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			baseURL: null,
			fadeOut: false
		};
	}

	componentDidMount() {
		this.reset();
	}
	componentDidUpdate(prevProps, prevStates) {
		if (prevProps.shouldResetCanvas !== this.props.shouldResetCanvas) {
			if (this.props.shouldResetCanvas) {
				this.reset();
				this.props.setShouldResetCanvas(false);
			}
		}
	}

	drawing(e) {
		//if the pen is down in the canvas, draw/erase

		if (this.state.pen === 'down') {
			if (this.props.timerDone) {
				if (this.props.isInHomePage) {
					this.props.setTimer({ showTimer: true, timer: 30 });
					this.props.setTimerDone(false);
				} else {
					this.props.setHasUserDrawnOnCanvas(true);
				}
				this.setState({
					fadeOut: true
				});
			}

			this.ctx.beginPath();
			this.ctx.lineWidth = this.state.lineWidth;
			this.ctx.lineCap = 'round';

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

	render() {
		const { fadeOut } = this.state;
		let side = this.props.leftHand ? 'canvas_left_hand' : '';
		return (
			<React.Fragment>
				<div className={'canvas ' + side} style={styles.maindiv}>
					{this.props.imageProcessing && <Loader />}
					<span
						className={
							fadeOut ? (
								'canvas__draw-here canvas__draw-here--fadeout'
							) : (
								'canvas__draw-here canvas__draw-here--fadein '
							)
						}
					>
						Draw the model here
					</span>
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
						onTouchMove={(e) => this.drawing(e)}
						onTouchStart={(e) => this.drawing(e)}
						onTouchEnd={(e) => this.penUp(e)}
					/>
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => {
	const { timer, showTimer, timerDone, imageProcessing, leftHand, startImageProcessing } = state;
	return { timer, showTimer, timerDone, imageProcessing, leftHand, startImageProcessing };
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
