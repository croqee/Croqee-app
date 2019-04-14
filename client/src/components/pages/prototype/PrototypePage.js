import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Canvas from '../../child/canvas/CanvasPage';
import CanvasPage from '../../child/canvas/CanvasPage';
import config from  '../../../modules/config';
import { getUser,setTimer } from '../../../js/actions';
import Timer from '../../child/timer/Timer';

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
				{this.props.showTimer && <Timer/>}
				<span id="drawhere"/>
				<img src="./shapes_1.png" className="modelImg" />
				<CanvasPage />

				<div id="home_bottom">
				<img id="home_bottom_triangle" src="/triangle.png"/>
				<button id="home_bottom_button">Challenge with others</button>
				</div>
			</React.Fragment>
		);
	}
}
const mapStateToProps = state => {
	const {events, user, showTimer} = state;
	return { events , user,showTimer};
  };
  const mapDispatchToProps = dispatch => {
	return {
		getUser: () => dispatch(getUser()),

	};
  }
export default  connect(mapStateToProps , mapDispatchToProps)(PrototypePage);
