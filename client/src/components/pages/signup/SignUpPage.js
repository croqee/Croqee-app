import React, { PropTypes } from 'react';
import SignUpForm from './SignUpForm.js';
import { Redirect } from 'react-router-dom';
import config from '../../../modules/config';
import axios from 'axios';

class SignUpPage extends React.Component {
	/**
   * Class constructor.
   */
	constructor(props, context) {
		super(props, context);

		// set the initial component state
		this.state = {
			errors: {},
			user: {
				email: '',
				name: '',
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
		const name = encodeURIComponent(this.state.user.name);
		const email = encodeURIComponent(this.state.user.email);
		const password = encodeURIComponent(this.state.user.password);

		const body = {
			name,
			email,
			password
		};

		let UnAthorizedHeader = config.UnAthorizedHeader();

		axios
			.post('http://157.230.181.88:80/auth/signup', body, UnAthorizedHeader)
			.then((response) => {
				this.setState({
					errors: {}
				});
				localStorage.setItem('successMessage', response.data.message);
				return this.props.history.push('/login');
			})
			.catch((error) => {
				console.log(error.response);
				let { errors } = error.response.data;
				this.setState({
					errors
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
			<SignUpForm
				onSubmit={this.processForm}
				onChange={this.changeUser}
				errors={this.state.errors}
				user={this.state.user}
			/>
		);
	}
}

// SignUpPage.contextTypes = {
//   router: PropTypes.object.isRequired
// };

export default SignUpPage;
