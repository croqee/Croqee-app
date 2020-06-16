import React, { Fragment } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { theme } from "./ProfileBirthDateForm";

export default function ProfileUsernameForm({
  onchange,
  onsubmit,
  setToggleState,
  name,
  toggle,
  userProfileData,
  state,
}) {
  return (
    <Fragment>
      <div className="profile__userInfo">
        <span>{name.charAt(0).toUpperCase() + name.slice(1)}</span>
        <div className="profile__userInfo__container">
          {toggle ? (
            <form
              className="profile__userInfo__container__form"
              onSubmit={onsubmit(name)}
            >
              <MuiThemeProvider theme={theme}>
                <TextField
                  type="text"
                  className="profile__userInfo__container__form__input"
                  onChange={onchange}
                  name={name}
                  error={state === ""}
                  defaultValue={state}
                  placeholder={
                    state === undefined || "" ? `Enter your ${name}` : ""
                  }
                />
              </MuiThemeProvider>
              <button
                type="submit"
                className="profile__userInfo__container__form__btn"
              >
                Update
              </button>
            </form>
          ) : (
            <Fragment>
              <p>
                {userProfileData
                  ? userProfileData
                  : `Link your ${name} account`}
              </p>

              <a
                onClick={() => {
                  setToggleState(name, true);
                }}
              >
                Edit
              </a>
            </Fragment>
          )}
        </div>
      </div>
    </Fragment>
  );
}
