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
import logo from "../../../img/logo-vw.svg";
import { connect } from "react-redux";
import { getUser, setPageToNavigateAfterLogin } from "../../../js/actions";
import NavbarContact from "./NavbarContact";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: this.props.history.location.pathname,
      isChecked: props.isChecked || false
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
    if (
      this.props.location.pathname !== prevProps.location.pathname &&
      this.state.isChecked
    ) {
      this.setState({
        isChecked: !this.state.isChecked
      });
    }
  }

  lockBgScroll = () => {
    if (document.body.scroll !== "no") {
      document.documentElement.style.overflow = "hidden";
      document.body.scroll = "no";
    } else {
      document.documentElement.style.overflow = "scroll";
      document.body.scroll = "yes";
    }
  };

  checkBoxHandler = e => {
    this.setState({ isChecked: !this.state.isChecked });
  };
  render() {
    const { activePage } = this.state;
    let styles = {
      orange: {
        color: "#ff3c00",
        fontWeight: 600
      }
    };
    return (
      <div className="nav">
        <input
          type="checkbox"
          id="nav-check"
          checked={this.state.isChecked}
          value={this.state.isChecked}
          onChange={this.checkBoxHandler}
        />
        <h1 className="nav-header">
          <img
            src={logo}
            id="logo"
            alt="Croqee logo"
            className="nav-header-title"
          />
          <span style={{ fontSize: "0rem" }}>Croqee</span>
        </h1>
        <button type="button" className="hamburger" onClick={this.lockBgScroll}>
          <label htmlFor="nav-check">
            <span className="hamburger-box">
              <span className="hamburger-inner"></span>
            </span>
          </label>
        </button>
        {this.props.isAuthenticated ? (
          <div className="nav-links">
            <Link
              className="nav-link"
              to="/"
              style={activePage == "/" ? styles.orange : {}}
            >
              Home
            </Link>
            <Link
              className="nav-link"
              to="/account/profile"
              style={activePage.indexOf("/account") !== -1 ? styles.orange : {}}
            >
              {this.props.user.name}
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
            <button
              className="nav-links-btn"
              onClick={() => {
                this.props.history.push("/competes");
              }}
            >
              <span className="nav-links-btn-text">
                Draw and compete
                <i
                  fa-5x
                  style={{ marginLeft: "0.5rem" }}
                  className="fas fa-arrow-right"
                ></i>
              </span>
            </button>
            <NavbarContact />
          </div>
        ) : (
          <div className="nav-links">
            <Link
              className="nav-link"
              to="/"
              style={activePage == "/" ? styles.orange : {}}
            >
              Home
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

            <NavbarContact />
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
