import { createMuiTheme } from "@material-ui/core/styles";

export const theme = createMuiTheme({
  overrides: {
    MuiInput: {
      underline: {
        "&:hover:not($disabled):not($error):not($focused):before": {
          borderBottom: "1px solid rgba(255, 255, 255, 0.42)"
        },
        "&:hover:not($disabled):not($error):before": {
          borderBottom: "none"
        },
        "&:after": {
          borderBottom: "1px solid #ff3c00"
        },
        "&:before": {
          borderBottom: "1px solid rgba(255, 255, 255, 0.82)"
        },
        color: "#b8b8b8",
        borderBottom: "0.2px solid rgba(255, 255, 255, 0.42)",
        width: "265px"
      }
    },
    MuiDivider: {
      light: {
        backgroundColor: "#4a4b4b"
      }
    },

    MuiInputBase: {
      input: {
        padding: "1rem 0"
      }
    },

    MuiTypography: {
      colorPrimary: {
        color: "#ff3c00"
      }
    },

    MuiButton: {
      outlined: {
        color: "#ff3c00",
        //border: "1px solid  #ff3c00"
        width: "260px",
        margin: "2rem 0"
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
