import React, { Fragment, useState } from "react";
import axios from "axios";
import config from "../../../modules/config";
import { connect } from "react-redux";
import { getUser } from "../../../js/actions";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

export const theme = createMuiTheme({
  overrides: {
    MuiAvatar: {
      img: {
        objectFit: "cover" //same as original - not overriding
      }
    }
  }
});

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1)
    }
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3)
  },
  large: {
    width: theme.spacing(16),
    height: theme.spacing(16),
    backgroundColor: "black"
  }
}));
function ProfileImgForm(props) {
  const classes = useStyles();
  const [multerImage, setMulterImage] = useState("");
  const [multerImagePath, setMulterImagePath] = useState("");

  const onChangeUpload = e => {
    setMulterImagePath(URL.createObjectURL(e.target.files[0]));
    setMulterImage(e.target.files[0]);
  };

  const uploadImage = () => {
    let imageFormObj = new FormData();
    imageFormObj.append("imageName", "multer-image-" + Date.now());
    imageFormObj.append("imageData", multerImage);

    let athorizedHeader = config.AuthorizationHeader();
    axios
      .post(
        "images/uploadmulter/" + props.user._id,
        imageFormObj,
        athorizedHeader
      )
      .then(res => {
        props.getUser();
        props.setToggleState(props.name, false);
        setMulterImage();
        setMulterImagePath();
      })
      .catch(err => console.log(err));
  };

  return (
    <Fragment>
      {props.toggle ? (
        <div className="profile__img-name-wrapper__img">
          <input
            accept="image/*"
            id="raised-button-file"
            type="file"
            style={{ display: "none" }}
            onChange={e => onChangeUpload(e)}
          />
          <label htmlFor="raised-button-file">
            {multerImagePath === "" ? (
              <Avatar className={classes.large}>
                <AddAPhotoIcon />
              </Avatar>
            ) : (
              <Avatar
                src={multerImagePath}
                alt="image"
                className={classes.large}
              />
            )}
          </label>

          <a
            className="profile__img-name-wrapper__img-link"
            onClick={e => uploadImage()}
          >
            Upload
          </a>
        </div>
      ) : (
        <Fragment>
          <div className="profile__img-name-wrapper__img">
            <MuiThemeProvider theme={theme}>
              {props.image ? (
                <Avatar
                  className={classes.large}
                  src={`http://localhost:8080/${encodeURI(
                    props.image.imageData
                  )}`}
                  alt="profile image"
                />
              ) : (
                <Avatar className={classes.large} alt="profile image" />
              )}
            </MuiThemeProvider>

            <a
              className="profile__img-name-wrapper__img-link"
              onClick={() => {
                props.setToggleState(props.name, true);
              }}
            >
              Change
            </a>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
}

const mapStateToProps = state => {
  const user = state.user;
  const image = state.user.img;
  return { user, image };
};
const mapDispatchToProps = dispatch => {
  return {
    getUser: () => dispatch(getUser())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileImgForm);
