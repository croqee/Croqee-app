import React, { PropTypes } from 'react';
import Auth from '../../../modules/Auth';
import LoginForm from './LoginForm.js';
import { Redirect } from 'react-router-dom';
import config from '../../../modules/config';
import axios from 'axios';
import { connect } from 'react-redux';
import { setUser, getUser, setPageToNavigateAfterLogin } from '../../../js/actions';
// import { GoogleLogin } from 'react-google-login';

class LoginPage extends React.Component {
	/**
   * Class constructor.
   */
	constructor(props, context) {
		super(props, context);

		const storedMessage = localStorage.getItem('successMessage');
		let successMessage = '';

		if (storedMessage) {
			successMessage = storedMessage;
			localStorage.removeItem('successMessage');
		}

		// set the initial component state
		this.state = {
			errors: {},
			successMessage,
			user: {
				email: '',
				password: ''
			}
		};

		this.processForm = this.processForm.bind(this);
		this.changeUser = this.changeUser.bind(this);
	}

	/**
   * Process the form.
   *
   * @param {object} event - the JavaScript event object
   */
	processForm(event) {
		// prevent default action. in this case, action is the form submission event
		event.preventDefault();

		// create a string for an HTTP body message
		const email = encodeURIComponent(this.state.user.email);
		const password = encodeURIComponent(this.state.user.password);
		const body = {
			email,
			password
		};
		let UnAthorizedHeader = config.UnAthorizedHeader();
		// let formData = Object.assign({}, body, UnAthorizedHeader);

		axios
			.post('http://157.230.181.88/auth/login', body, UnAthorizedHeader)
			.then((response) => {
				const { token, user } = response.data;
				this.props.setUser(user);
				this.setState({
					errors: {}
				});
				Auth.authenticateUser(token);
				this.props.getUser(user);
				this.props.history.push(this.props.pageToNavigateAfterLogin);
				return this.props.setPageToNavigateAfterLogin('/');
			})
			.catch((error) => {
				console.log(error.response);
				let { errors, message } = error.response.data;
				const errorLogs = errors ? errors : {};
				errorLogs.summary = message;

				this.setState({
					errors: errorLogs
				});
			});
	}

	/**
   * Change the user object.
   *
   * @param {object} event - the JavaScript event object
   */
	changeUser(event) {
		const field = event.target.name;
		const user = this.state.user;
		user[field] = event.target.value;

		this.setState({
			user
		});
	}
   
	// responseGoogle(response) {
	// 	console.log(response.code);

	// 	axios.post('auth/googleauth', { googleCode: response.code }).then((response) => {
	// 	console.log(response);
	// 	});

	//   }

	/**
   * Render the component.
   */
	render() {
		return (
			<React.Fragment>
				<LoginForm
					onSubmit={this.processForm}
					onChange={this.changeUser}
					errors={this.state.errors}
					successMessage={this.state.successMessage}
					user={this.state.user}
				/>
				{/* <GoogleLogin
					clientId="2889500814-sj1korvtin4tf6svk6mksiq9aqcv880j.apps.googleusercontent.com"
					buttonText="Login"
					onSuccess={this.responseGoogle}
					onFailure={this.responseGoogle}
					cookiePolicy={'single_host_origin'}
					responseType="code"
					accessType="offline"
				/> */}
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => {
	const { pageToNavigateAfterLogin } = state;
	return { pageToNavigateAfterLogin };
};
const mapDispatchToProps = (dispatch) => {
	return {
		getUser: () => dispatch(getUser()),
		setUser: (user) => dispatch(setUser(user)),
		setPageToNavigateAfterLogin: (payload) => dispatch(setPageToNavigateAfterLogin(payload))
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
