import React, { Component } from 'react';
import { connect } from 'react-redux';

class EmptyTimer extends Component {
	constructor(props) {
		super(props);

		this.state = {
			timerColor: 'timer_green'
		};
	}
	componentDidMount(){
	// 	if(this.props.isCompeting){
	// 	this.draw();
	// }
}
	draw = () => {
		let loader = this.refs.loader;

		let α = 359;
		let π = Math.PI;
		var r = α * π / 180,
			x = Math.sin(r) * 125,
			y = Math.cos(r) * -125,
			anim = 'M 0 0 v -125 A 125 125 1 ' + 1 + ' 1 ' + x + ' ' + y + ' z';

		loader.setAttribute('d', anim);

	};

	render() {
		return (
			<React.Fragment>
				{!this.props.isCompeting &&
				<>
				<svg width="100" height="100" viewbox="0 0 150 150">
					<path
						id="loader"
						className={this.state.timerColor}
					/>
				</svg>
				 <span className="begindrawing">
				 {this.props.timerDone && !this.props.noText ?"The timer starts as you begin drawing the model"
				 :"Evaluating your score..."}
				 </span>
				 </>
				 }
				{this.props.isCompeting &&  <>
			  	
				{/* <svg width="100" height="100" viewbox="0 0 150 150">
				<path
					id="loader"
					className="timer_gray"
					ref="loader"
					transform="translate(50, 50) scale(.400)"

				/>
			</svg> */}
			<svg width="100" height="100" viewbox="0 0 150 150">
			<path
				id="loader"
				className={this.state.timerColor}
			/>
		</svg>
		 <span className="begindrawing">
		 Wait for the timer
		 </span>
		 </>
				}

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
