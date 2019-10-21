import React from 'react';
import { connect } from 'react-redux';
import { setTimer, invokeScore, setImageProcessing, setTimerDone } from '../../../js/actions';
import Loader from '../loader/Loader';

const styles = {
	canvas: {
		border: '1px solid #333',
		cursor: 'crosshair'
	}
};

class CanvasPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			baseURL: null,
			fadeOut: false,
			isSizeSet: false,
			width: null,
			height: null
		};
		window.addEventListener('resize', () => {
			this.setCanvasSize();
		});
	}

	componentDidMount() {
		this.setCanvasSize();
	}
	componentDidUpdate(prevProps, prevStates) {
		if (prevProps.shouldResetCanvas !== this.props.shouldResetCanvas) {
			if (this.props.shouldResetCanvas) {
				this.reset();
				this.props.setShouldResetCanvas(false);
			}
		}
	}
	setCanvasSize() {
		let screenSize = this.getWidth();
		console.log(screenSize);
		this.setState({ isSizeSet: false }, () => {
			if (screenSize > 1700) {
				this.setState(
					{
						width: 800,
						height: 600,
						isSizeSet: true
					},
					() => {
						this.reset();
					}
				);
			} else if (screenSize > 1660) {
				this.setState(
					{
						width: 780,
						height: 585,
						isSizeSet: true
					},
					() => {
						this.reset();
					}
				);
			} else if (screenSize > 1620) {
				this.setState(
					{
						width: 760,
						height: 570,
						isSizeSet: true
					},
					() => {
						this.reset();
					}
				);
			} else if (screenSize > 1580) {
				this.setState(
					{
						width: 740,
						height: 555,
						isSizeSet: true
					},
					() => {
						this.reset();
					}
				);
			} else if (screenSize > 1540) {
				this.setState(
					{
						width: 720,
						height: 540,
						isSizeSet: true
					},
					() => {
						this.reset();
					}
				);
			} else if (screenSize > 1500) {
				this.setState(
					{
						width: 700,
						height: 525,
						isSizeSet: true
					},
					() => {
						this.reset();
					}
				);
			} else if (screenSize > 1450) {
				this.setState(
					{
						width: 680,
						height: 510,
						isSizeSet: true
					},
					() => {
						this.reset();
					}
				);
			} else if (screenSize > 1400) {
				this.setState(
					{
						width: 660,
						height: 495,
						isSizeSet: true
					},
					() => {
						this.reset();
					}
				);
			} else if (screenSize > 1365) {
				this.setState(
					{
						width: 640,
						height: 480,
						isSizeSet: true
					},
					() => {
						this.reset();
					}
				);
			} else {
				this.setState(
					{
						width: 600,
						height: 450,
						isSizeSet: true
					},
					() => {
						this.reset();
					}
				);
			}
		});
	}
	getWidth() {
		return Math.max(
			document.body.scrollWidth,
			document.documentElement.scrollWidth,
			document.body.offsetWidth,
			document.documentElement.offsetWidth,
			document.documentElement.clientWidth
		);
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
			this.ctx.fillRect(0, 0, this.state.width, this.state.height);
			// this.ctx.lineWidth = 10;
		}
	}

	render() {
		const { fadeOut, width, height, isSizeSet } = this.state;
		let side = this.props.leftHand ? 'canvas_left_hand' : '';
		console.log(width);
		return (
			<React.Fragment>
				{isSizeSet && (
					<div className={'canvas ' + side} width={`${width}px`} height={`${height}px`}>
						{this.props.imageProcessing && <Loader />}

						<div
							className="canvas__overay"
							className={
								fadeOut ? (
									'canvas__overay canvas__overay--fadeout'
								) : (
									'canvas__overay canvas__overay--fadein '
								)
							}
							style={{
								width: `${width}px`,
								height: `${height}px`,
								marginBottom: `-${height}px`
							}}
						>
							<span
								className="canvas__overay__homepage-text"
								style={{
									top: `${height / 2 - 40}px`
								}}
							>
								Draw the model here
							</span>
						</div>

						<canvas
							id="canvas__drawing"
							className="canvas__canvas"
							ref="canvas"
							width={`${width}px`}
							height={`${height}px`}
							style={styles.canvas}
							onMouseMove={(e) => this.drawing(e)}
							onMouseDown={(e) => this.penDown(e)}
							onMouseUp={(e) => this.penUp(e)}
							onTouchMove={(e) => this.drawing(e)}
							onTouchStart={(e) => this.drawing(e)}
							onTouchEnd={(e) => this.penUp(e)}
						/>
					</div>
				)}
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
