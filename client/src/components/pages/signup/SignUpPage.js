import React from "react";
import SignUpForm from "./SignUpForm.js";
import Auth from "../../../modules/Auth";
import { Link } from "react-router-dom";
import config from "../../../modules/config";
import axios from "axios";
import { Card, Button, Typography } from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { theme } from "../../child/MuiTheme";
import { GoogleLogin } from "react-google-login";
import { googleApiKey } from "../../../clientglobalvariables";
import {
  setUser,
  getUser,
  setPageToNavigateAfterLogin
} from "../../../state-manager/actions";
import { connect } from "react-redux";

class SignUpPage extends React.Component {
  /**
   * Class constructor.
   */
  constructor(props, context) {
    super(props, context);

    // set the initial component state
    this.state = {
      errors: {},
      user: {
        email: "",
        name: "",
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


    let UnAthorizedHeader = config.UnAthorizedHeader();

    axios
      .post("/auth/signup", this.state.user, UnAthorizedHeader)
      .then(response => {
        this.setState({
          errors: {}
        });
        localStorage.setItem("successMessage", response.data.message);
        return this.props.history.push("/login");
      })
      .catch(error => {
        let { errors } = error.response.data;
        this.setState({
          errors
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

  /**
   * Render the component.
   */
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Card variant="outlined" square>
          <SignUpForm
            onSubmit={this.processForm}
            onChange={this.changeUser}
            errors={this.state.errors}
            user={this.state.user}
          />
          <GoogleLogin
            clientId={googleApiKey}
            render={renderProps => (
              <Button
                variant="contained"
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                startIcon={<i className="fab fa-google"></i>}
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
        </Card>
        <Typography variant="caption" display="block" gutterBottom>
          Already a member? <Link to={"/signin"}>Login</Link>.
        </Typography>
      </MuiThemeProvider>
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

export default connect(mapStateToProps, mapDispatchToProps)(SignUpPage);
