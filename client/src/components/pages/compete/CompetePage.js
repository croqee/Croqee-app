import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Canvas from '../../child/canvas/CanvasPage';
import CanvasPage from '../../child/canvas/CanvasPage';
import config from '../../../modules/config';
import { getUser, setTimer } from '../../../js/actions';
import Timer from '../../child/timer/Timer';
import EmptyTimer from '../../child/timer/EmptyTimer';
import HandSide from '../../child/handside/HandSide';
import UserPendingLoader from '../../child/userpendingloader/UserPendingLoader';
import socketIOClient from 'socket.io-client'


class CompetePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			existingPlayer:false,
			endpoint:"server_node:3000"
		};
	}
	componentDidMount() {
		const socket = socketIOClient(this.state.endpoint);
		socket.emit('username', this.props.user) 
		socket.on('new_user', (user)=>{
			console.log(user)
		}) 

	}
	render() {
		let side = this.props.leftHand?"model_left_hand":""
		return (
			<React.Fragment>
			{/* <UserPendingLoader caption={"Waiting for users to join the competition. Stay tuned and warm up!"}/> */}
				{this.props.showTimer ? <Timer /> : <EmptyTimer />}
				<div>
					<img src="./shapes_1.png" className={"modelImg draw_and_model " + side} />
					<div>	
						<CanvasPage showGuideLine={false}/>
					</div>
					<HandSide/>

				</div>
			</React.Fragment>
		);
	}
}
const mapStateToProps = state => {
	const { events, user, showTimer,leftHand } = state;
	return { events, user, showTimer,leftHand };
};
const mapDispatchToProps = dispatch => {
	return {
		getUser: () => dispatch(getUser()),

	};
}
export default connect(mapStateToProps, mapDispatchToProps)(CompetePage);
