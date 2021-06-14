import React from "react";
import { Modal } from "react-bootstrap";
import { SessionCard } from "../cards";
import "./style.css";

const SessionModal = (props) => {
  console.log("sessModal", props);

  return (
    <>
    <Modal show={props.show} onHide={props.hide} centered={true} className="modal">
      <SessionCard session={[props.session]} presenter={props.presenter} conference={[props.conference]} hide={props.hide} />
    </Modal>
    </>
  )
}

export default SessionModal;