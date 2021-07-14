import React, { ReactElement } from "react";
import { Modal } from "react-bootstrap";
import { SessionCard } from "../cards";
import "./style.css";

const SessionModal = (props: any): ReactElement => {

  
  return (
    <>
      <Modal
        show={props.show}
        onHide={props.hide}
        centered={true}
        className="modal"
      >
        <Modal.Body className="modalBodySched">
          <SessionCard
            session={[props.session]}
            presenter={props.presenter}
            conference={[props.conference]}
            hide={props.hide}
          />
        </Modal.Body>
      </Modal>
    </>
  )
}

export default SessionModal;