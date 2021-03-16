import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";

const ErrorModal = (props, e) => {
  const location = useLocation();
  // Shows onClick of "Update" or "Success button", if res.err
  // Gives error message as does error page
  // Logs error message automatically? Where?
  // Asks user to forward error message?
  // Buttons: "Return to {conf or sess}", "allConfsPage", "profilePage"
  // Delete???

  return (
    <>
      <Modal show={props.show} onHide={props.hide} backdrop="static" keyboard={false} className="modal" centered={true}>
        <Modal.Header className="modalHead">
          <Modal.Title><h2>We're sorry.</h2></Modal.Title>
        </Modal.Header>
        <Modal.Body className="modalBody">
          <h3>Gremlins appear to have gotten into our system. Please copy the error message below and send it to us to help us find and banish these gremlins as quickly as we can.</h3>
          {props.urlid === "update_user" &&
            <h4>{props.errmsg}. Your user information was not updated.</h4>}
          {props.urlid === "new_conference" &&
            <h4>{props.errmsg}. Your conference was not created.</h4>}
          {props.urltype === "edit_conference" &&
            <h4>{props.errmsg}. Your conference was not updated.</h4>}
          {props.urltype === "new_session" &&
            <h4>{props.errmsg}. Your session was not added.</h4>}
          {props.urltype === "edit_session" &&
            <h4>{props.errmsg}. Your session was not updated.</h4>}
          {props.urltype === "register_attend" &&
            <h4>{props.errmsg}. Your registration for {props.conference.confName} could not be processed at this time.</h4>}
          {props.urltype === "register_edit" &&
            <h4>{props.errmsg}. Your registration for {props.conference.confName} could not be updated at this time.</h4>}
          {(props.urlid === "profile" || props.urlid === "conferences" || props.urltype === "details") &&
            (e.id === "unregAtt" &&
              <h4>Your unregistration from {props.conference.confName} could not be processed at this time.</h4>)}
          {(props.urlid === "profile" || props.urlid === "conferences" || props.urltype === "details") &&
            (e.id === "unregExh" &&
              <h4>The unregistration of your exhibit from {props.conference.confName} could not be processed at this time.</h4>)}
          {(props.urlid === "profile" || props.urlid === "conferences" || props.urltype === "details") &&
            (e.id === "confDelete" &&
              <h4>{props.errmsg}. Your conference could not be deleted at this time.</h4>)}
          {(props.urlid === "profile" || props.urlid === "conferences" || props.urltype === "details") &&
            (e.id === "sessDelete" &&
              <h4>{props.errmsg}. Your session could not be deleted at this time.</h4>)}
          <Modal.Footer className="modalFooter">
            {(props.urltype === "edit_conference" || props.urltype === "edit_session" || props.urltype === "register_attend" || props.urltype === "register_edit" || props.urltype === "register_exhibit" || props.urltype === "edit_exhibit" || props.urlid === "profile" || props.urlid === "conferences" || props.urlid === "details") &&
              <Link to={`/details/${props.urlid}`} className={location.pathname === `/details/${props.urlid}` ? "btnactive" : "btn"} >
                <Button data-toggle="popover" title={props.conference.confName} type="button" className="button">{props.conference.confName}</Button>
              </Link>}
            <Link to="/conferences" className={location.pathname === "/conferences" ? "btnactive" : "btn"} >
              <Button data-toggle="popover" title="Conferences" type="button" className="button">Conferences</Button>
            </Link>
            <Link to="/profile" className={location.pathname === "/profile" ? "btnactive" : "btn"} >
              <Button data-toggle="popover" title="Profile" type="button" className="button">Profile</Button>
            </Link>
          </Modal.Footer>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default ErrorModal;