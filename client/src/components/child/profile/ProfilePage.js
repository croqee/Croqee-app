import React, { Fragment, useState } from "react";
import ProfileForm from "./ProfileForm";
import { connect } from "react-redux";
import axios from "axios";
import config from "../../../modules/config";
import { getUser } from "../../../js/actions";

const ProfilePage = props => {
  const [state, setState] = useState({
    name: "",
    city: "",
    behance: "",
    instagram: "",
    facebook: "",
    website: "",
    birthDate: ""
  });
  const [toggle, setToggle] = useState({
    name: false,
    city: false,
    website: false,
    facebook: false,
    instagram: false,
    behance: false,
    birthDate: false
  });

  const onchangeHandler = e => {
    const field = e.target.name;
    const _state = state;
    _state[field] = e.target.value;
    setState(_state);
  };

  const setToggleState = name => {
    const _toggle = toggle;
    _toggle[name] = true;
    setToggle(state => {
      return {
        ...state,
        _toggle
      };
    });
  };

  const onSubmitHandler = platform => e => {
    e.preventDefault();
    let body = {
      [platform]: state[platform]
    };
    let athorizedHeader = config.AuthorizationHeader();
    axios
      .post("api/updateuser/" + props.user._id, body, athorizedHeader)
      .then(res => {
        props.getUser();
        setToggle(state => {
          return {
            ...state,
            [platform]: false
          };
        });
      })
      .catch(err => console.log(err));
  };
  return (
    <Fragment>
      <div className="profile">
        <h1>Profile</h1>
        <div className="profile__img-name-wrapper">
          <div className="profile__img-name-wrapper__img">
            <img
              src={`https://api.adorable.io/avatars/${props.user._id}`}
              alt="user profile image"
            />
            <a className="profile__img-name-wrapper__img-link">Change</a>
          </div>
          <div className="profile__img-name-wrapper__name">
            <ProfileForm
              name={"name"}
              onchange={onchangeHandler}
              onsubmit={onSubmitHandler}
              setToggleState={setToggleState}
              toggle={toggle.name}
              state={state.name}
              userProfileData={props.user.name}
            />
          </div>
        </div>
        <div className="profile__userInfo">
          <span>Email</span>
          <div className="profile__userInfo__container">
            <p>{props.user.email}</p>
          </div>
        </div>
        <ProfileForm
          name={"city"}
          onchange={onchangeHandler}
          onsubmit={onSubmitHandler}
          setToggleState={setToggleState}
          toggle={toggle.city}
          state={state.city}
          userProfileData={props.user.city}
        />
        <ProfileForm
          name={"birthDate"}
          onchange={onchangeHandler}
          onsubmit={onSubmitHandler}
          setToggleState={setToggleState}
          toggle={toggle.birthDate}
          state={state.birthDate}
          userProfileData={props.user.birthDate}
        />
        <div className="profile__links">
          <ProfileForm
            name={"website"}
            onchange={onchangeHandler}
            onsubmit={onSubmitHandler}
            setToggleState={setToggleState}
            toggle={toggle.website}
            state={state.website}
            userProfileData={props.user.website}
          />
          <ProfileForm
            name={"facebook"}
            onchange={onchangeHandler}
            onsubmit={onSubmitHandler}
            setToggleState={setToggleState}
            toggle={toggle.facebook}
            state={state.facebook}
            userProfileData={props.user.facebook}
          />
          <ProfileForm
            name={"behance"}
            onchange={onchangeHandler}
            onsubmit={onSubmitHandler}
            setToggleState={setToggleState}
            toggle={toggle.behance}
            state={state.behance}
            userProfileData={props.user.behance}
          />
          <ProfileForm
            name={"instagram"}
            onchange={onchangeHandler}
            onsubmit={onSubmitHandler}
            setToggleState={setToggleState}
            toggle={toggle.instagram}
            userProfileData={props.user.instagram}
          />
        </div>
      </div>
    </Fragment>
  );
};

const mapStateToProps = state => {
  const user = state.user;
  return { user };
};
const mapDispatchToProps = dispatch => {
  return {
    getUser: () => dispatch(getUser())
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
