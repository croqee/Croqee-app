import React, { Fragment, useState } from "react";
import ProfilePicture from "profile-picture";
import "profile-picture/build/ProfilePicture.css";
import axios from "axios";
import config from "../../../modules/config";
import { connect } from "react-redux";
import { getUser } from "../../../js/actions";
import Avatar from "@material-ui/core/Avatar";
import { IconButton, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

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
    width: theme.spacing(11),
    height: theme.spacing(11)
  }
}));
function ProfileImgForm(props) {
  const classes = useStyles();
  const [multerImage, setMulterImage] = useState();
  const [multerImagePath, setMulterImagePath] = useState();
  const [hover, setHover] = useState(false);

  const onChangeUpload = e => {
    setMulterImage(URL.createObjectURL(e.target.files[0]));
    setMulterImagePath(e.target.files[0]);
  };

  const uploadImage = (e, method) => {
    if (method === "multer") {
      let imageFormObj = new FormData();
      imageFormObj.append("imageName", "multer-image-" + Date.now());
      imageFormObj.append("imageData", multerImagePath);

      let athorizedHeader = config.AuthorizationHeader();
      axios
        .post(
          "images/uploadmulter/" + props.user._id,
          imageFormObj,
          athorizedHeader
        )
        .then(res => {
          console.log(res);
          props.getUser();
          props.setToggleState(props.name, false);
          setMulterImage();
          setMulterImagePath();
        })
        .catch(err => console.log(err));
    }
  };
  let imageStyle = "";
  if (hover) {
    imageStyle = {
      backgroundImage:
        "url(http://localhost:8080/uploads/1590219675984Photo%20on%202018-05-04%20at%2019.36.jpg)"
    };
  } else {
    imageStyle = { backgroundColor: "blue" };
  }
  const displayEdit = () => {
    console.log("entered");
    setHover(!hover);
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
            <Avatar
              src={multerImage}
              alt="image"
              className={classes.large}
              onMouseEnter={displayEdit}
              onMouseExit={displayEdit}
              style={imageStyle}
            />
          </label>

          <a
            className="profile__img-name-wrapper__img-link"
            onClick={e => uploadImage(e, "multer")}
          >
            Upload
          </a>
        </div>
      ) : (
        <Fragment>
          <div className="profile__img-name-wrapper__img">
            {props.image && props.image.imageData && (
              <Avatar
                className={classes.large}
                src={`http://localhost:8080/${encodeURI(
                  props.image.imageData
                )}`}
                alt="profile image"
              />
            )}

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
