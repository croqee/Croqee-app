import {
	GET_USER_ASYNC,
	SET_USER,
	AUTHENTICATE,
	SET_TIMER,
	SHOW_SCORE,
	HIDE_SCORE,
	SET_IMAGE_PROCESSING,
	SET_HAND_SIDE,
	SET_TIMER_DONE,
	SET_Start_Image_Processing,
	SET_PAGE_TO_NAVIGATE_AFTER_LOGIN
} from '../actions/action-types';
const initialState = {
	user: {},
	isAuthenticated: false,
	timer: 30,
	showTimer: false,
	timerDone: true,
	startImageProcessing: false,
	scoreClass: '',
	currentScore: '',
	imageProcessing: false,
	leftHand: false,
	pageToNavigateAfterLogin: '/'
};

function rootReducer(state = initialState, action) {
	switch (action.type) {
		case SET_USER:
			//First method to create the new state with existing parameter + changed ones
			return Object.assign({}, state, {
				user: (state.user = action.user)
			});
		case GET_USER_ASYNC:
			return {
				//Second method
				...state,
				user: (state.user = action.user)
			};
		case AUTHENTICATE:
			return {
				...state,
				isAuthenticated: action.isAuthenticated
			};
		case SET_TIMER:
			return {
				...state,
				showTimer: action.showTimer,
				timer: action.timer
			};
		case SET_TIMER_DONE:
			return {
				...state,
				timerDone: action.done
			};
		case SHOW_SCORE:
			return {
				...state,
				scoreClass: 'userScore_show',
				currentScore: action.score
			};
		case HIDE_SCORE:
			return {
				...state,
				scoreClass: ''
			};
		case SET_IMAGE_PROCESSING:
			return {
				...state,
				imageProcessing: action.imageProcessing
			};
		case SET_HAND_SIDE:
			return {
				...state,
				leftHand: action.side
			};
		case SET_Start_Image_Processing:
			return {
				...state,
				startImageProcessing: action.startImageProcessing
			};
		case SET_PAGE_TO_NAVIGATE_AFTER_LOGIN:
			return {
				...state,
				pageToNavigateAfterLogin: action.pageToNavigateAfterLogin
			};
		default:
			return state;
	}
}
export default rootReducer;
