import { GET_USER_ASYNC } from '../constants/action-types';
const initialState = {
    jalil:true,
	user: {}
};

function rootReducer(state = initialState, action) {
	switch (action.type) {
		case GET_USER_ASYNC:
			// //First method to create the new state with existing parameter + changed ones
			// return Object.assign({}, state, {
			// 	user: (state.user = action.user)
			// });
			return {
				//Second method
				...state,
				user: (state.user = action.user)
			};
		default:
			return state;
	}
}
export default rootReducer;
