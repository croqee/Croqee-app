import axios from 'axios';
import config from '../../modules/config';
import {
	SET_USER,
	GET_USER_ASYNC,
	AUTHENTICATE,
	SET_TIMER,
	SHOW_SCORE,
	HIDE_SCORE,
	REMOVE_SCORE,
	SET_IMAGE_PROCESSING,
	SET_HAND_SIDE,
	SET_TIMER_DONE,
	SET_Start_Image_Processing,
	SET_PAGE_TO_NAVIGATE_AFTER_LOGIN,
	SET_ACTIVE_MODEL
} from './action-types';

//Get User

export function getUserAsync(payload) {
	return { type: GET_USER_ASYNC, user: payload.user };
}
export function getUser() {
	return (dispatch) => {
		let AuthorizationHeader = config.AuthorizationHeader();

		axios.get('http://157.230.181.88/api/getuser', AuthorizationHeader).then((response) => {
			dispatch(authenticate(true));
			let user = response.data;
			dispatch(getUserAsync(user));
		});
	};
}

//Set User
export function setUser(payload) {
	return { type: SET_USER, user: payload };
}
export function authenticate(payload) {
	return { type: AUTHENTICATE, isAuthenticated: payload };
}

//Timer
export function setTimer(payload) {
	return { type: SET_TIMER, showTimer: payload.showTimer, timer: payload.timer };
}
export function setTimerDone(payload) {
	return { type: SET_TIMER_DONE, done: payload };
}

//Invoke Score
export function invokeScore(payload) {
	return (dispatch) => {
		dispatch(showScore(payload));
		setTimeout(() => {
			dispatch(hideScore());
			setTimeout(() => {
				// 	// dispatch(setTimer(true));
				dispatch(setTimerDone(true));
				dispatch(setStartImageProcessing(false));
			}, 1000);
		}, 4500);
	};
}
export function showScore(payload) {
	return { type: SHOW_SCORE, score: payload };
}
export function hideScoreAsync() {
	return { type: HIDE_SCORE };
}
export function removeScoreAsync(){
	return { type: REMOVE_SCORE };
}
export function hideScore() {
	return (dispatch) => {
			dispatch(hideScoreAsync());
			setTimeout(() => {
				dispatch(removeScoreAsync());
			}, 500);
	};
}

export function setImageProcessing(payload) {
	return { type: SET_IMAGE_PROCESSING, imageProcessing: payload };
}

export function setHandSide(payload) {
	return { type: SET_HAND_SIDE, side: payload };
}
export function setStartImageProcessing(payload) {
	return { type: SET_Start_Image_Processing, startImageProcessing: payload };
}
export function setPageToNavigateAfterLogin(payload) {
	return { type: SET_PAGE_TO_NAVIGATE_AFTER_LOGIN, pageToNavigateAfterLogin: payload };
}
export function setActiveModel(payload) {
	return { type: SET_ACTIVE_MODEL, activeModel: payload };
}