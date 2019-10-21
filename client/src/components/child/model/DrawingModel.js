import React, { Component } from 'react';

export default class DrawingModel extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isSizeSet: false,
			width: null,
			height: null
		};
		window.addEventListener('resize', () => {
			this.setModelSize();
		});
	}

	componentDidMount() {
		this.setModelSize();
	}
	setModelSize() {
		let screenSize = this.getWidth();
		console.log(screenSize);
		this.setState({ isSizeSet: false }, () => {
			if (screenSize > 1700) {
				this.setState({
					width: 800,
					height: 600,
					isSizeSet: true
				});
			} else if (screenSize > 1660) {
				this.setState({
					width: 780,
					height: 585,
					isSizeSet: true
				});
			} else if (screenSize > 1620) {
				this.setState({
					width: 760,
					height: 570,
					isSizeSet: true
				});
			} else if (screenSize > 1580) {
				this.setState({
					width: 740,
					height: 555,
					isSizeSet: true
				});
			} else if (screenSize > 1540) {
				this.setState({
					width: 720,
					height: 540,
					isSizeSet: true
				});
			} else if (screenSize > 1500) {
				this.setState({
					width: 700,
					height: 525,
					isSizeSet: true
				});
			} else if (screenSize > 1450) {
				this.setState({
					width: 680,
					height: 510,
					isSizeSet: true
				});
			} else if (screenSize > 1400) {
				this.setState({
					width: 660,
					height: 495,
					isSizeSet: true
				});
			} else if (screenSize > 1365) {
				this.setState({
					width: 640,
					height: 480,
					isSizeSet: true
				});
			} else {
				this.setState({
					width: 600,
					height: 450,
					isSizeSet: true
				});
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
	render() {
		const { width, height, isSizeSet } = this.state;
		const { model, side, compete } = this.props;

		return (
			<React.Fragment>
				{isSizeSet && (
					<React.Fragment>
						{compete ? (
							<React.Fragment>
								{model.model == 'model_1' && (
                                    <img src="./shapes_1.png" 
                                    width={`${width}px`}
                                    height={`${height}px`}
                                    className={'drawing-model ' + this.props.side}
                                    />
								)}
								{model.model == 'model_2' && (
                                    <img src="./shapes_2.png"
                                    width={`${width}px`}
                                    height={`${height}px`}
                                    className={'drawing-model ' + this.props.side}
                                    />
								)}
								{model.model == 'model_3' && (
                                    <img src="./shapes_3.png" 
                                    width={`${width}px`}
                                    height={`${height}px`}
                                    className={'drawing-model ' + this.props.side}
                                    />
								)}
							</React.Fragment>
						) : (
							<img
								src="./shapes_1.png"
								width={`${width}px`}
								height={`${height}px`}
								className={'drawing-model ' + this.props.side}
							/>
						)}
					</React.Fragment>
				)}
			</React.Fragment>
		);
	}
}
