import React, { ReactElement } from "react";
import { Button, Modal } from "react-bootstrap";
import "./style.css";

const ConfirmModal = (props: any): ReactElement => {


  return (
    <>
      <Modal show={props.show} onHide={props.hide} backdrop="static" keyboard={false} centered={true} className="modal">
        <Modal.Header className="modalHeadConf">
          <Modal.Title className="modalTitle"><h2>Please confirm</h2></Modal.Title>
        </Modal.Header>
        <Modal.Body className="modalBody">
          <h3>Are you sure?</h3>

          {/* Cancel Conference button */}
          {props.btnname === "confCancel" &&
            <h4>Are you sure you want to cancel {props.confname}? This can be undone later if circumstances change.</h4>}

          {/* Delete Session button */}
          {props.btnname === "sessDelete" &&
            <h4>Are you sure you want to delete {props.confname}? This action can't be undone.</h4>}

          {/* Deactivate Presenter button */}
          {props.btnname === "presCancel" &&
            <h4>Are you sure you want to mark this presenter inactive? This can be undone later if circumstances change.</h4>}

          {/* Unregister button */}
          {props.btnname === "unregAtt" &&
            <h4>Are you sure you want to unregister from {props.confname}? This action can't be undone.</h4>}

          {/* Unregister Exhibit button */}
          {props.btnname === "unregExh" &&
            <h4>Are you sure you want to unregister your exhibit from {props.confname}? This action can't be undone.</h4>}

          {/* Unregister Attendee button, owner/admin version */}
          {props.btnname === "admUnregAtt" &&
            <h4>Are you sure you want to unregister {props.attname} from {props.confname}? This action can't be undone.</h4>}

          {/* Delete Member button, owner/admin version */}
          {props.btnname === "delComm" &&
            <h4>Are you sure you want to remove {props.commname} from the {props.confname} session proposal review committee? This action can't be undone.</h4>}

          {/* Unregister Exhibit button, owner/admin button */}
          {props.btnname === "admUnregExh" &&
            <h4>Are you sure you want to unregister {props.exhname}'s exhibit from {props.confname}? This action can't be undone.</h4>}

          {/* Navigation buttons */}
          <Modal.Footer className="modalFooter">

            {/* Confirm Cancel Conference button */}
            {props.btnname === "confCancel" &&
              <Button data-toggle="popover" title="Confirm Cancel" className="button" type="button" onClick={props.cancelconf}>Yes, Cancel {props.confname}</Button>}

            {/* Confirm Delete Session button */}
            {props.btnname === "sessDelete" &&
              <Button data-toggle="popover" title="Confirm Delete" className="button" type="button" onClick={props.deletesess}>Yes, Delete</Button>}

            {/* Confirm Deactivate Presenter button */}
            {props.btnname === "presCancel" &&
              <Button data-toggle="popover" title="Confirm Deactivate" className="button" type="button" onClick={props.cancelpres}>Yes, Mark Presenter Inactive</Button>}

            {/* Confirm Unregister button */}
            {(props.btnname === "unregAtt" || props.btnname === "admUnregAtt") &&
              <Button data-toggle="popover" title="Confirm Unregister" className="button" type="button" onClick={props.unregatt}>Yes, Unregister</Button>}

            {/* Confirm Remove [committee member] button */}
            {props.btnname === "delComm" &&
              <Button data-toggle="popover" title="Confirm Remove" className="button" type="button" onClick={props.delcomm}>Yes, Remove</Button>}

            {/* Confirm Unregister Exhibit button */}
            {(props.btnname === "unregExh" || props.btnname === "admUnregExh") &&
              <Button data-toggle="popover" title="Confirm Unregister" className="button" type="button" onClick={props.unregexh}>Yes, Unregister</Button>}

            {/* No, take no action button */}
            <Button data-toggle="popover" title="No" className="button" type="button" onClick={props.hide}>No, take me back</Button>

          </Modal.Footer>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default ConfirmModal;