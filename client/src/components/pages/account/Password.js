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
import Chip from "@material-ui/core/Chip";
import DoneIcon from "@material-ui/icons/Done";
import CloseIcon from "@material-ui/icons/Close";
import Auth from "../../../modules/Auth";
import { connect } from "react-redux";
import { authenticate, setUser } from "../../../js/actions";

class Password extends Component {
  constructor() {
    super();
    this.state = {
      radioValue: null,
      helperText: "",
      isPasswordNull: true,
      msg: "",
      passwordError: "",
      deleteError: "",
      password: {
        currentPassword: "",
        newPassword: "",
        repeatNewPassword: ""
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
    let input = e.target;
    const isValid = input.checkValidity();
    this.setState(prevState => ({
      msg: "",
      err: "",
      password: {
        ...prevState.password,
        [input.name]: input.value
      }
    }));
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
  handleSubmit = e => {
    e.preventDefault();
    let athorizedHeader = config.AuthorizationHeader();
    axios
      .delete("/api/account", athorizedHeader)
      .then(res => {
        Auth.deauthenticateUser();
        this.props.authenticate(false);
        this.props.setUser({});
        this.props.history.push("/");
      })
      .catch(err => {
        this.setState({
          deleteError: err
        });
      });
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
      //check if passwords match
      if (
        this.state.password.newPassword !==
        this.state.password.repeatNewPassword
      ) {
        this.setState({
          _errors: {
            newPassword: "Passwords do not match.",
            repeatNewPass: "Passwords do not match."
          }
        });
      } else {
        //check if the length of the pass is more than 8
        if (this.state.password.newPassword.length < 8) {
          this.setState({
            _errors: {
              newPassword: "Password must be at least 8 caracters.",
              repeatNewPass: "Password must be at least 8 caracters."
            }
          });
        } else {
          //update password
          let athorizedHeader = config.AuthorizationHeader();
          let passwordObj = {
            currentPassword: this.state.password.currentPassword,
            newPassword: this.state.password.newPassword
          };
          axios
            .post("/api/password", passwordObj, athorizedHeader)
            .then(res => {
              if (res.status === 200) {
                this.setState({
                  msg: "Updated",
                  password: {
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                  }
                });
              }
            })
            .catch(err => {
              console.log(err);
              this.setState({
                passwordError: err.response.data.error
              });
            });
        }
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
            {this.state.msg !== "" && (
              <Chip
                size="medium"
                label={this.state.msg}
                disabled
                icon={<DoneIcon />}
                color="#00FF00"
                style={{ color: "#00FF00", width: "260px", margin: "1rem 0" }}
                variant="outlined"
              />
            )}
            {this.state.passwordError !== "" && (
              <Chip
                size="medium"
                label={this.state.passwordError}
                disabled
                icon={<CloseIcon />}
                style={{ color: "#FF0000", width: "260px", margin: "1rem 0" }}
                variant="outlined"
              />
            )}
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
                name="currentPassword"
                id="filled-error"
                placeholder="Your Current Password"
                disabled={this.state.isPasswordNull}
                error={Boolean(Object.keys(this.state._errors).length !== 0)}
                helperText={
                  this.state._errors.currentPassword !== undefined &&
                  this.state._errors.currentPassword
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
                name="repeatNewPassword"
                id="filled-error"
                placeholder="Confrim Your New Password"
                disabled={this.state.isPasswordNull}
                error={Boolean(Object.keys(this.state._errors).length !== 0)}
                helperText={
                  this.state._errors.repeatNewPassword !== undefined &&
                  this.state._errors.repeatNewPassword
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
              {this.state.deleteError !== "" && (
                <Chip
                  size="medium"
                  label={this.state.deleteError}
                  disabled
                  icon={<CloseIcon />}
                  style={{ color: "#FF0000", width: "260px", margin: "1rem 0" }}
                  variant="outlined"
                />
              )}
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
const mapDispatchToProps = dispatch => {
  return {
    authenticate: payload => dispatch(authenticate(payload)),
    setUser: payload => dispatch(setUser(payload))
  };
};

export default connect(null, mapDispatchToProps)(Password);
