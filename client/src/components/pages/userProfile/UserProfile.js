import React, { Fragment, Component } from "react";
import { connect } from "react-redux";
import { getUsersScore, getScoredModels } from "../../../js/actions";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";
import axios from "axios";
import config from "../../../modules/config";

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userRank: "",
      userScore: "",
      userInfo: {},
    };
    this.props.getUsersScore(1);
  }

  componentDidMount() {
    const paramsId = this.props.location.pathname.substring(13);
    let athorizedHeader = config.AuthorizationHeader();
    axios
      .get("/api/user/" + paramsId, athorizedHeader)
      .then((res) => {
        this.setState({
          userInfo: res.data,
        });
      })
      .catch((err) => console.log(err));
  }
  componentDidUpdate(prevProps) {
    if (this.props.usersScore !== prevProps.usersScore) {
      const paramsId = this.props.location.pathname.substring(13);
      this.props.usersScore.data.map((user, i) => {
        if (user._id === paramsId) {
          this.setState({
            userRank: user.rank,
            userScore: user.total,
          });
        }
      });
    }
  }
  render() {
    const { userInfo, userRank, userScore } = this.state;
    return (
      <Fragment>
        {userInfo && (
          <div className="userProfile">
            <div className="profile">
              <div className="profile__img-name-wrapper">
                <div className="profile__img-name-wrapper__img">
                  <img
                    src={`https://api.adorable.io/avatars/${1}`}
                    alt="user profile image"
                  />
                </div>
                <div className="profile__img-name-wrapper__name">
                  <span>Name</span>
                  <h1>{userInfo.name}</h1>
                </div>
              </div>
              <div className="profile__ranking">
                <h2>
                  Rank #
                  <span className="profile__ranking__highlight">
                    {userRank}
                  </span>
                </h2>
                <h2>
                  Score{" "}
                  <span className="profile__ranking__highlight">
                    {userScore}
                  </span>
                </h2>
              </div>
              <div className="profile__userInfo">
                <span>Email</span>
                <div className="profile__userInfo__container">
                  <p>{userInfo.email}</p>
                </div>
              </div>
              <div className="profile__userInfo">
                <span>Location</span>
                <div className="profile__userInfo__container">
                  <p>{userInfo.city}</p>
                </div>
              </div>
              <div className="profile__userInfo">
                <span>Birthdate</span>
                <div className="profile__userInfo__container">
                  <p>
                    {userInfo.birthDate && userInfo.birthDate.substring(0, 10)}
                  </p>
                </div>
              </div>
              <div className="profile__links">
                <p>Links</p>
              </div>
              {userInfo.behance !== undefined && (
                <a href={userInfo.behance}>
                  <i
                    className={"fab fa-2x fa-behance"}
                    style={{ margin: "1rem" }}
                  />
                </a>
              )}
              {userInfo.facebook !== undefined && (
                <a href={userInfo.facebook}>
                  <i
                    className={"fab fa-2x fa-facebook"}
                    style={{ color: "#4267B2", margin: "1rem" }}
                  />
                </a>
              )}
              {userInfo.instagram !== undefined && (
                <a href={userInfo.instagram}>
                  <i
                    className={"fab fa-2x fa-instagram"}
                    style={{ color: "#fa7e1e", margin: "1rem" }}
                  />
                </a>
              )}
              {userInfo.website !== undefined && (
                <a href={userInfo.website}>
                  <i
                    className={"far fa-2x fa-user-circle"}
                    style={{ color: "#d62976", margin: "1rem" }}
                  />
                </a>
              )}
            </div>
          </div>
        )}
      </Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  const { usersScore, user } = state;
  return { usersScore, user };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getUsersScore: (page) => dispatch(getUsersScore(page)),
    getScoredModels: () => dispatch(getScoredModels()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
