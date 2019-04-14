import { GET_USER_ASYNC , SET_USER, AUTHENTICATE,SET_TIMER, SHOW_SCORE, HIDE_SCORE, SET_IMAGE_PROCESSING} from '../actions/action-types';
const initialState = {
	jalil: true,
	user: {},
	isAuthenticated:false,
	timer:20,
	showTimer:false,
	scoreClass:"",
	currentScore:"",
	imageProcessing:false
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
			}
		case SET_TIMER:
			return{
				...state,
				showTimer: action.showTimer
			}
		case SHOW_SCORE:
			return{
				...state,
				scoreClass:"userScore_show",
				currentScore: action.score
			}
		case HIDE_SCORE:
			return{
				...state,
				scoreClass:"",
			}
	    case SET_IMAGE_PROCESSING:
			return{
				...state,
				imageProcessing:action.imageProcessing,
			}
		default:
			return state;
	}
}
export default rootReducer;
