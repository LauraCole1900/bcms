import React from "react";
import { Modal } from "react-bootstrap";

const ErrorModal = (props, e) => {
  // Shows onClick of "Update" or "Success button", if res.err
  // Gives error message as does error page
  // Logs error message automatically? Where?
  // Asks user to forward error message?
  // Buttons: "Return to {conf or sess}", "allConfsPage", "profilePage"
  // Delete???

  return (
    <>
      <Modal show={props.show} onHide={props.hide} backdrop="static" keyboard={false}>
        <Modal.Header>
          <Modal.Title>We're sorry.</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h3>Gremlins appear to have gotten into our system. Please copy the error message below and send it to us to help us find and banish these gremlins as quickly as we can.</h3>
          {props.urlId === "update_user" &&
            <h4>{props.errMsg}. Your user information was not updated.</h4>}
          {props.urlId === "new_conference" &&
            <h4>{props.errMsg}. Your conference was not created.</h4>}
          {props.urlType === "edit_conference" &&
            <h4>{props.errMsg}. Your conference was not updated.</h4>}
          {props.urlType === "new_session" &&
            <h4>{props.errMsg}. Your session was not added.</h4>}
          {props.urlType === "edit_session" &&
            <h4>{props.errMsg}. Your session was not updated.</h4>}
          {props.urlType === "register_attend" &&
            <h4>{props.errMsg}. Your registration for {props.conference.confName} could not be processed at this time.</h4>}
          {props.urlType === "register_edit" &&
            <h4>{props.errMsg}. Your registration for {props.conference.confName} could not be updated at this time.</h4>}
          {(props.urlId === "profile" || props.urlId === "conferences" || props.urlType === "details") &&
            (e.id === "unregAtt" &&
              <h4>Your unregistration from {props.conference.confName} could not be processed at this time.</h4>)}
          {(props.urlId === "profile" || props.urlId === "conferences" || props.urlType === "details") &&
            (e.id === "unregExh" &&
              <h4>The unregistration of your exhibit from {props.conference.confName} could not be processed at this time.</h4>)}
          {(props.urlId === "profile" || props.urlId === "conferences" || props.urlType === "details") &&
            (e.id === "confDelete" &&
              <h4>{props.errMsg}. Your conference could not be deleted at this time.</h4>)}
          {(props.urlId === "profile" || props.urlId === "conferences" || props.urlType === "details") &&
            (e.id === "sessDelete" &&
              <h4>{props.errMsg}. Your session could not be deleted at this time.</h4>)}
        </Modal.Body>
      </Modal>
    </>
  )
}

export default ErrorModal;