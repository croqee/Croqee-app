import React from "react";
import Links from "../navbar/Links";
import Social from "../navbar/Social";
import ContactInfo from "../navbar/ContactInfo";
import { TextField } from "@material-ui/core";
//import { theme } from "../MuiTheme";
import { MuiThemeProvider } from "@material-ui/core/styles";
import ActionBtnNav from "../navbar/ActionBtnNav";
import { createMuiTheme } from "@material-ui/core/styles";

export const theme = createMuiTheme({
  overrides: {
    MuiInput: {
      underline: {
        "&:hover:not(.Mui-disabled):before": {
          borderBottom: "none"
        },
        "&:hover:not($disabled):not($error):before": {
          borderBottom: "none"
        },
        "&:before": {
          borderBottom: "none"
        },
        "&:after": {
          borderBottom: "1px solid rgba(255, 255, 255, 0.82)"
        },
        color: "#b8b8b8",
        width: "265px"
      }
    },
    MuiInputBase: {
      input: {
        padding: "1rem 0",
        color: "#b8b8b8"
      }
    }
  }
});

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
              <MuiThemeProvider theme={theme}>
                <TextField
                  type="text"
                  //className="profile__userInfo__container__form__input"
                  error="false"
                  placeholder="Enter e-mail address"
                />
              </MuiThemeProvider>
              <div className="footer-top--newsLetter-form-btn">
                <ActionBtnNav btnText={"Sign Up"} />
              </div>
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
