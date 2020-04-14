import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setTimer, setTimerDone, setStartImageProcessing } from '../../../js/actions';

class Timer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			timerColor: 'timer_orange',
		};
	
	}
	componentDidMount() {
		this.processIntrupted = false

		this.loader = this.refs.loader;
		this.α = 360;
		this.π = Math.PI;
		this.t = this.props.timer * 2.7;
		this.start = new Date().getTime();
		this.done = false;
		this.draw();

	}
	componentWillUnmount(){
		this.processIntrupted = true;
	}
	draw = () => {
		this.α--;
		if (this.α === 0 && !this.processIntrupted) {
			this.done = true;
			var end = new Date() - this.start;
			console.info('Execution time: %dms', end);
			this.props.setStartImageProcessing(true);
		}
		var r = this.α * this.π / 180,
			x = Math.sin(r) * 125,
			y = Math.cos(r) * -125,
			mid = this.α > 180 ? 1 : 0,
			anim = 'M 0 0 v -125 A 125 125 1 ' + mid + ' 1 ' + x + ' ' + y + ' z';

		this.loader.setAttribute('d', anim);
		if (!this.done && !this.processIntrupted) {
			setTimeout(this.draw, this.t); // Redraw
		}
	};

	setTimerColor = (param) => {
		this.setState({
			timerColor: param
		});
	};

	render() {
		return (
			<React.Fragment>
				<svg className={`timer`} width="100" height="100" viewbox="0 0 150 150">
					<path
						id="loader"
						className={this.state.timerColor}
						ref="loader"
						transform="translate(50, 50) scale(.200)"
					/>
				</svg>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => {
	const { timer, timerDone } = state;
	return { timer, timerDone };
};
const mapDispatchToProps = (dispatch) => {
	return {
		setTimer: (payload) => dispatch(setTimer(payload)),
		setTimerDone: (payload) => dispatch(setTimerDone(payload)),
		setStartImageProcessing: (payload) => dispatch(setStartImageProcessing(payload))
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(Timer);
