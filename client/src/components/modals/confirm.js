import React, { useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import "./style.css";

const ConfirmModal = (e, props) => {
  // Shows onClick of "Delete" or "Unregister" button
  // Asks for confirmation that user wants to take that action
  // If "yes", show SuccessModal or ErrorModal
  // If "no", returns user to page they were on

  useEffect(() => {
    if (props.show === true) {
      
    }
  }, [props.show])

  return (
    <>
      <Modal show={props.show} onHide={props.hide} backdrop="static" keyboard={false} className="modal" centered={true}>
        <Modal.Header className="modalHeadConf">
          <Modal.Title><h2>Please confirm</h2></Modal.Title>
        </Modal.Header>
        <Modal.Body className="modalBody">
          <h3>Are you sure?</h3>
          {e.target !== undefined &&
            (e.target.name === "confDelete" &&
              <h3>Are you sure you want to delete this conference? This action can't be undone.</h3>)}
          {e.target !== undefined &&
            (e.target.name === "sessDelete" &&
              <h3>Are you sure you want to delete this session? This action can't be undone.</h3>)}
          {e.target !== undefined &&
            (e.target.name === "unregAtt" &&
              <h3>Are you sure you want to unregister from {props.conference.confName}? This action can't be undone.</h3>)}
          {e.target !== undefined &&
            (e.target.name === "unregExh" &&
              <h3>Are you sure you want to unregister your exhibit from {props.conference.confName}? This action can't be undone.</h3>)}
          <Modal.Footer>
            {e.target !== undefined &&
              (e.target.name === "confDelete" &&
                <Button data-toggle="popover" title="Confirm Delete" className="button" onClick={props.deleteconf} type="submit">Yes, Delete</Button>)}
            {e.target !== undefined &&
              (e.target.name === "sessDelete" &&
                <Button data-toggle="popover" title="Confirm Delete" className="button" onClick={props.deletesess} type="submit">Yes, Delete</Button>)}
            {e.target !== undefined &&
              (e.target.name === "unregAtt" &&
                <Button data-toggle="popover" title="Confirm Unregister" className="button" onClick={props.unregatt} type="submit">Yes, Unregister</Button>)}
            {e.target !== undefined &&
              (e.target.name === "unregExh" &&
                <Button data-toggle="popover" title="Confirm Unregister" className="button" onClick={props.unregexh} type="submit">Yes, Unregister</Button>)}
            <Button data-toggle="popover" title="No" className="button" onClick={props.hide} type="submit">No, take me back</Button>
          </Modal.Footer>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default ConfirmModal;