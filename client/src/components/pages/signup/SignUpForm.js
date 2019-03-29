import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';

const SignUpForm = ({ onSubmit, onChange, errors, user }) => (
	<div className="container">
		<form action="/" onSubmit={onSubmit}>
			<h2 className="card-heading">Sign Up</h2>

			{errors.summary && <p className="error-message">{errors.summary}</p>}

			<div className="field-line">
      <div>{errors.name}</div>
				<input
					floatingLabelText="Name"
					name="name"
					onChange={onChange}
					value={user.name}
				/>
			</div>

			<div className="field-line">
      <div>{errors.email}</div>
				<input
					floatingLabelText="Email"
					name="email"
					onChange={onChange}
					value={user.email}
				/>
			</div>

			<div className="field-line">
      <div>{errors.password}</div>
				<input
					floatingLabelText="Password"
					type="password"
					name="password"
					onChange={onChange}
					value={user.password}
				/>
			</div>

			<div className="button-line">
				<button type="submit">Create Account</button>
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
