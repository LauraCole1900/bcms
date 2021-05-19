import React from "react";
import { Modal } from "react-bootstrap";
import { SessionCard } from "../cards";
import "./style.css";

const SessionModal = (props) => {

  return (
    <>
    <Modal show={props.show} onHide={props.hide} centered={true} className="modal">
      <SessionCard session={props.session} />
    </Modal>
    </>
  )
}

export default SessionModal;