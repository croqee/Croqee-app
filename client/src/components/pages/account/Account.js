import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import ProfilePage from "./ProfilePage";

function Account(props) {
  return (
    <Fragment>
      <div className="account">
        <div className="account__sideNav">
          <a>Profile</a>
          <a>Password and Security</a>
          <a>Privacy</a>
        </div>
        <ProfilePage />
      </div>
    </Fragment>
  );
}

const mapStateToProps = state => {
  const user = state.user;
  return { user };
};

export default connect(mapStateToProps, null)(Account);
