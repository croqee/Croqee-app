import React, { PropTypes } from 'react';
import Auth from '../../../modules/Auth';
import LoginForm from './LoginForm.js';
import { Redirect } from 'react-router-dom';
import config from '../../../modules/config';
import axios from 'axios';

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
			.post('/auth/login', body, UnAthorizedHeader)
			.then((response) => {
				console.log('trigggereed');
				this.setState({
					errors: {}
				});
				Auth.authenticateUser(response.data.token);
				return this.props.history.push('/');
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

	/**
   * Render the component.
   */
	render() {
		return (
			<LoginForm
				onSubmit={this.processForm}
				onChange={this.changeUser}
				errors={this.state.errors}
				successMessage={this.state.successMessage}
				user={this.state.user}
			/>
		);
	}
}

// LoginPage.contextTypes = {
//   router: PropTypes.object.isRequired
// };

export default LoginPage;
