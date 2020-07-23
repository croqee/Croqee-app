import React from "react";
import Links from "../navbar/Links";
import Social from "../navbar/Social";
import ContactInfo from "../navbar/ContactInfo";
import { TextField } from "@material-ui/core";

export default function Footer() {
  return (
    <footer
      className="footer
    "
    >
      <div className="footer-top">
        <div className="footer-top--newsLetter">
          <h3>Sign up and join the Croqee Community!</h3>
          <div className="footer-top--newsLetter-form">
            <form>
              <input
                className="footer-top--newsLetter-input"
                type="text"
                placeholder="Enter e-mail address"
              />
              <button type="submit" className="footer-top--newsLetter-btn">
                <span className="footer-top--newsLetter-btn-text">Sign Up</span>
              </button>
            </form>
          </div>
          <small>
            *By signing up to our newletter you agree to our terms & conditions.
          </small>
        </div>
        <div className="footer-top-contact">
          <img src={require("../../../img/logo-vw.svg")} />
          <ContactInfo />
        </div>

        <div className="footer-top-links">
          <Links />
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-bottom-social">
          <Social />
        </div>
        <div className="footer-bottom-copy">
          &#169;Copyright Croqee {new Date().getFullYear()}. All rights
          reserved.
        </div>
        <div className="footer-bottom-love">Made by Croqee team with love</div>
      </div>
    </footer>
  );
}
