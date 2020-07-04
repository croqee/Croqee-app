import React, { Fragment, useStyles } from "react";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import axios from "axios";
import config from "../../../modules/config";
import { connect } from "react-redux";
import { getUser } from "../../../js/actions";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { theme } from "../MuiTheme";

function ProfileBirthDateForm(props) {
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const handleDateChange = date => {
    setSelectedDate(date);
  };
  const onSubmitHandler = e => {
    e.preventDefault();
    let body = {
      birthDate: selectedDate
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
        <span>Date of Birth</span>
        <div className="profile__userInfo__container">
          {props.toggle ? (
            <form
              className="profile__userInfo__container__form"
              onSubmit={onSubmitHandler}
            >
              <MuiThemeProvider theme={theme}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    margin="normal"
                    id="date-picker-dialog"
                    format="MM/dd/yyyy"
                    value={selectedDate}
                    onChange={handleDateChange}
                    name={props.name}
                    KeyboardButtonProps={{
                      "aria-label": "change date"
                    }}
                  />
                </MuiPickersUtilsProvider>
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
                {props.user.birthDate
                  ? props.user.birthDate.substring(0, 10)
                  : `Link your ${props.name} account`}
              </p>

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
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileBirthDateForm);
