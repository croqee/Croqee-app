import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import axios from "axios";
import config from "../../../modules/config";
import { getUser } from "../../../js/actions";

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      city: "",
      birthDate: "",
      toggle: {
        name: false,
        city: false,
        birthDate: false
      }
    };
  }
  onChangeHandler = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  submitHandler = val => e => {
    e.preventDefault();
    let athorizedHeader = config.AuthorizationHeader();
    axios
      .post("api/updateuser/" + this.props.user._id, val, athorizedHeader)
      .then(res => {
        this.props.getUser();
        this.setState({
          toggle: {
            name: false,
            city: false,
            birthDate: false
          }
        });
      })
      .catch(err => console.log(err));
  };
  render() {
    return (
      <div className="account__profile">
        <h1>Profile</h1>
        <div className="account__profile__img-name-wrapper">
          <div className="account__profile__img-name-wrapper__img">
            <img
              src={`https://api.adorable.io/avatars/${this.props.user._id}`}
              alt="user profile image"
            />
            <a className="account__profile__img-name-wrapper__img-link">
              Change
            </a>
          </div>

          <div className="account__profile__img-name-wrapper__name">
            <span>Name</span>
            {this.state.toggle.name ? (
              <form
                className="account__profile__userInfo__container__form"
                onSubmit={this.submitHandler({ name: this.state.name })}
              >
                <input
                  type="text"
                  placeholder="What's your name?"
                  className="account__profile__userInfo__container__form__input"
                  onChange={this.onChangeHandler}
                  name="name"
                />
                <button
                  type="submit"
                  className="account__profile__userInfo__container__form__btn"
                >
                  Update
                </button>
              </form>
            ) : (
              <div className="account__profile__img-name-wrapper__name-container">
                <h2>{this.props.user.name}</h2>
                <a
                  className="account__profile__img-name-wrapper__name-container__btn"
                  onClick={() => {
                    this.setState({
                      toggle: {
                        name: true
                      }
                    });
                  }}
                >
                  Edit
                </a>
              </div>
            )}
          </div>
        </div>
        <div className="account__profile__email">
          <span>Email</span>
          <div className="account__profile__email__container">
            <p>{this.props.user.email}</p>
          </div>
        </div>
        <div className="account__profile__userInfo">
          <span>City</span>
          <div className="account__profile__userInfo__container">
            {this.state.toggle.city ? (
              <form
                className="account__profile__userInfo__container__form"
                onSubmit={this.submitHandler({ city: this.state.city })}
              >
                <input
                  type="text"
                  placeholder="Where are you based?"
                  className="account__profile__userInfo__container__form__input"
                  onChange={this.onChangeHandler}
                  name="city"
                />
                <button
                  type="submit"
                  className="account__profile__userInfo__container__form__btn"
                >
                  Update
                </button>
              </form>
            ) : (
              <Fragment>
                <p>{this.props.user.city} </p>
                <a
                  onClick={() => {
                    this.setState({
                      toggle: {
                        city: true
                      }
                    });
                  }}
                >
                  Edit
                </a>
              </Fragment>
            )}
          </div>
        </div>
        <div className="account__profile__birth-date">
          <span>Date of Birth</span>
          <div className="account__profile__birth-date__container">
            {this.state.toggle.birthDate ? (
              <form
                className="account__profile__userInfo__container__form"
                onSubmit={this.submitHandler({
                  birthDate: this.state.birthDate
                })}
              >
                <input
                  type="text"
                  placeholder="When are you born?"
                  className="account__profile__userInfo__container__form__input"
                  onChange={this.onChangeHandler}
                  name="birthDate"
                />
                <button
                  type="submit"
                  className="account__profile__userInfo__container__form__btn"
                >
                  Update
                </button>
              </form>
            ) : (
              <Fragment>
                <p>{this.props.user.birthDate}</p>
                <a
                  onClick={() => {
                    this.setState({
                      toggle: {
                        birthDate: true
                      }
                    });
                  }}
                >
                  Edit
                </a>
              </Fragment>
            )}
          </div>
        </div>
        <div className="account__profile__links"></div>
      </div>
    );
  }
}

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
