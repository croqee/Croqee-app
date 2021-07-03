import Auth from './Auth';

const config = {
	AuthorizationHeader: () => {
		const AuthorizationHeader = {
			headers: {
				Authorization: `bearer ${Auth.getToken()}`
			}
		};
		return AuthorizationHeader;
	},
	UnAthorizedHeader: () => {
		const AuthorizationHeader = {
			headers: {
			}
		};
		return AuthorizationHeader;
	}
};

export default config;
