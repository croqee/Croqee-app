import React, { PropTypes } from "react";
import Auth from "../../../modules/Auth";
import LoginForm from "./LoginForm.js";
import { Redirect, Link } from "react-router-dom";
import config from "../../../modules/config";
import axios from "axios";
import { connect } from "react-redux";
import {
  setUser,
  getUser,
  setPageToNavigateAfterLogin
} from "../../../js/actions";
import { GoogleLogin } from "react-google-login";
import { googleApiKey } from "../../../clientglobalvariables";
import { facebookAppId } from "../../../clientglobalvariables";
import FacebookLogin from "react-facebook-login";
import { Card, Button, Typography } from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { theme } from "../../child/MuiTheme";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";

class LoginPage extends React.Component {
  /**
   * Class constructor.
   */
  constructor(props, context) {
    super(props, context);

    const storedMessage = localStorage.getItem("successMessage");
    let successMessage = "";

    if (storedMessage) {
      successMessage = storedMessage;
      localStorage.removeItem("successMessage");
    }

    // set the initial component state
    this.state = {
      errors: {},
      successMessage,
      user: {
        email: "",
        password: ""
      }
    };

    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
  }

  /**
   * Process the form.
   *
   * @param {object} event - the JavaScript event object
   */
  processForm(event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();

    // create a string for an HTTP body message
    const email = encodeURIComponent(this.state.user.email);
    const password = encodeURIComponent(this.state.user.password);
    const body = {
      email,
      password
    };
    let UnAthorizedHeader = config.UnAthorizedHeader();
    // let formData = Object.assign({}, body, UnAthorizedHeader);

    axios
      .post("/auth/login", body, UnAthorizedHeader)
      .then(response => {
        const { token, user } = response.data;
        this.props.setUser(user);
        this.setState({
          errors: {}
        });
        Auth.authenticateUser(token);
        this.props.getUser();
        this.props.history.push(this.props.pageToNavigateAfterLogin);
        return this.props.setPageToNavigateAfterLogin("/");
      })
      .catch(error => {
        let { errors, message } = error.response.data;
        const errorLogs = errors ? errors : {};
        errorLogs.summary = message;
        this.setState({
          errors: errorLogs
        });
      });
  }

  /**
   * Change the user object.
   *
   * @param {object} event - the JavaScript event object
   */
  changeUser(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;
    this.setState({
      user
    });
  }

  responseGoogle = response => {
    axios
      .post("auth/googleauth", { googleCode: response.code })
      .then(res => {
        const { token, user } = res.data;
        this.props.setUser(user);
        this.setState({
          errors: {}
        });
        Auth.authenticateUser(token);
        this.props.getUser();
        this.props.history.push(this.props.pageToNavigateAfterLogin);
        return this.props.setPageToNavigateAfterLogin("/");
      })
      .catch(err => console.log(err));
  };

  responseFacebook = response => {
    //facebook response returns an obj which should be sent to the backend for the code to be extracted
    const code = JSON.parse(atob(response.signedRequest.split(".")[1])).code;
    console.log(code);
    axios
      .post("auth/facebookauth", { facebookCode: code })
      .then(res => {
        const { token, user } = res.data;
        this.props.setUser(user);
        this.setState({
          errors: {}
        });
        Auth.authenticateUser(token);
        this.props.getUser();
        this.props.history.push(this.props.pageToNavigateAfterLogin);
        return this.props.setPageToNavigateAfterLogin("/");
      })
      .catch(err => console.log(err));
  };
  /**
   * Render the component.
   */
  render() {
    return (
      <React.Fragment>
        <MuiThemeProvider theme={theme}>
          <Card variant="outlined" square dark>
            <LoginForm
              onSubmit={this.processForm}
              onChange={this.changeUser}
              errors={this.state.errors}
              successMessage={this.state.successMessage}
              user={this.state.user}
            />
            <GoogleLogin
              clientId={googleApiKey}
              render={renderProps => (
                <Button
                  variant="contained"
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                  startIcon={<i class="fab fa-google"></i>}
                >
                  Continue With Google
                </Button>
              )}
              onSuccess={this.responseGoogle}
              onFailure={this.responseGoogle}
              cookiePolicy={"single_host_origin"}
              responseType="code"
              accessType="offline"
            />
            <div>
              {/* <FacebookLogin
            appId={facebookAppId}
            autoLoad={false}
            size="medium"
            fields="name,email,id"
            scope="public_profile, email"
            onClick={this.componentClicked}
            callback={this.responseFacebook}
            textButton="Login to your Facebook"
            redirectUri="http://localhost:3000"
          /> */}
            </div>
          </Card>
          <div style={{ textAlign: "left", margin: "auto", width: "250px" }}>
            <Typography variant="caption" display="block">
              Don't have an account? <Link to={"/signup"}>Create one</Link>.
            </Typography>
            <Typography variant="caption" display="block" gutterBottom>
              Forgot password?{" "}
              <Link to={"/forgotpassword/link"}>Send link</Link>.
            </Typography>
          </div>
        </MuiThemeProvider>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  const { pageToNavigateAfterLogin } = state;
  return { pageToNavigateAfterLogin };
};
const mapDispatchToProps = dispatch => {
  return {
    getUser: () => dispatch(getUser()),
    setUser: user => dispatch(setUser(user)),
    setPageToNavigateAfterLogin: payload =>
      dispatch(setPageToNavigateAfterLogin(payload))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
