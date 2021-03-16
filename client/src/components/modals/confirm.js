import React from "react";
import { Button, Modal } from "react-bootstrap";

const ConfirmModal = (e, props) => {
  // Shows onClick of "Delete" or "Unregister" button
  // Asks for confirmation that user wants to take that action
  // If "yes", show SuccessModal or ErrorModal
  // If "no", returns user to page they were on

  return (
    <>
      <Modal show={props.show} onHide={props.hide} backdrop="static" keyboard={false} className="modal" centered={true}>
        <Modal.Header className="modalHeadConf">
          <Modal.Title><h2>Please confirm</h2></Modal.Title>
        </Modal.Header>
        <Modal.Body className="modalBody">
          {e.id === "confDelete" &&
            <h3>Are you sure you want to delete this conference?</h3>}
          {e.id === "sessDelete" &&
            <h3>Are you sure you want to delete this session?</h3>}
          {e.id === "unregAtt" &&
            <h3>Are you sure you want to unregister from {props.conference.confName}?</h3>}
          {e.id === "unregExh" &&
            <h3>Are you sure you want to unregister your exhibit from {props.conference.confName}?</h3>}
          <Modal.Footer>
            {(e.id === "confDelete" || e.id === "sessDelete") &&
              <Button data-toggle="popover" title="Confirm Delete" className="button" onClick={props.delete} type="submit">Yes, Delete</Button>}
            {(e.id === "unregAtt" || e.id === "unregExh") &&
              <Button data-toggle="popover" title="Confirm Unregister" className="button" onClick={props.unreg} type="submit">Yes, Unregister</Button>}
            <Button data-toggle="popover" title="No" className="button" onClick={props.hide} type="submit">No, thank you</Button>
          </Modal.Footer>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default ConfirmModal;