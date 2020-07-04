import React from "react";
import Avatar from "@material-ui/core/Avatar";
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
    width: theme.spacing(16),
    height: theme.spacing(16),
    backgroundColor: "black"
  }
}));
export default function ProfileAvatar(props) {
  const classes = useStyles();
  return <Avatar className={classes.large} src={props.imageSrc}></Avatar>;
}
