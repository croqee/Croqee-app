import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { theme } from "../../child/MuiTheme";

const SignUpForm = ({ onSubmit, onChange, errors, user }) => (
  <MuiThemeProvider theme={theme}>
    <div className="container">
      <form action="/" onSubmit={onSubmit} className="auth_form" noValidate>
        <h2 className="card-heading">Sign Up</h2>

        {errors?.summary && <p className="error-message">{errors?.summary}</p>}

        <div className="field-line">
          <TextField
            required
            label="Username"
            id="name"
            name="name"
            onChange={onChange}
            value={user.name}
            placeholder="Your Username"
            error={Boolean(
              errors?.name || errors?.summary
            )}
            helperText={
              errors?.name ? errors.name: errors.summary
            }
          />
        </div>

        <TextField
          required
          label="Email"
          id="email"
          name="email"
          onChange={onChange}
          value={user.email}
          placeholder="Your Email address"
          error={Boolean(
            errors?.email ||  errors?.summary
          )}
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
          onChange={onChange}
          value={user.password}
          placeholder="Your Password "
          error={Boolean(
            errors?.password || errors?.summary 
          )}
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

export default SignUpForm;
