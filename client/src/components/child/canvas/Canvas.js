import React from 'react';
import { connect } from 'react-redux';
import { setTimer, invokeScore, setImageProcessing, setTimerDone, setActiveModel } from '../../../js/actions';
import Loader from '../loader/Loader';

let styles = {
	canvas: {
		cursor: 'crosshair'
	}
};

class Canvas extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			baseURL: null,
			fadeOut: false,
			isSizeSet: false,
			width: null,
			height: null,
			countDown: 7,
			competeTextHideClass: '',
			moveStartTextClass: '',
		};
		window.addEventListener('resize', () => {
			this.setCanvasSize();
		});
	}

	componentDidMount() {
		this.setCanvasSize();
	}
	componentDidUpdate(prevProps) {
		if (prevProps.shouldResetCanvas !== this.props.shouldResetCanvas) {
			if (this.props.shouldResetCanvas) {
				this.reset();
				this.props.setShouldResetCanvas(false);
			}
		}
		if (prevProps.canStartDrawing != this.props.canStartDrawing) {
			this.setState({
				competeTextHideClass: '--hiden-compete-text',
				moveStartTextClass: '--move-compete-start-text'
			});
		}
		if (prevProps.canJoinClub != this.props.canJoinClub) {
			this.startCountDown();
		}
		if (prevProps.leftHand != this.props.leftHand) {
			this.setCanvasSize();
		}
	}
	startCountDown() {
		if (this.state.countDown > 1) {
			setTimeout(() => {
				this.setState({ countDown: --this.state.countDown });
				this.startCountDown();
			}, 1000);
		} else {
			return false;
		}
	}
	setCanvasSize() {
		const screenSize = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		let width;
		let height;
		if (screenSize > 1850) {
			const margin = Math.floor((screenSize - 1800) / 3) - 2;
			width = 900;
			height = 675;
			// if (this.props.leftHand) {
			// 	styles.canvas = {
			// 		...styles.canvas,
			// 		marginRight: 0
			// 	};
			// } else {
			// 	styles.canvas = {
			// 		...styles.canvas,
			// 		marginLeft: 0
			// 	};
			// }
		} else {
			width = Math.floor(screenSize / 2 - 9);
			height = Math.floor(width / 800 * 600);
			styles.canvas = {
				...styles.canvas,
				marginRight: '0'
			};
		}
		console.log(screenSize);
		this.setState({ isSizeSet: false }, () => {
			this.setState(
				{
					width: width,
					height: height,
					isSizeSet: true
				},
				() => {
					this.reset();
				}
			);
		});
	}

	drawing(e) {
		//if the pen is down in the canvas, draw/erase

		if (this.state.pen === 'down' && this.props.canStartDrawing) {
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
		let lineWidth = 1.7 * this.state.width / 800;
		this.setState({
			mode: 'draw',
			pen: 'up',
			lineWidth: lineWidth,
			penColor: 'black'
		});
		if (this.refs.canvas) {
			this.ctx = this.refs.canvas.getContext('2d');
			this.ctx.fillStyle = 'white';
			this.ctx.fillRect(0, 0, this.state.width, this.state.height);
			// this.ctx.lineWidth = 10;
		}
	}
	retryDrawing() {
		this.props.setActiveModel({
			...this.props.activeModel,
			isDrawn: false
		});
	}
	render() {
		const { fadeOut, width, height, isSizeSet, countDown, competeTextHideClass, moveStartTextClass } = this.state;
		const { isCompeting } = this.props;
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
							{!isCompeting && (
								<span
									className="canvas__overay__homepage-text"
									style={{
										top: `${height / 2 - 40}px`
									}}
								>
									Draw the model here
								</span>
							)}
							{isCompeting && (
								<div
									className="canvas__overay__compete-text"
									style={{
										top: `${height / 2 - 40}px`
									}}
								>
									<div className="canvas__overay__compete-text__first-line">
										<span
											className={
												'canvas__overay__compete-text__first-line__start ' + moveStartTextClass
											}
										>
											Start
										</span>
										<span
											className={
												'canvas__overay__compete-text__first-line__text ' + competeTextHideClass
											}
										>
											{' '}
											drawing the model
										</span>
									</div>
									<div className={'canvas__overay__compete-text__second-line '}>
										<span
											className={
												'canvas__overay__compete-text__second-line__text ' +
												competeTextHideClass
											}
										>
											here in{' '}
										</span>
										<span
											className={
												'canvas__overay__compete-text__second-line__text --counter ' +
												competeTextHideClass
											}
										>
											{countDown}
										</span>
										<span
											className={
												'canvas__overay__compete-text__second-line__text ' +
												competeTextHideClass
											}
										>
											{' '}
											seconds
										</span>
									</div>
								</div>
							)}
						</div>
						{this.props.activeModel.isDrawn && !isCompeting && (
							<div
								className={
									!this.props.activeModel.isDrawn ? (
										'canvas__blocker canvas__blocker--fadeout'
									) : (
										'canvas__blocker canvas__blocker--fadein '
									)
								}
								style={{
									width: `${width}px`,
									height: `${height}px`,
									marginBottom: `-${height}px`,
									paddingTop: `${height / 2 - 100}px`
								}}
							>
								<button
									onClick={() => this.props.navigateToClubPage()}
									className="canvas__blocker__compete-button"
								>
									Draw more models and compete
								</button>

								<h3> OR </h3>

								<button onClick={() => this.retryDrawing()} className="canvas__blocker__retry-button">
									Retry
								</button>
							</div>
						)}
						<span
							id="userScore"
							className={'userscore ' + this.props.scoreClass}
							style={{
								width: `${width}px`,
								height: `${height}px`,
								marginBottom: `-${height}px`
							}}
						>
							{this.props.baseURL ? (
								<React.Fragment>
									<img
										className="userscore__drawing"
										style={{
											width: `${width}px`,
											height: `${height}px`,
											marginBottom: `-${height}px`
										}}
										src={this.props.baseURL}
									/>

									{this.props.isInHomePage ? this.props.activeModel.model === 'stillLife' ? (
										<img
											className="userscore__model"
											style={{
												width: `${width}px`,
												height: `${height}px`
											}}
											src="./still-life-models/geometrical5.png"
										/>
									) : (
										<img
											className="userscore__model"
											style={{
												width: `${width}px`,
												height: `${height}px`
											}}
											src="./still-life-models/geometrical3.png"
										/>
									) : (
										<React.Fragment>
											{this.props.model.model && (
												<img
													className="userscore__model"
													style={{
														width: `${width}px`,
														height: `${height}px`
													}}
													src={`./still-life-models/${this.props.model.model}.png`}
												/>
											)}
										</React.Fragment>
									)}
									<span className="userscore_score">
										Score:<span className="userscore_score_score">
											{' '}
											{this.props.currentScore && this.props.currentScore}
										</span>
									</span>
								</React.Fragment>
							) : (
								<span
									style={{
										position: 'absolute',
										width: '400px',
										textAlign: 'center',
										top: `${height / 2 - 50}px`,
										left: `${width / 2 - 200}px`,
										color: 'white',
										fontSize: '28px'
									}}
								>
									Nothing was drawn on the canvas
								</span>
							)}
						</span>

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
							onTouchMove={(e) => {
								e.preventDefault();
								this.drawing(e);
							}}
							onTouchStart={(e) => {
								e.preventDefault();
								this.penDown(e);
							}}
							onTouchEnd={(e) => {
								e.preventDefault();
								this.penUp(e);
							}}
						/>
					</div>
				)}
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => {
	const {
		timer,
		showTimer,
		timerDone,
		imageProcessing,
		currentScore,
		scoreClass,
		leftHand,
		startImageProcessing,
		activeModel
	} = state;
	return {
		timer,
		showTimer,
		timerDone,
		imageProcessing,
		currentScore,
		scoreClass,
		leftHand,
		startImageProcessing,
		activeModel
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		setTimer: (payload) => dispatch(setTimer(payload)),
		invokeScore: (payload) => dispatch(invokeScore(payload)),
		setImageProcessing: (payload) => dispatch(setImageProcessing(payload)),
		setTimerDone: (payload) => dispatch(setTimerDone(payload)),
		setActiveModel: (payload) => dispatch(setActiveModel(payload))
		};
};
export default connect(mapStateToProps, mapDispatchToProps)(Canvas);
