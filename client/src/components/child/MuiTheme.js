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
        padding: "1rem 0",
        color: "#5d5e5e"
      }
    },
    MuiFormLabel: {
      root: {
        margin: "1rem 0",
        "&$focused": {
          color: "#ff3c00",
          fontWeight: "bold"
        }
      }
    },

    MuiTypography: {
      colorPrimary: {
        color: "#ff3c00"
      }
    },

    MuiButton: {
      root: {
        width: "260px"
      },
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
      },
      iconSizeMedium: {
        color: "#ff3c00"
      }
    },
    MuiCard: {
      root: {
        paddingBottom: "2rem"
      }
    },
    MuiPaper: {
      root: {
        minWidth: "275px",
        maxWidth: "400px",
        margin: "4rem auto 0.25rem auto",
        backgroundColor: "transparent"
      },
      elevation24: {
        boxShadow: "none"
      },
      rounded: {
        borderRadius: "0"
      }
    }
  },
  palette: {
    type: "dark",
    textColor: "#fd5f00"
  }
});
