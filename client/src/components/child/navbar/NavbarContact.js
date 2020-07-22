import React, { Fragment } from "react";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect,
  withRouter
} from "react-router-dom";

export default function NavbarContact() {
  return (
    <Fragment>
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
      <div className="nav-contact-links">
        <Link to="#">Contact</Link>
        <Link to="#">Privacy policy</Link>
        <Link to="#">Terms & Conditions</Link>
      </div>
    </Fragment>
  );
}
