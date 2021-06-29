import React, { ReactElement } from "react";
import { Link, useLocation } from "react-router-dom";
import { Location } from "history";
import { Button } from "react-bootstrap";
import "./style.css"

const DetailsButton = (props: any): ReactElement => {
  const location = useLocation<Location>();


  return (
    <Link to={`/details/${props.confid}`} className={location.pathname === `/details/${props.confid}` ? "btnactive" : "btn"} >
      <Button data-toggle="popover" title={props.confname} type="button" className="button">{props.confname}</Button>
    </Link>
  )
}

export default DetailsButton;