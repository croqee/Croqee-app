import { SET_USER,  GET_USER, GET_USER_ASYNC } from '../constants/action-types';

//Get User
export function getUser() {
	return { type: GET_USER };
}
export function getUserAsync(payload) {
	return { type: GET_USER_ASYNC, user:payload.user };
}

//Set User
export function setUser(payload) {
	return { type: SET_USER , user:payload };
}

