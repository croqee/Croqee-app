import { GET_USER, GET_USER_ASYNC } from '../constants/action-types';

export function getUser() {
	return { type: GET_USER };
}
export function getUserAsync(payload) {
	return { type: GET_USER_ASYNC, user:payload.user };
}
