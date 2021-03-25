import React, { Fragment } from "react";
import ContactInfo from "./ContactInfo";
import Social from "./Social";
import Links from "./Links";

export default function NavbarContact() {
  return (
    <>
      <div className="nav-contact">
        <ContactInfo />
      </div>
      <div className="nav-contact-icons">
        <Social />
      </div>
      <div className="nav-contact-links">
        <Links />
      </div>
    </>
  );
}
