import {
	GET_USER_ASYNC,
	SET_USER,
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
	SET_ACTIVE_MODEL,
	SET_ACTIVE_MODEL_DRAWN,
	GET_USERS_SCORE_ASYNC,
	GET_SCORED_MODELS_ASYNC,
	SET_CANVAS_WIDTH_AND_HEIGHT
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
	pageToNavigateAfterLogin: '/',
	activeModel: {
		model: 'stillLife',
		isDrawn: false
	},
	usersScore: [],
	scoredModels: [],
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
				scoreClass: 'userscore--show',
				currentScore: action.score
			};
		case HIDE_SCORE:
			return {
				...state,
				scoreClass: 'userscore--hide'
			};
		case REMOVE_SCORE:
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
		case SET_ACTIVE_MODEL:
			return {
				...state,
				activeModel: action.activeModel
			};
		case SET_ACTIVE_MODEL_DRAWN:
			const model = state.activeModel.model;
			return {
				...state,
				activeModel: {
					model: model,
					isDrawn: true
				}
			};
		case GET_USERS_SCORE_ASYNC:
			return {
				...state,
				usersScore: action.usersScore
			};
		case GET_SCORED_MODELS_ASYNC:
			return {
				...state,
				scoredModels: action.scoredModels
			};
		default:
			return state;
	}
}
export default rootReducer;
