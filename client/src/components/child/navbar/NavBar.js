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
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";

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
      <div className="nav">
        <input type="checkbox" id="nav-check" />
        <h1 className="nav-header">
          <img src={logo} id="logo" alt="Croqee logo" className="nav-title" />
          <span style={{ fontSize: "0rem" }}>Croqee</span>
        </h1>
        <button type="button" class="hamburger ">
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
              to="/competes"
              style={activePage.includes("/compete") ? styles.orange : {}}
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
            <div className="nav-contact">
              <p>info@crooqi.com</p>
              <p>+45 888 665 554</p>
            </div>
            <div className="nav-contact-icons">
              <i fa-5x className="fab fa-instagram"></i>
              <i fa-5x className="fab fa-facebook-f"></i>
              <i fa-5x className="fab fa-youtube"></i>
            </div>
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
            <button className="nav-links-btn">
              <span className="nav-links-btn-text">Draw and compete</span>
            </button>

            <div className="nav-contact">
              <p>info@crooqi.com</p>
              <p>+45 888 665 554</p>
            </div>
            <div className="nav-contact-icons">
              <i fa-5x size="7x" className="fab fa-instagram"></i>
              <i fa-5x className="fab fa-facebook-f"></i>
              <i fa-5x className="fab fa-youtube"></i>
              <i fa-5x className="fab fa-twitter"></i>
            </div>
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
