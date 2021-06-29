import React, { ReactElement } from "react";
import { Button } from "react-bootstrap";
import "./style.css"

const CloseModalButton = (props: any): ReactElement => {


  return (
    <Button data-toggle="popover" title={props.confname} type="button" className="button" onClick={props.click}>Return to {props.page}</Button>
  )
}

export default CloseModalButton