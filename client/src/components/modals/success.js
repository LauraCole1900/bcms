import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import "./style.css"

const SuccessModal = (props, e) => {
  const location = useLocation();
  // Show onClick of "Update" or "Submit" button, if !res.err
  // Gives success message as does success page
  // Buttons give user choice to return to previous {conference or session}, allConfsPage or profilePage
  // Delete???


  return (
    <>
      <Modal show={props.show} onHide={props.hide} backdrop="static" keyboard={false} className="modal" centered={true}>
        <Modal.Header className="modalHead">
          <Modal.Title><h2>Success!</h2></Modal.Title>
        </Modal.Header>
        <Modal.Body className="modalBody">
          {props.urlid === "update_user" &&
            <h4>You have updated your information.</h4>}
          {props.urlid === "new_conference" &&
            <h4>You have created a new conference.</h4>}
          {props.urltype === "edit_conference" &&
            <h4>You have updated your conference.</h4>}
          {props.urltype === "new_session" &&
            <h4>You have added a session.</h4>}
          {props.urltype === "edit_session" &&
            <h4>You have updated your session.</h4>}
          {props.urltype === "register_attend" &&
            <h4>You have registered for {props.conference.confName}.</h4>}
          {props.urltype === "register_edit" &&
            <h4>You have edited your registration for {props.conference.confName}.</h4>}
          {(props.urlid === "profile" || props.urlid === "conferences" || props.urltype === "details") &&
            (e.id === "unregAtt" &&
              <h4>You have unregistered from {props.conference.confName}. If you paid a registration fee, please contact the conference organizers.</h4>)}
          {(props.urlid === "profile" || props.urlid === "conferences" || props.urltype === "details") &&
            (e.id === "unregExh" &&
              <h4>You have unregistered your exhibit from {props.conference.confName}. If you paid a registration fee, please contact the conference organizers.</h4>)}
          {(props.urlid === "profile" || props.urlid === "conferences" || props.urltype === "details") &&
            (e.id === "confDelete" || e.id === "sessDelete") &&
            <h4>Delete! Delete! Delete!</h4>}
        {/* </Modal.Body> */}
        <Modal.Footer className="modalFooter">
          {(props.urltype === "edit_conference" || props.urltype === "edit_session") &&
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

export default SuccessModal;