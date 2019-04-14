import React, { Component } from 'react';

class Loader extends Component {
	render() {
		return (
			<div>
				<div className="loading-bro">
					
					<svg id="load" x="0px" y="0px" viewBox="0 0 150 150">
						<circle id="loading-inner" cx="75" cy="75" r="60" />
					</svg>
				</div>
			</div>
		);
	}
}
export default Loader;
