import React, { ReactElement } from "react";
import { Link, useLocation } from "react-router-dom";
import { Location } from "history";
import { Button } from "react-bootstrap";
import "./style.css"

const ProfileButton = (): ReactElement  => {
  const location = useLocation<Location>();

  
  return (
    <Link to="/profile" className={location.pathname === "/profile" ? "navlink active" : "navlink"}>
      <Button data-toggle="popover" title="Profile" type="button" className="button">Profile</Button>
    </Link>
  )
}

export default ProfileButton;