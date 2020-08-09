import React, { Fragment } from "react";
import { Link } from "react-router-dom";

export default function Links(color) {
  return (
    <Fragment>
      <Link to="#">Contact</Link>
      <Link to="#">Privacy policy</Link>
      <Link to="#">Terms & Conditions</Link>
    </Fragment>
  );
}
