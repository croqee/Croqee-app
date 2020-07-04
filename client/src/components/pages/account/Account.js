import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import ProfilePage from "../../child/profile/ProfilePage";
import AccountSideNav from "./AccountSideNav";

function Account(props) {
  console.log(props);
  return (
    <Fragment>
      <div className="account">
        <AccountSideNav />
      </div>
    </Fragment>
  );
}

const mapStateToProps = state => {
  const user = state.user;
  return { user };
};

export default connect(mapStateToProps, null)(Account);
