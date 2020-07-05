import React from "react";
import { NavLink } from "react-router-dom";

export default function AccountSideNav() {
  return (
    <div className="account__sideNav">
      <NavLink
        to="/account/profile"
        className="account__sideNav__unActive"
        activeClassName="account__sideNav__active"
      >
        Profile
      </NavLink>
      <NavLink
        to="/account/password"
        className="account__sideNav__unActive"
        activeClassName="account__sideNav__active"
      >
        Password and Security
      </NavLink>
      <NavLink
        to="/account/privacy"
        className="account__sideNav__unActive"
        activeClassName="account__sideNav__active"
      >
        Privacy
      </NavLink>
    </div>
  );
}
