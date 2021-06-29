import React, { ReactElement } from "react";
import { Button } from "react-bootstrap";
import "./style.css"

const UnregisterButton = (props: any): ReactElement => {


  return (
    <>
      <Button data-toggle="popover" title={props.page} className={props.button} data-confid={props.confid} data-confname={props.confname} name={props.name} onClick={props.click}>{props.page}</Button>
    </>
  )
}

export default UnregisterButton;