import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setActiveModel } from '../../../js/actions';
import UserScoreOverview from './UserScoreOverview';


let styles = {
	model: {}
};

class DrawingModel extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isSizeSet: false,
			width: null,
			height: null,
			usersScoreFadeClass: ''
		};
		this.modelSelect = React.createRef();

		window.addEventListener('resize', () => {
			this.setModelSize();
		});
		document.addEventListener('scroll', () => this.trackScrolling());
	}

	componentDidMount() {
		this.setModelSize();
	}
	componentDidUpdate(prevProps, prevStates) {
		if (prevProps.showUserScores != this.props.showUserScores) {
			if (this.props.showUserScores) {
				this.setState(
					{
						usersScoreFadeClass: 'users-scores--fadein'
					},
					() => {
						setTimeout(() => {
							this.setState({
								usersScoreFadeClass: 'users-scores--fadeout'
							});
						}, 3500);
					}
				);
			}
		}
		if (prevProps.leftHand !== this.props.leftHand) {
			if (this.props.leftHand) {
				this.setState({
					modelSelectClassRightFloat: 'drawing-model__select--right-float'
				});
			} else {
				this.setState({
					modelSelectClassRightFloat: ''
				});
			}
		}
		if (prevProps.showTimer !== this.props.showTimer) {
			if (this.props.showTimer) {
				if (this.props.leftHand) {
					this.setState({
						modelSelectClass: 'drawing-model__select--right-float--move-right'
					});
				} else {
					this.setState({
						modelSelectClass: 'drawing-model__select--move-left'
					});
				}
			}
		}
		if (prevProps.timerDone !== this.props.timerDone) {
			if (this.props.timerDone) {
				if (this.props.leftHand) {
					this.setState({
						modelSelectClass: 'drawing-model__select--right-float--move-left'
					});
				} else {
					this.setState({
						modelSelectClass: 'drawing-model__select--move-right'
					});
				}
			}
		}
	}
	isBottom(el) {
		return el.getBoundingClientRect().bottom <= window.innerHeight;
	}
	trackScrolling = () => {
		const element = document.getElementsByClassName('drawing-model')[0];

		if (element && this.isBottom(element) && !this.props.leftHand && this.props.timerDone) {
			this.setState({
				modelSelectClass: 'drawing-model__select--move-right'
			});
			document.removeEventListener('scroll', this.trackScrolling);
		}
	};
	setModelSize() {
		const screenSize = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		let width;
		let height;
		if (screenSize > 1850) {
			const margin = Math.floor((screenSize - 1800) / 3) - 2;
			width = 900;
			height = 675;
			if (this.props.leftHand) {
				styles.canvas = {
					...styles.canvas,
					marginRight: margin + 'px',
					marginLeft: 0
				};
			} else {
				styles.canvas = {
					...styles.canvas,
					marginLeft: margin + 'px',
					marginRight: 0
				};
			}
		} else {
			width = Math.floor(screenSize / 2 - 9);
			height = Math.floor(width / 800 * 600);
			styles.model = {
				...styles.model,
				marginLeft: '0'
			};
		}
		this.setState({ isSizeSet: false }, () => {
			this.setState({
				width: width,
				height: height,
				isSizeSet: true
			});
		});
	}
	setModelToStillLife() {
		this.props.setActiveModel({
			model: 'stillLife',
			isDrawn: false
		});
	}
	setModelToAnatomy() {
		this.props.setActiveModel({
			model: 'anatomy',
			isDrawn: false
		});
	}
	render() {
		const { width, height, isSizeSet, usersScoreFadeClass } = this.state;
		const { model, side, compete, showUserScores, playingUsers, user } = this.props;
		const userScoreOverview = userScoreOverview;
		return (
			<React.Fragment>
				{isSizeSet && (
					<React.Fragment>
						{compete ? (
							<div className="model-wrapper">
								{model.model && (
									<img
										src={`${this.props.imgPath}/${model.model}.png`}
										width={`${width}px`}
										height={`${height}px`}
										className={'drawing-model ' + this.props.side}
									/>
								)}
								{showUserScores &&
									<UserScoreOverview
										usersScoreFadeClass={usersScoreFadeClass}
										styles={styles}
										width={width}
										height={height}
										playingUsers={playingUsers}
										user={user} />
								}
							</div>
						) : (
								<div className="model-wrapper"
									style={{
										...styles.model,
										display: 'inline-block',
										width: `${width}px`,
										height: `${height}px`,
										zIndex: '3',
										overflow: 'hidden'
									}}
								>
									<div
										className={`drawing-model__select ${this.state.modelSelectClass} ${this.state
											.modelSelectClassRightFloat}`}
										style={{
											top: `${(height - 236) / 2 - 15}px`
										}}
									>
										<span
											className={`drawing-model__select__still-life ${this.props.activeModel.model ===
												'stillLife' && 'drawing-model__select__still-life--active'}`}
											onClick={() => {
												this.setModelToStillLife();
											}}
										/>
										<span
											className={`drawing-model__select__anatomy ${this.props.activeModel.model ===
												'anatomy' && 'drawing-model__select__anatomy--active'}`}
											onClick={() => {
												this.setModelToAnatomy();
											}}
										/>
									</div>
									{this.props.activeModel && this.props.activeModel.model === 'stillLife' ? (
										<img
											src="./compete/still-life/geometrical5.png"
											width={`${width}px`}
											height={`${height}px`}
											className={'drawing-model ' + this.props.side}
										/>
									) : (
											<img
												src="./compete/anatomy/womanprototype.png"
												width={`${width}px`}
												height={`${height}px`}
												className={'drawing-model ' + this.props.side}
											/>
										)}
									{showUserScores && (
											<UserScoreOverview
											usersScoreFadeClass={usersScoreFadeClass}
											styles={styles}
											width={width}
											height={height}
											playingUsers={playingUsers}
											user={user} />
									)}
								</div>
							)}

					</React.Fragment>
				)}
			</React.Fragment>
		);
	}
}
const mapStateToProps = (state) => {
	const { showTimer, timerDone, leftHand, activeModel } = state;
	return { showTimer, timerDone, leftHand, activeModel };
};
const mapDispatchToProps = (dispatch) => {
	return {
		setActiveModel: (payload) => dispatch(setActiveModel(payload))
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(DrawingModel);
