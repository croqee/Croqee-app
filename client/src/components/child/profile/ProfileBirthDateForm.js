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
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { TextField, Typography } from "@material-ui/core";

const theme = createMuiTheme({
  overrides: {
    MuiTypography: {
      colorPrimary: {
        color: "#ff3c00"
      }
    },

    MuiButton: {
      outlined: {
        color: "#ff3c00",
        margin: "1.5rem 0"
      },
      textPrimary: {
        color: "#fff",
        fontWeight: "600",
        "&:hover": {
          backgroundColor: "#4a4b4b",
          borderRadius: "0"
        }
      }
    },
    MuiPaper: {
      elevation24: {
        boxShadow: "none"
      },
      rounded: {
        borderRadius: "0"
      }
    },
    MuiPickersYear: {
      root: {
        "&:focus": {
          color: "#ff3c00"
        }
      }
    },
    MuiPickersDay: {
      container: {
        borderRadius: "0"
      },
      borderRadius: "0",
      daySelected: {
        backgroundColor: "#ff3c00",
        "&:hover": {
          backgroundColor: "#ff3c00",
          color: "#fff"
        }
      },
      current: {
        color: "#ff3c00"
      }
    }
  },
  palette: {
    type: "dark",
    textColor: "#fd5f00"
  }
});

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
              <Typography variant="body2" style={{ fontSize: "1rem" }}>
                {props.user.birthDate
                  ? props.user.birthDate.substring(0, 10)
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
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileBirthDateForm);
