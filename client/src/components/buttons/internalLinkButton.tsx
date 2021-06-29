import React, { ReactElement } from "react";
import { Link, useLocation } from "react-router-dom";
import { Location } from "history";
import { Button } from "react-bootstrap";
import "./style.css"

const InternalLinkButton = (props: any): ReactElement => {
  const location = useLocation<Location>();


  return (
    <>
      <Link to={`/${props.urltype}/${props.confid}`} className={location.pathname === `/${props.urltype}/${props.confid}` ? "link active" : "link"} >
        <Button data-toggle="popover" title={props.page} type="button" className={props.button}>{props.page}</Button>
      </Link>
    </>
  )
}

export default InternalLinkButton;