import React from "react";
import { Button, Modal } from "react-bootstrap";
import "./style.css";

const ConfirmModal = (props) => {
  // Shows onClick of "Delete" or "Unregister" button
  // Asks for confirmation that user wants to take that action
  // If "yes", show SuccessModal or ErrorModal
  // If "no", returns user to page they were on

  return (
    <>
      <Modal show={props.show} onHide={props.hide} backdrop="static" keyboard={false} centered={true} className={props.urlid === "conferences" || props.urlid === "profile" ? "lightModal" : "modal"}>
        <Modal.Header className="modalHeadConf">
          <Modal.Title className="modalTitle"><h2>Please confirm</h2></Modal.Title>
        </Modal.Header>
        <Modal.Body className="modalBody">
          <h3>Are you sure?</h3>
          {props.btnname === "confDelete" &&
            <h4>Are you sure you want to delete {props.confname}? This action can't be undone.</h4>}
          {props.btnname === "sessDelete" &&
            <h4>Are you sure you want to delete {props.session.sessName}? This action can't be undone.</h4>}
          {props.btnname === "unregAtt" &&
            <h4>Are you sure you want to unregister from {props.confname}? This action can't be undone.</h4>}
          {props.btnname === "unregExh" &&
            <h4>Are you sure you want to unregister your exhibit from {props.confname}? This action can't be undone.</h4>}
          <Modal.Footer className="modalFooter">
            {props.btnname === "confDelete" &&
              <Button data-toggle="popover" title="Confirm Delete" className="button" onClick={() => props.deleteconf()} type="submit">Yes, Delete</Button>}
            {props.btnname === "sessDelete" &&
              <Button data-toggle="popover" title="Confirm Delete" className="button" onClick={() => props.deletesess()} type="submit">Yes, Delete</Button>}
            {props.btnname === "unregAtt" &&
              <Button data-toggle="popover" title="Confirm Unregister" className="button" onClick={() => props.unregatt()} type="submit">Yes, Unregister</Button>}
            {props.btnname === "unregExh" &&
              <Button data-toggle="popover" title="Confirm Unregister" className="button" onClick={() => props.unregexh()} type="submit">Yes, Unregister</Button>}
            <Button data-toggle="popover" title="No" className="button" onClick={props.hide} type="submit">No, take me back</Button>
          </Modal.Footer>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default ConfirmModal;