import React, { Component } from 'react';
import { connect } from 'react-redux';

class EmptyTimer extends Component {
	constructor(props) {
		super(props);

		this.state = {
			timerColor: 'timer_green'
		};
	}
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
				<span className="begindrawing">{this.props.timerDone && !this.props.noText ?"The timer starts as you begin drawing the model":"Evaluating your score..."}</span>
			</React.Fragment>
		);
	}
}

const mapStateToProps = state => {
	const {  timerDone } = state;
	return {  timerDone };
};
const mapDispatchToProps = dispatch => {
	return {
	};
}
export default connect(mapStateToProps, mapDispatchToProps)(EmptyTimer);
