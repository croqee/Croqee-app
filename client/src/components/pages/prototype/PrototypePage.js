import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Canvas from '../../child/canvas/CanvasPage';
import CanvasPage from '../../child/canvas/CanvasPage';
import config from  '../../../modules/config';
import { getUser } from '../../../js/actions';

class PrototypePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			greet: '',
			note: '',
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

		this.props.getUser();


	}
	render() {
		let user = this.props.user;
		return (
			<React.Fragment>
				<h2> {user.name && "Hello "+ user.name}</h2>
				<img src="./model.jpg" className="modelImg" />
				<CanvasPage />
			</React.Fragment>
		);
	}
}
const mapStateToProps = state => {
	const {events, user} = state;
	return { events , user};
  };
  const mapDispatchToProps = dispatch => {
	return {
	  getUser: () => dispatch(getUser())
	};
  }
export default  connect(mapStateToProps , mapDispatchToProps)(PrototypePage);
