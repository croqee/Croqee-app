import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';

const SignUpForm = ({ onSubmit, onChange, errors, user }) => (
	<div className="container">
		<form action="/" onSubmit={onSubmit} className="auth_form">
			<h2 className="card-heading">Sign Up</h2>

			{errors.summary && <p className="error-message">{errors.summary}</p>}

			<div className="field-line">
				<label for="email">Name</label>
				<div className="auth_form_error">{errors.name}</div>
				<input
					floatingLabelText="Name"
					className="auth_input"
					id="name"
					name="name"
					onChange={onChange}
					value={user.name}
				/>
			</div>

			<div className="field-line">
				<label for="email">Email</label>
				<div className="auth_form_error">{errors.email}</div>
				<input
					floatingLabelText="Email"
					className="auth_input"
					id="email"
					name="email"
					onChange={onChange}
					value={user.email}
				/>
			</div>

			<div className="field-line">
				<label for="password">Password</label>
				<div className="auth_form_error">{errors.password}</div>
				<input
					floatingLabelText="Password"
					className="auth_input"
					id="password"
					type="password"
					name="password"
					onChange={onChange}
					value={user.password}
				/>
			</div>

			<div className="button-line">
				<button type="submit" className="auth_button">
					Create Account
				</button>
			</div>

			<div>
				Already have an account? <Link to={'/signin'}>Log in</Link>
			</div>
		</form>
	</div>
);

// SignUpForm.propTypes = {
//   onSubmit: PropTypes.func.isRequired,
//   onChange: PropTypes.func.isRequired,
//   errors: PropTypes.object.isRequired,
//   user: PropTypes.object.isRequired
// };

export default SignUpForm;
