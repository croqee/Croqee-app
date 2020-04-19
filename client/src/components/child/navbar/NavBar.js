import React from "react";
import Auth from "../../../modules/Auth";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect,
  withRouter
} from "react-router-dom";
import logo from "../../../img/logo.svg";
import { connect } from "react-redux";
import { getUser, setPageToNavigateAfterLogin } from "../../../js/actions";

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: this.props.history.location.pathname
    };
  }
  componentDidMount() {
    this.props.getUser();
  }
  componentDidUpdate(prevProps) {
    if (prevProps != this.props) {
      this.setState({
        activePage: this.props.history.location.pathname
      });
    }
  }

  render() {
    const { activePage } = this.state;
    let styles = {
      orange: {
        color: "#ff5200",
        fontWeight: 600
      }
    };
    return (
      <div class="nav">
        <input type="checkbox" id="nav-check" />
        <div class="nav-header">
          <div class="nav-title">
            <img id="logo" src={logo} />
          </div>
        </div>
        <div class="nav-btn">
          <label for="nav-check">
            <span />
            <span />
            <span />
          </label>
        </div>
        {this.props.isAuthenticated ? (
          <div class="nav-links">
            <Link
              className="nav-link"
              to="/"
              style={activePage == "/" ? styles.orange : {}}
            >
              Home
            </Link>
            <Link
              className="nav-link"
              to="/account"
              style={activePage == "/account" ? styles.orange : {}}
            >
              Hello {this.props.user.name}
            </Link>
            {/* <span className="nav-links_seperator"/> */}
            <Link
              className="nav-link"
              to="/compete"
              style={activePage == "/compete" ? styles.orange : {}}
            >
              Compete
            </Link>
            <Link
              className="nav-link"
              to="/leaderboard"
              style={activePage == "/leaderboard" ? styles.orange : {}}
            >
              Leaderboard
            </Link>
            <Link className="nav-link" to="/LogOut">
              Log out
            </Link>
          </div>
        ) : (
          <div class="nav-links">
            <Link
              className="nav-link"
              to="/"
              style={activePage == "/" ? styles.orange : {}}
            >
              Home
            </Link>
            {/* <span className="nav-links_seperator"/> */}
            <Link
              className="nav-link"
              to="/compete"
              style={activePage == "/compete" ? styles.orange : {}}
            >
              Compete
            </Link>
            <Link
              className="nav-link"
              to="/signup"
              style={activePage == "/signup" ? styles.orange : {}}
            >
              Sign up
            </Link>
            <Link
              className="nav-link"
              to="/login"
              style={activePage == "/login" ? styles.orange : {}}
            >
              Login
            </Link>
          </div>
        )}
      </div>
    );
  }

}
const mapStateToProps = state => {
  const { isAuthenticated, user } = state;
  return { isAuthenticated, user };
};
const mapDispatchToProps = dispatch => {
  return {
    getUser: () => dispatch(getUser())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
