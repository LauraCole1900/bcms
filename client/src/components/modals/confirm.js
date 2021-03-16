import React from "react";
import { Button, Modal } from "react-bootstrap";

const ConfirmModal = (props) => {
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
          {props.target === "confDelete" &&
            <h3>Are you sure you want to delete this conference?</h3>}
          {props.target === "sessDelete" &&
            <h3>Are you sure you want to delete this session?</h3>}
          {props.target === "unregAtt" &&
            <h3>Are you sure you want to unregister from {props.conference.confName}?</h3>}
          {props.target === "unregExh" &&
            <h3>Are you sure you want to unregister your exhibit from {props.conference.confName}?</h3>}
          <h3>Are you sure?</h3>
          <Modal.Footer>
            {props.target === "confDelete" &&
              <Button data-toggle="popover" title="Confirm Delete" className="button" onClick={props.deleteconf} type="submit">Yes, Delete</Button>}
            {props.target === "sessDelete" &&
              <Button data-toggle="popover" title="Confirm Delete" className="button" onClick={props.deletesess} type="submit">Yes, Delete</Button>}
            {props.target === "unregAtt" &&
              <Button data-toggle="popover" title="Confirm Unregister" className="button" onClick={props.unregatt} type="submit">Yes, Unregister</Button>}
            {props.target === "unregExh" &&
              <Button data-toggle="popover" title="Confirm Unregister" className="button" onClick={props.unregexh} type="submit">Yes, Unregister</Button>}
            <Button data-toggle="popover" title="No" className="button" onClick={props.hide} type="submit">No, take me back</Button>
          </Modal.Footer>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default ConfirmModal;