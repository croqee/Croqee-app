import React, { PropTypes } from "react";
import { Link } from "react-router-dom";

const LoginForm = ({ onSubmit, onChange, errors, successMessage, user }) => (
  <div className="container">
    <form action="/" onSubmit={onSubmit} className="auth_form">
      <h2 className="card-heading">Login</h2>

      {successMessage && <p className="success-message">{successMessage}</p>}
      {errors.summary && <p className="error-message">{errors.summary}</p>}

      <div className="field-line">
        <label for="email">Email</label>
        <div className="auth_form_error">{errors.email}</div>
        <input
          floatingLabelText="Email"
          id="email"
          name="email"
          className="auth_input"
          onChange={onChange}
          value={user.email}
        />
      </div>

      <div className="field-line">
        <label for="email">Password</label>
        <div className="auth_form_error">{errors.password}</div>
        <input
          floatingLabelText="Password"
          id="password"
          type="password"
          name="password"
          className="auth_input"
          onChange={onChange}
          value={user.password}
        />
      </div>

      <div>
        <button type="submit" className="auth_button">
          Sign in
        </button>
      </div>

      <div>
        Don't have an account? <Link to={"/signup"}>Create one</Link>.
      </div>
    </form>
  </div>
);

export default LoginForm;
