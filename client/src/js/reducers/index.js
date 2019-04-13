import { GET_USER_ASYNC , SET_USER, AUTHENTICATE,SET_TIMER} from '../actions/action-types';
const initialState = {
	jalil: true,
	user: {},
	isAuthenticated:false,
	timer:10,
	showTimer:false
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
		default:
			return state;
	}
}
export default rootReducer;
