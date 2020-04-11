import React, { Fragment } from "react";
import { connect } from "react-redux";

function Account(props) {
  return (
    <Fragment>
      <div className="account">
        <div className="account__sideNav">
          <a>Profile</a>
          <a>Password and Security</a>
          <a>Privacy</a>
        </div>
        <div className="account__profile">
          <h1>Profile</h1>
          <div className="account__profile__img-name-wrapper">
            <div className="account__profile__img-name-wrapper__img">
              <img
                src={`https://api.adorable.io/avatars/${props.user._id}`}
                alt="user profile image"
              />
              <a className="account__profile__img-link">Change</a>
            </div>
            <div className="account__profile__img-name-wrapper__name">
              <span>Name</span>
              <h2>{props.user.name}</h2>
            </div>
          </div>
          <div className="account__profile__email">
            <span>Email</span>
            <div className="account__profile__email__container">
              <p>{props.user.email}</p>
            </div>
          </div>
          <div className="account__profile__adress">
            <span>City</span>
            <div className="account__profile__adress__container">
              <p>Add your city</p>
              <a>Edit</a>
            </div>
          </div>
          <div className="account__profile__birth-date">
            <span>Date of Birth</span>
            <div className="account__profile__birth-date__container">
              <p>Add your date of birth</p>
              <a>Edit</a>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

const mapStateToProps = state => {
  const user = state.user;
  return { user };
};

export default connect(mapStateToProps, null)(Account);
