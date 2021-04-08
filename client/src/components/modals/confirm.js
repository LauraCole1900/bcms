import React from "react";
import { Button, Modal } from "react-bootstrap";
import "./style.css";

const ConfirmModal = (props) => {
  // Shows onClick of "Cancel", "Delete" or "Unregister" button
  // Asks for confirmation that user wants to take that action
  // If "yes", show SuccessModal or ErrorModal
  // If "no", returns user to page they were on

  return (
    <>
      <Modal show={props.show} onHide={props.hide} backdrop="static" keyboard={false} centered={true} className="modal">
        <Modal.Header className="modalHeadConf">
          <Modal.Title className="modalTitle"><h2>Please confirm</h2></Modal.Title>
        </Modal.Header>
        <Modal.Body className="modalBody">
          <h3>Are you sure?</h3>
          {props.btnname === "confCancel" &&
            <h4>Are you sure you want to cancel {props.confname}? This can be undone later if circumstances change.</h4>}
          {props.btnname === "sessDelete" &&
            <h4>Are you sure you want to delete {props.session.sessName}? This action can't be undone.</h4>}
          {props.btnname === "unregAtt" &&
            <h4>Are you sure you want to unregister from {props.confname}? This action can't be undone.</h4>}
          {props.btnname === "unregExh" &&
            <h4>Are you sure you want to unregister your exhibit from {props.confname}? This action can't be undone.</h4>}
          {props.btnname === "admUnregAtt" &&
            <h4>Are you sure you want to unregister {props.attname} from {props.confname}? This action can't be undone.</h4>}
          {props.btnname === "admUnregExh" &&
            <h4>Are you sure you want to unregister {props.exhname}'s exhibit from {props.confname}? This action can't be undone.</h4>}
          <Modal.Footer className="modalFooter">
            {props.btnname === "confCancel" &&
              <Button data-toggle="popover" title="Confirm Cancel" className="button" onClick={() => props.cancelconf()} type="submit">Yes, Cancel</Button>}
            {props.btnname === "sessDelete" &&
              <Button data-toggle="popover" title="Confirm Delete" className="button" onClick={() => props.deletesess()} type="submit">Yes, Delete</Button>}
            {(props.btnname === "unregAtt" || props.btnname === "admUnregAtt") &&
              <Button data-toggle="popover" title="Confirm Unregister" className="button" onClick={() => props.unregatt()} type="submit">Yes, Unregister</Button>}
            {(props.btnname === "unregExh" || props.btnname === "admUnregExh") &&
              <Button data-toggle="popover" title="Confirm Unregister" className="button" onClick={() => props.unregexh()} type="submit">Yes, Unregister</Button>}
            <Button data-toggle="popover" title="No" className="button" onClick={props.hide} type="submit">No, take me back</Button>
          </Modal.Footer>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default ConfirmModal;