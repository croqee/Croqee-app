import axios from 'axios';
import config from '../../modules/config';
import { SET_USER, GET_USER_ASYNC, AUTHENTICATE ,SET_TIMER} from './action-types';

//Get User

export function getUserAsync(payload) {
	return { type: GET_USER_ASYNC, user: payload.user };
}
export function getUser() {
	return (dispatch) => {
		let AuthorizationHeader = config.AuthorizationHeader();

		axios.get('/api/getuser', AuthorizationHeader).then((response) => {
			dispatch(authenticate(true))
			let user = response.data;
			dispatch(getUserAsync(user));
		});
	};
}

//Set User
export function setUser(payload) {
	return { type: SET_USER, user: payload };
}
export function authenticate(payload){
	return {type: AUTHENTICATE , isAuthenticated:payload}
}

export function setTimer(payload){
	return {type: SET_TIMER , showTimer:payload}
}
