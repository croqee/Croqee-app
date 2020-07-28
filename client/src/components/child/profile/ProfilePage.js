import React, { Fragment, useState } from "react";
import ProfileForm from "./ProfileForm";
import { connect } from "react-redux";
import axios from "axios";
import config from "../../../modules/config";
import { getUser } from "../../../js/actions";
import ProfileBirthDateForm from "./ProfileBirthDateForm";
import ProfileUsernameForm from "./ProfileUsernameForm";
import ProfileCityForm from "./ProfileCityForm";
import ProfileImgForm from "./ProfileImgForm";
import { Typography } from "@material-ui/core";

const ProfilePage = props => {
  const [state, setState] = useState({
    name: props.user.name,
    city: props.user.city,
    behance: props.user.behance,
    instagram: props.user.instagram,
    facebook: props.user.facebook,
    website: props.user.website,
    birthDate: new Date(),
    image: props.user.img,
    _errors: {}
  });
  const [toggle, setToggle] = useState({
    name: false,
    city: false,
    website: false,
    facebook: false,
    instagram: false,
    behance: false,
    birthDate: false,
    image: false
  });

  const onchangeHandler = e => {
    const input = e.target;
    const isValid = input.checkValidity();
    const field = input.name;
    const _state = state;
    _state[field] = input.value;
    setState(_state);
    if (!isValid) {
      setState(prevState => ({
        _errors: {
          ...prevState._errors,
          [input.name]: input.validationMessage
        }
      }));
    } else {
      setState(prevState => ({
        ...prevState,
        _errors: {
          ...prevState._errors,
          [input.name]: ""
        }
      }));
    }
  };

  const setToggleState = (name, bool) => {
    const _toggle = toggle;
    _toggle[name] = bool;
    setToggle(state => {
      return {
        ...state,
        _toggle
      };
    });
  };

  const onSubmitHandler = platform => e => {
    e.preventDefault();
    const form = e.target;
    const isValid = form.checkValidity();
    const formData = new FormData(form);
    const validationMessages = Array.from(formData.keys()).reduce(
      (acc, key) => {
        acc[key] = form.elements[key].validationMessage;
        return acc;
      },
      {}
    );
    setState({
      _errors: validationMessages
    });

    if (isValid) {
      let body = {
        [platform]: state[platform]
      };
      let athorizedHeader = config.AuthorizationHeader();
      axios
        .post("/api/updateuser/" + props.user._id, body, athorizedHeader)
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
    }
  };
  return (
    <Fragment>
      <div className="profile">
        <h2>Profile</h2>
        <div className="profile__img-name-wrapper">
          <ProfileImgForm
            name={"image"}
            setToggleState={setToggleState}
            toggle={toggle.image}
            state={state.image}
          />
          <div className="profile__img-name-wrapper__name">
            <ProfileUsernameForm
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
            <Typography variant="body2" style={{ fontSize: "1rem" }}>
              {props.user.email}
            </Typography>
          </div>
        </div>
        <ProfileCityForm
          name={"city"}
          setToggleState={setToggleState}
          toggle={toggle.city}
          state={state.city}
        />
        <ProfileBirthDateForm
          name={"birthDate"}
          setToggleState={setToggleState}
          toggle={toggle.birthDate}
          state={state.birthDate}
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
            _errors={state._errors}
          />
          <ProfileForm
            name={"facebook"}
            onchange={onchangeHandler}
            onsubmit={onSubmitHandler}
            setToggleState={setToggleState}
            toggle={toggle.facebook}
            state={state.facebook}
            userProfileData={props.user.facebook}
            _errors={state._errors}
          />
          <ProfileForm
            name={"behance"}
            onchange={onchangeHandler}
            onsubmit={onSubmitHandler}
            setToggleState={setToggleState}
            toggle={toggle.behance}
            state={state.behance}
            userProfileData={props.user.behance}
            _errors={state._errors}
          />
          <ProfileForm
            name={"instagram"}
            onchange={onchangeHandler}
            onsubmit={onSubmitHandler}
            setToggleState={setToggleState}
            toggle={toggle.instagram}
            userProfileData={props.user.instagram}
            _errors={state._errors}
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
