import React, { ReactElement } from "react";
import { Link, useLocation } from "react-router-dom";
import { Location } from "history";
import { Button } from "react-bootstrap";
import "./style.css"

const ConferencesButton = (): ReactElement => {
  const location = useLocation<Location>();


  return (
    <Link to="/conferences" className={location.pathname === "/conferences" ? "navlink placelink active" : "navlink placelink"}>
      <Button data-toggle="popover" title="Conferences" type="button" className="button">Conferences</Button>
    </Link>
  )

}

export default ConferencesButton;