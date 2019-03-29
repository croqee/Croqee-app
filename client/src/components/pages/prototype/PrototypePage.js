import React from 'react';
import Canvas from '../../child/canvas/CanvasPage';
import CanvasPage from '../../child/canvas/CanvasPage';
import axios from 'axios';
import config from  '../../../modules/config';


class PrototypePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			greet: '',
			note: '',
			user: {}
		};
	}
	componentDidMount() {
		axios.post('/').then((response) => {
			console.log(response);
			const { greet, note, messageFromPython } = response.data;
			this.setState({
				greet,
				note,
				messageFromPython
			});
		});

  
		const AuthorizationHeader = config.AuthorizationHeader();
		axios.get('/api/getuser',AuthorizationHeader).then((response) => {
			console.log(response);
			const { user } = response.data;
			this.setState({
			user
			});
		});


	}
	render() {
		return (
			<React.Fragment>
				<h2>Hello {this.state.user && this.state.user.name}</h2>
				<h2>{this.state.greet}</h2>
				<h2>{this.state.messageFromPython}</h2>
				<p>{this.state.note}</p>
				<img src="./model.jpg" className="modelImg" />
				<CanvasPage />
			</React.Fragment>
		);
	}
}
export default PrototypePage;
