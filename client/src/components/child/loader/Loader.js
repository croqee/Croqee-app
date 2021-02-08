import React, { Component } from 'react';

class Loader extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fadeIn: ''
		}
	}
	componentDidMount() {
		this.setState({
			fadeIn: 'loader-canvas-blocker--fade-in'
		});
	}
	render() {
		const { fadeIn } = this.state;
		return (
			<React.Fragment>
				<div className={"loader-canvas-blocker " + fadeIn}></div>
				<span className="loader"><span className="loader__inner"></span></span>
			</React.Fragment>
		);
	}
}
export default Loader;
