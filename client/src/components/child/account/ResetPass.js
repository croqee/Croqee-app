import React, { useState, useEffect } from "react";
import { TextField, Button, Card, Divider } from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { theme } from "../../child/MuiTheme";
import axios from "axios";
import config from "../../../modules/config";

export default function ResetPass(props) {
  const [successMessage, setsuccessMessage] = useState();
  const [msg, setMsg] = useState();
  const [errors, setErrors] = useState();
  const [email, setEmail] = useState();
  const [userToken, setToken] = useState();
  const [password, setPassword] = useState({
    newPass: "",
    confirmPass: ""
  });

  useEffect(async () => {
    const str = props.location.pathname.toString();
    const newPath = str.split("/").pop();
    axios
      .get("/auth/reset", {
        params: {
          resetPasswordToken: newPath
        }
      })
      .then(response => {
        if (response.data.message === "password reset link a-ok") {
          setMsg(null);
          setEmail(response.data.email);
          setToken(newPath);
        }
      })
      .catch(error => {
        setMsg("This link has expired or is invalid. ");
      });
  }, []);

  const onChange = e => {
    let input = e.target;
    let isValid = input.checkValidity();
    setPassword(prevPass => ({ ...prevPass, [input.name]: input.value }));
    if (!isValid) {
      setErrors(prevErr => ({
        ...prevErr,
        [input.name]: input.validationMessage
      }));
    } else {
      setErrors("");
    }
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
    setErrors(validationMessages);
    if (isValid) {
      //check if passwords match
      if (password.newPass !== password.confirmPass) {
        setErrors({
          newPass: "Passwords do not match.",
          confirmPass: "Passwords do not match."
        });
      } else {
        //check if the length of the pass is more than 8
        if (password.newPass.length < 8) {
          setErrors({
            newPass: "Password must be at least 8 caracters.",
            confirmPass: "Password must be at least 8 caracters."
          });
        } else {
          //update password
          let athorizedHeader = config.AuthorizationHeader();
          let body = {
            email: email,
            resetPasswordToken: userToken,
            password: password.newPass
          };
          axios
            .put("/auth/resetPass", body, athorizedHeader)
            .then(res => {
              if (res.status === 200) {
                setMsg(res.data.message);
              }
            })
            .catch(err => {
              setMsg("Sorry. Something went wrong!");
            });
        }
      }
    }
  };

  return (
    <MuiThemeProvider theme={theme}>
      <Card variant="outlined" square dark>
        {msg !== null ? (
          <p>{msg}</p>
        ) : (
          <div className="container">
            <form
              action="/"
              onSubmit={onSubmit}
              className="auth_form"
              noValidate
            >
              <h2 className="card-heading"> Provide your password</h2>
              {successMessage && (
                <p className="success-message">{successMessage}</p>
              )}
              <TextField
                required
                label="password"
                id="password"
                name="newPass"
                type="password"
                onChange={onChange}
                placeholder="Your password"
                error={Boolean(errors !== undefined)}
                helperText={errors && errors.newPass}
              />
              <TextField
                required
                label="Repeat Password"
                id="password"
                name="confirmPass"
                type="password"
                onChange={onChange}
                placeholder="Your password"
                error={Boolean(errors !== undefined)}
                helperText={errors && errors.confirmPass}
              />
              <Button variant="outlined" type="submit">
                Update Password
              </Button>
            </form>
          </div>
        )}
      </Card>
    </MuiThemeProvider>
  );
}
