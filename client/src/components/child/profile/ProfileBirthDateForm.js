import React, { Fragment } from "react";

export default function ProfileBirthDateForm({
  onchange,
  onsubmit,
  setToggleState,
  name,
  toggle,
  userProfileData,
  state
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
              <input
                type="text"
                className="profile__userInfo__container__form__input"
                onChange={onchange}
                name={name}
                defaultValue={state}
                placeholder={
                  state === undefined || "" ? `Enter your ${name}` : ""
                }
              />
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
                  setToggleState(name);
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
