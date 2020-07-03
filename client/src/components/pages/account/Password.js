import React, { Component, Fragment } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Divider } from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { theme } from "../../child/MuiTheme";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import axios from "axios";
import config from "../../../modules/config";
export default class Password extends Component {
  constructor() {
    super();
    this.state = {
      radioValue: null,
      helperText: "",
      isPasswordNull: true,
      password: {
        currentPass: "",
        newPassword: "",
        repeatNewPass: ""
      },
      _errors: ""
    };
  }
  //Check if the password is null or not (if it's null it means that user does not have any local account registered)
  componentDidMount() {
    let athorizedHeader = config.AuthorizationHeader();
    axios
      .get("/api/password", athorizedHeader)
      .then(res => {
        this.setState({
          isPasswordNull: res.data
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  onchange = e => {
    let value = e.target.value;
    let input = e.target;
    const isValid = input.checkValidity();
    this.setState({
      password: {
        [e.target.name]: value
      }
    });
    if (!isValid) {
      this.setState(prevState => ({
        _errors: {
          ...prevState._errors,
          [input.name]: input.validationMessage
        }
      }));
    } else {
      this.setState(prevState => ({
        ...prevState,
        _errors: {
          ...prevState._errors,
          [input.name]: ""
        }
      }));
    }
  };
  handleRadioChange = value => {
    this.setState({
      radioValue: value
    });
  };
  handleSubmit = () => {
    console.log("submitting");
  };

  handleChangePassword = e => {
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
    this.setState({
      _errors: validationMessages
    });

    if (isValid) {
      if (
        this.state.password.currentPass !== this.state.password.repeatNewPass
      ) {
        this.setState({
          _errors: {
            newPass: "Passwords do not match.",
            repeatNewPass: "Passwords do not match."
          }
        });
      } else {
        console.log("yes");
      }
    }
  };

  render() {
    return (
      <Fragment>
        <MuiThemeProvider theme={theme}>
          <div className="security">
            <h2>Password and Security</h2>
            <Divider light="true" />

            <h3>Change Password</h3>
            {this.state.isPasswordNull && (
              <FormHelperText>
                It seems like you don not have any local account registered. To
                change your password please create an account locally.
              </FormHelperText>
            )}

            <form
              noValidate
              className="security__change_password"
              onSubmit={this.handleChangePassword}
            >
              <TextField
                required
                light
                type="password"
                className="security__change_password__field"
                onChange={this.onchange}
                name="currentPass"
                id="filled-error"
                placeholder="Your Current Password"
                disabled={this.state.isPasswordNull}
                error={Boolean(Object.keys(this.state._errors).length !== 0)}
                helperText={
                  this.state._errors.currentPass !== undefined &&
                  this.state._errors.currentPass
                }
              />
              <TextField
                required
                type="password"
                className="security__change_password__field"
                type="password"
                onChange={this.onchange}
                name="newPassword"
                id="filled-error"
                placeholder="Your New Password"
                disabled={this.state.isPasswordNull}
                error={Boolean(Object.keys(this.state._errors).length !== 0)}
                helperText={
                  this.state._errors.newPassword !== undefined &&
                  this.state._errors.newPassword
                }
              />
              <TextField
                required
                type="password"
                className="security__change_password__field"
                onChange={this.onchange}
                name="repeatNewPass"
                id="filled-error"
                placeholder="Confrim Your New Password"
                disabled={this.state.isPasswordNull}
                error={Boolean(Object.keys(this.state._errors).length !== 0)}
                helperText={
                  this.state._errors.repeatNewPass !== undefined &&
                  this.state._errors.repeatNewPass
                }
              />
              <Button
                type="submit"
                variant="outlined"
                disabled={this.state.isPasswordNull || this.state.error}
              >
                Update Password
              </Button>
            </form>
            <Divider light />
            <div className="security__change_password">
              <h3>Delete Account</h3>
              <form onSubmit={this.handleSubmit}>
                <FormControl component="fieldset" error={this.state.error}>
                  <span>
                    By deleting your accout you will also delete all the data
                    that is assosiated with your account and this action can not
                    be undone. Are your sure you want to delete your account?
                  </span>
                  <RadioGroup
                    aria-label="delete account"
                    name="delete account"
                    onChange={this.handleRadioChange}
                  >
                    <FormControlLabel
                      value="yes"
                      control={<Radio />}
                      label="Yes, I am."
                    />
                  </RadioGroup>
                  <Button
                    type="submit"
                    variant="outlined"
                    disabled={Boolean(this.state.radioValue === null)}
                  >
                    Delete My Account
                  </Button>
                </FormControl>
              </form>
            </div>
          </div>
        </MuiThemeProvider>
      </Fragment>
    );
  }
}
