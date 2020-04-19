import React, { Fragment } from "react";

export default function ProfileForm({
  onchange,
  onsubmit,
  setToggleState,
  name,
  toggle,
  userProfileData
}) {
  return (
    <Fragment>
      <div className="profile__userInfo">
        <span>{name}</span>
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
                value={userProfileData}
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
