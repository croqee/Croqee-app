import React, { Component } from 'react';

let styles = {
	model: {}
};

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
		const screenSize = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		let width;
		let height;
		if (screenSize > 1850) {
			const margin = Math.floor((screenSize - 1800) / 3)-2;
			width = 900;
			height = 675;
			styles.model = {
				...styles.model,
				marginLeft: margin+'px'
			};
		} else {
			width = Math.floor(screenSize / 2 - 9);
			height = Math.floor(width / 800 * 600);
			styles.model = {
				...styles.model,
				marginLeft: '0'
			};
		}
		console.log(screenSize);
		this.setState({ isSizeSet: false }, () => {
			this.setState({
				width: width,
				height: height,
				isSizeSet: true
			});
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
							<div style={styles.model}>
								{model.model == 'geometrical1' && (
									<img
										src="./still-life-models/geometrical1.png"
										width={`${width}px`}
										height={`${height}px`}
										className={'drawing-model ' + this.props.side}
									/>
								)}
								{model.model == 'geometrical2' && (
									<img
										src="./still-life-models/geometrical2.png"
										width={`${width}px`}
										height={`${height}px`}
										className={'drawing-model ' + this.props.side}
									/>
								)}
								{model.model == 'geometrical3' && (
									<img
										src="./still-life-models/geometrical3.png"
										width={`${width}px`}
										height={`${height}px`}
										className={'drawing-model ' + this.props.side}
									/>
								)}
								{model.model == 'geometrical4' && (
									<img
										src="./still-life-models/geometrical4.png"
										width={`${width}px`}
										height={`${height}px`}
										className={'drawing-model ' + this.props.side}
									/>
								)}
								{model.model == 'geometrical5' && (
									<img
										src="./still-life-models/geometrical5.png"
										width={`${width}px`}
										height={`${height}px`}
										className={'drawing-model ' + this.props.side}
									/>
								)}
							</div>
						) : (
							<div style={styles.model}>
								<img
									src="./still-life-models/geometrical5.png"
									width={`${width}px`}
									height={`${height}px`}
									className={'drawing-model ' + this.props.side}
								/>
							</div>
						)}
					</React.Fragment>
				)}
			</React.Fragment>
		);
	}
}
