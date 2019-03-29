import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';

const LoginForm = ({ onSubmit, onChange, errors, successMessage, user }) => (
	<div className="container">
		<form action="/" onSubmit={onSubmit}>
			<h2 className="card-heading">Login</h2>

			{successMessage && <p className="success-message">{successMessage}</p>}
			{errors.summary && <p className="error-message">{errors.summary}</p>}

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
				<button type="submit" >
					Sign in
				</button>
			</div>

			<div>
				Don't have an account? <Link to={'/signup'}>Create one</Link>.
			</div>
		</form>
	</div>
);

// LoginForm.propTypes = {
//   onSubmit: PropTypes.func.isRequired,
//   onChange: PropTypes.func.isRequired,
//   errors: PropTypes.object.isRequired,
//   successMessage: PropTypes.string.isRequired,
//   user: PropTypes.object.isRequired
// };

export default LoginForm;
