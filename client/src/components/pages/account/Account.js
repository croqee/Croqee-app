import React, { Fragment } from "react";
import { connect } from "react-redux";
import AccountSideNav from "./AccountSideNav";

function Account(props) {
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
