import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
import config from "../../../modules/config";
import { connect } from "react-redux";
import { getUser } from "../../../js/actions";
import { makeStyles } from "@material-ui/core/styles";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { Chip, Button, Avatar } from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";
import CloseIcon from "@material-ui/icons/Close";
import ProfileAvatar from "./ProfileAvatar";
import PersonSharpIcon from '@material-ui/icons/PersonSharp';
import imageCompression from 'browser-image-compression';
import default_image from '../../../img/default-image.png';
export const theme = createMuiTheme({
  overrides: {
    MuiAvatar: {
      img: {
        objectFit: "cover" //same as original - not overriding
      }
    },
    MuiButton: {
      text: {
        color: "#ff3c00",
        padding: "1rem 1rem"
      }
    },
    MuiSvgIcon: {
      root: {
        width: "96px",
        height: "96px"
      }
    },
    MuiChip: {
      outlinedPrimary: {
        color: "green",
        border: "1px solid green"
      },
      outlinedSecondary: {
        color: "red",
        border: "1px solid red",
        margin: "0.5rem 0"
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
  const [image, setImage] = useState("");
  const [userImage, setuserImage] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [message, setMessage] = useState({
    success: null,
    icon: <DoneIcon />,
    msg: "",
    color: ""
  });

  const getUserImage = (e) => {
    setuserImage("/user-image/" + e.image_data)
  }

  const onChangeUpload = async (e) => {
    setImagePath(URL.createObjectURL(e.target.files[0]));
    const options = {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 250,
      useWebWorker: true,
      file: 'File'
    }
    try {
      const compressedFile = await imageCompression(e.target.files[0], options);
      setImage(compressedFile);
    } catch (error) {
      console.log(error)
    }
  };

  const uploadImage = () => {
    const imageFormObj = new FormData();
    imageFormObj.append("image_data", image);
    const athorizedHeader = config.AuthorizationHeader();
    axios
      .post(
        "/images/uploaduserimg/" + props.user._id,
        imageFormObj,
        athorizedHeader
      )
      .then(res => {
        props.getUser();
        props.setToggleState(props.name, false);
        setImage();
        setImagePath();
        setMessage({
          success: true,
          icon: <DoneIcon />,
          msg: "Updated.",
          color: "primary"
        });
      })
      .catch(err => {
        setMessage({
          success: false,
          icon: <CloseIcon />,
          msg: "Update Failed.",
          color: "secondary"
        });
      });
  };
  useEffect(() => {
    if (props.user && props.user.img) {
      getUserImage(props.user.img)
    }
  }, [props.image, props.user]);

  return (
    <Fragment>
      <MuiThemeProvider theme={theme}>
        <div className="profile__img-name-wrapper__img">
          {props.toggle ? (
            <Fragment>
              <input
                accept="image/*"
                id="raised-button-file"
                type="file"
                style={{ display: "none" }}
                onChange={e => onChangeUpload(e)}
              />
              <label htmlFor="raised-button-file">
                {imagePath === "" ? (
                  <Avatar className={classes.large}>
                    <AddAPhotoIcon />
                  </Avatar>
                ) : (
                    <ProfileAvatar imageSrc={imagePath} />
                  )}
              </label>
              <Button
                className="profile__img-name-wrapper__img-link"
                onClick={e => uploadImage()}
                disabled={imagePath === ""}
              >
                Upload
              </Button>
            </Fragment>
          ) : (
              <Fragment>
                {props.image ? (
                  <Avatar
                    className={classes.large}
                    src={userImage}
                    alt="profile image"
                  />
                ) : (
                  <Avatar  className={classes.large}><PersonSharpIcon /></Avatar>
                  )}

                <a
                  className="profile__img-name-wrapper__img-link"
                  onClick={() => {
                    props.setToggleState(props.name, true);
                  }}
                >
                  Change
              </a>
              </Fragment>
            )}
          {message.success !== null && (
            <Chip
              size="small"
              label={message.msg}
              disabled
              icon={message.icon}
              color={message.color}
              variant="outlined"
            />
          )}
        </div>
      </MuiThemeProvider>
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
