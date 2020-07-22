import React, { useState } from "react";
import { Button, Card, TextField, Typography } from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { theme } from "../../child/MuiTheme";
import config from "../../../modules/config";
import axios from "axios";

export default function ForgotPassword() {
  const [errors, setError] = useState();
  const [isLoading, setLoading] = useState();
  const [successMessage, setsuccessMessage] = useState();
  const [email, setEmail] = useState();

  const onChange = e => {
    let input = e.target;
    setLoading(false);
    setEmail({ email: input.value });
  };
  const onSubmit = e => {
    e.preventDefault();
    const form = e.target;
    const isValid = form.checkValidity();
    const formData = new FormData(form);
    const validationMessages = Array.from(formData.keys()).reduce(
      (acc, key) => {
        acc[key] = form.elements[key].validationMessage;
        return acc;
      },
      {}
    );

    if (!isValid) {
      let msg = validationMessages.email.split(".");
      setError(msg[0]);
    } else {
      setLoading(true);
      let UnAthorizedHeader = config.UnAthorizedHeader();
      axios
        .post("/auth/account", email, UnAthorizedHeader)
        .then(response => {
          if (response.status === 200) {
            setLoading(false);
            setsuccessMessage(
              "Please check your email address and follow the instructions."
            );
          }
        })
        .catch(error => {
          setLoading(false);
          setsuccessMessage("Something went wrong!");
        });
    }
  };

  return (
    <MuiThemeProvider theme={theme}>
      <Card variant="outlined" square dark>
        <div className="container">
          <form action="/" onSubmit={onSubmit} className="auth_form" noValidate>
            <h2 className="card-heading"> Enter your email address</h2>
            {successMessage && (
              <Typography variant="body1" className="success-message">
                {successMessage}
              </Typography>
            )}
            <TextField
              required
              label="Email"
              id="email"
              name="email"
              type="email"
              onChange={onChange}
              placeholder="Your Email address"
              error={Boolean(errors !== undefined)}
              helperText={errors}
            />
            <Button variant="outlined" disabled={isLoading} type="submit">
              {isLoading ? "Sending..." : "Send Link"}
            </Button>
          </form>
        </div>
      </Card>
    </MuiThemeProvider>
  );
}
