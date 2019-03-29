import Auth from './Auth';

const config = {
	AuthorizationHeader: () => {
		const AuthorizationHeader = {
			headers: {
				'Content-type': 'application/x-www-form-urlencoded',
				Authorization: `bearer ${Auth.getToken()}`
			}
		};
		return AuthorizationHeader;
	},
	UnAthorizedHeader: () => {
		const AuthorizationHeader = {
			headers: {
				'Content-type': 'application/x-www-form-urlencoded'
			}
		};
		return AuthorizationHeader;
	}
};

export default config;
