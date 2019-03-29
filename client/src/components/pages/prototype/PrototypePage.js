import React from 'react';
import Canvas from '../../child/canvas/CanvasPage';
import CanvasPage from '../../child/canvas/CanvasPage';
import axios from 'axios';
import Auth from '../../../modules/Auth'

class PrototypePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			greet: '',
            note: '',
            user:{}
		};
	}
	componentDidMount() {

		axios.post('/').then((response) => {
			console.log(response);
			const { greet, note, messageFromPython } = response.data;
			this.setState({
				greet,
				note,
                messageFromPython,
			});
        });
        


        const xhr = new XMLHttpRequest();
        xhr.open('get', '/api/getuser');
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        // set the authorization HTTP header
        xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
        xhr.responseType = 'json';
        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            this.setState({
              user: xhr.response.user
            });
          }
        });
        xhr.send();

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
