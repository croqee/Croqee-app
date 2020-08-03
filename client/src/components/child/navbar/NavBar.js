import React from "react";
import { Link } from "react-router-dom";
import logo from "../../../img/logo-vw.svg";
import { connect } from "react-redux";
import { getUser } from "../../../js/actions";
import NavbarContact from "./NavbarContact";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";
import ActionBtnNav from "./ActionBtnNav";
import { Avatar } from "@material-ui/core";
import default_image from '../../../img/default-image.png';
import { makeStyles } from '@material-ui/core/styles';
import { theme } from '../profile/ProfileImgForm'



class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: this.props.history.location.pathname,
      isChecked: false
    };
  }
  componentDidMount() {
    this.props.getUser();
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps !== this.props) {
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

    if (!this.state.isChecked) {
      document.documentElement.style.overflow = "scroll";
    } else {
      document.documentElement.style.overflow = "hidden";
    }
  }

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
              style={activePage === "/" ? styles.orange : {}}
            >
              Home
            </Link>
            <Link
              className="nav-link"
              to="/leaderboard"
              style={activePage === "/leaderboard" ? styles.orange : {}}
            >
              Leaderboard
            </Link>
            <Link
              className="nav-link"
              to="/account/profile"
              style={activePage.indexOf("/account") !== -1 ? styles.orange : {}}
            >
              <div className="profile-nav">
                <div className="user-img">
                  {this.props.user.img ? (<Avatar src={"/user-image/" + this.props.user.img.image_data} alt="profile image" />) : (<Avatar src={default_image} alt="profile image" />)}
                </div>
                <div className="profile-list">
                  <div className="user-info">
                    <div className="user-img medium" >
                      {this.props.user.img ? (<Avatar src={"/user-image/" + this.props.user.img.image_data} alt="profile image" />) : (<Avatar src={default_image} alt="profile image" />)}
                    </div>
                    <div className="user-details">
                      <ul>
                        <li style={{ textTransform: 'capitalize', fontSize: '18px' }}>{this.props.user.name}</li>
                        <li>{this.props.user.email}</li>
                        <li>score:10</li>
                      </ul>
                    </div>

                  </div>
                  <div className="profile-links">
                    <ul>
                      <li><Link to={`/userprofile/${this.props.user._id}`}>Croqee profile</Link></li>
                      <li><Link to="/account/password">Account Settings</Link></li>
                      <li><Link to="/account/privacy">Privacy</Link></li>
                      <li><Link to="/LogOut">Sign Out</Link></li>
                    </ul>

                  </div>

                </div>
              </div>
            </Link>


            <ActionBtnNav
              onclick={() => {
                this.props.history.push("/competes");
              }}
              endIcon={
                <i
                  style={{ marginLeft: "0.5rem" }}
                  className="fas fa-arrow-right"
                ></i>
              }
              btnText={" Draw and compete"}
            />
            <NavbarContact />
          </div>
        ) : (
            <div className="nav-links">
              <Link
                className="nav-link"
                to="/"
                style={activePage === "/" ? styles.orange : {}}
              >
                Home
            </Link>

              <Link
                className="nav-link"
                to="/signup"
                style={activePage === "/signup" ? styles.orange : {}}
              >
                Sign up
            </Link>
              <Link
                className="nav-link"
                to="/login"
                style={activePage === "/login" ? styles.orange : {}}
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
