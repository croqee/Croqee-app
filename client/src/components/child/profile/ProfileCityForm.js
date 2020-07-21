import React, { Fragment, useState } from "react";
import axios from "axios";
import config from "../../../modules/config";
import { connect } from "react-redux";
import { getUser } from "../../../js/actions";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { TextField, Typography } from "@material-ui/core";
import { theme } from "../MuiTheme";
import PlacesAutocomplete from "react-places-autocomplete";

function ProfileCityForm(props) {
  const [address, setAdress] = useState('');
  const handleChange = address => {
    setAdress(address);
  };

  const handleSelect = address => {
    setAdress(address);
  };
  const onSubmitHandler = e => {
    e.preventDefault();
    const body = {
      city: address
    };
    let athorizedHeader = config.AuthorizationHeader();
    axios
      .post("/api/updateuser/" + props.user._id, body, athorizedHeader)
      .then(res => {
        props.getUser();
        props.setToggleState(props.name, false);
      })
      .catch(err => console.log(err));
  };
  return (
    <Fragment>
      <div className="profile__userInfo">
        <span>Location</span>
        <div className="profile__userInfo__container">
          {props.toggle ? (
            <form
              className="profile__userInfo__container__form"
              onSubmit={onSubmitHandler}
            >
              <PlacesAutocomplete
                value={address}
                onChange={handleChange}
                onSelect={handleSelect}
              >
                {({
                  getInputProps,
                  suggestions,
                  getSuggestionItemProps,
                  loading
                }) => (
                    <div>
                      <MuiThemeProvider theme={theme}>
                        <TextField
                          defaultValue={props.user.city}
                          fullWidth
                          id="location"
                          {...getInputProps({
                            placeholder: "Search Your Location ...",
                            className: "location-search-input"
                          })}
                        />
                      </MuiThemeProvider>
                      <div className="autocomplete-dropdown-container">
                        {loading && <div>Loading...</div>}
                        {suggestions.map(suggestion => {
                          const className = suggestion.active
                            ? "suggestion-item--active"
                            : "suggestion-item";

                          return (
                            <div
                              {...getSuggestionItemProps(suggestion, {
                                className
                              })}
                            >
                              <span>{suggestion.description}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
              </PlacesAutocomplete>

              <button
                type="submit"
                className="profile__userInfo__container__form__btn"
              >
                Update
              </button>
            </form>
          ) : (
              <Fragment>
                <Typography variant="body2" style={{ fontSize: "1rem" }}>
                  {props.user.city
                    ? props.user.city
                    : `Link your ${props.name} account`}
                </Typography>

                <a
                  onClick={() => {
                    props.setToggleState(props.name, true);
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

const mapStateToProps = state => {
  const user = state.user;
  return { user };
};
const mapDispatchToProps = dispatch => {
  return {
    getUser: () => dispatch(getUser())
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ProfileCityForm);
