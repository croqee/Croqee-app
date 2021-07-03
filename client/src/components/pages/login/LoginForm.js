import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { theme } from "../../child/MuiTheme";

const LoginForm = ({ onSubmit, onChange, errors, successMessage, user }) => (
  <MuiThemeProvider theme={theme}>
    <div className="container">
      <form action="/" onSubmit={onSubmit} className="auth_form" noValidate>
        <h2 className="card-heading">Login</h2>
        {successMessage && <p className="success-message">{successMessage}</p>}
        <TextField
          required
          label="Email"
          id="email"
          name="email"
          onChange={onChange}
          value={user.email}
          placeholder="Your Email address"
          error={Boolean(errors && errors.summary)}
          helperText={
            errors?.email ? errors.email : errors?.summary 
          }
        />
        <TextField
          required
          label="Password"
          id="password"
          type="password"
          name="password"
          placeholder="Your Password "
          onChange={onChange}
          value={user.password}
          error={Boolean(errors && errors.summary)}
          helperText={
            errors?.password ? errors.password : errors?.summary 
          }
        />
        <Button variant="outlined" type="submit">
          Login
        </Button>
      </form>
    </div>
  </MuiThemeProvider>
);

export default LoginForm;
