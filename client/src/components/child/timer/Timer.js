import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setTimer, setTimerDone,setStartImageProcessing } from '../../../js/actions';

class Timer extends Component {
	constructor(props) {
		super(props);

		this.state = {
			timerColor: 'timer_green'
		};
	}
	componentDidMount() {
		var loader = this.refs.loader,
			α = 360,
			π = Math.PI,
			t = this.props.timer * 2.7;
		// let setTimer = this.props.setTimer;
		var start = new Date().getTime();
		let done = false;

		let setTimerColor = this.setTimerColor;
		let setStartImageProcessing = this.props.setStartImageProcessing;
		(function draw() {
			α--;
			// α %= 360;
			if (α === 0) {
				done = true;
				var end = new Date() - start;
				console.info('Execution time: %dms', end);
				setStartImageProcessing(true);
			}
			if (α < 240 && α > 120) {
				setTimerColor('timer_orange');
			} else if (α < 120) {
				setTimerColor('timer_red');
			}

			var r = α * π / 180,
				x = Math.sin(r) * 125,
				y = Math.cos(r) * -125,
				mid = α > 180 ? 1 : 0,
				anim = 'M 0 0 v -125 A 125 125 1 ' + mid + ' 1 ' + x + ' ' + y + ' z';
			// [x,y].forEach(function( d ){
			//  d = Math.round( d * 1e3 ) / 1e3;
			// });

			loader.setAttribute('d', anim);
			if (!done) {
				setTimeout(draw, t); // Redraw
			}
		})();
	}
	setTimerColor = (param) => {
		this.setState({
			timerColor: param
		});
	};

	render() {
		return (
			<React.Fragment>
				<svg width="100" height="100" viewbox="0 0 150 150">
					<path
						id="loader"
						className={this.state.timerColor}
						ref="loader"
						transform="translate(50, 50) scale(.400)"
					/>
				</svg>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => {
	const { timer, timerDone } = state;
	return { timer, timerDone};
};
const mapDispatchToProps = (dispatch) => {
	return {
		setTimer: (payload) => dispatch(setTimer(payload)),
		setTimerDone: (payload) => dispatch(setTimerDone(payload)),
		setStartImageProcessing: (payload) => dispatch(setStartImageProcessing(payload))
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(Timer);
