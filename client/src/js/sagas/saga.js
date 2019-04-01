import { takeLatest, put, delay, all } from 'redux-saga/effects';
import { GET_USER } from '../constants/action-types';
import { getUserAsync } from '../actions';
import axios from 'axios';
import config from '../../modules/config';

export function* GetUserAsync() {
	let AuthorizationHeader = config.AuthorizationHeader();
	let user;
	yield axios.get('/api/getuser', AuthorizationHeader).then((response) => {
		user = response.data;
	});
	yield put(getUserAsync(user));
}

export function* WatchGetUser() {
	yield takeLatest(GET_USER, GetUserAsync);
}

export default function* rootSaga() {
	yield all([ WatchGetUser() ]);
}
