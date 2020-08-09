import React from "react";

export default function ActionBtnNav(props) {
  return (
    <button className="nav-links-btn" onClick={props.onclick}>
      <span className="nav-links-btn-text">
        {props.btnText}
        {props.endIcon}
      </span>
    </button>
  );
}
