import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import "./style.css"

const SuccessModal = (props) => {
  const location = useLocation();
  // Show onClick of "Update" or "Submit" button, if !res.err
  // Gives success message as does success page
  // Buttons give user choice to return to previous {conference or session}, allConfsPage or profilePage
  // Delete???


  return (
    <>
      <Modal show={props.show} onHide={props.hide} backdrop="static" keyboard={false} centered={true} className="modal">
        <Modal.Header className="modalHead">
          <Modal.Title className="modalTitle"><h2>Success!</h2></Modal.Title>
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
          {props.urltype === "admin_register_att" &&
            <h4>You have registered {props.attname} for {props.conference.confName}.</h4>}
          {props.urltype === "register_edit" &&
            <h4>You have edited your registration for {props.conference.confName}.</h4>}
          {props.urltype === "admin_edit_att" &&
            <h4>You have edited {props.attname}'s registration for {props.conference.confName}.</h4>}
          {props.urltype === "register_exhibit" &&
            <h4>You have registered your exhibit for {props.conference.confName}.</h4>}
          {props.urltype === "admin_register_exh" &&
            <h4>You have registered {props.exhname}'s exhibit for {props.conference.confName}.</h4>}
          {props.urltype === "edit_exhibit" &&
            <h4>You have edited your exhibit's information for {props.conference.confName}.</h4>}
          {props.urltype === "admin_edit_exh" &&
            <h4>You have edited {props.exhname}'s exhibit information for {props.conference.confName}.</h4>}
          {(props.urlid === "profile" || props.urlid === "conferences" || props.urltype === "details") &&
            (props.btnname === "unregAtt" &&
              <h4>You have unregistered from {props.conference.confName}. If you paid a registration fee, please contact the conference organizers.</h4>)}
          {props.urltype === "attendees" &&
            (props.btnname === "admUnregAtt" &&
              <h4>You have unregistered {props.attname} from {props.conference.confName}.</h4>)}
          {props.urltype === "exhibitors" &&
            (props.btnname === "admUnregExh" &&
              <h4>You have unregistered {props.exhname}'s exhibit from {props.conference.confName}.</h4>)}
          {props.urltype === "presenters" &&
            (props.btnname === "admUnregPres" &&
              <h4>{props.presname} is no longer presenting at {props.conference.confName}.</h4>)}
          {(props.urlid === "profile" || props.urlid === "conferences" || props.urltype === "details") &&
            (props.btnname === "unregExh" &&
              <h4>You have unregistered your exhibit from {props.conference.confName}. If you paid a registration fee, please contact the conference organizers.</h4>)}
          {(props.urlid === "profile" || props.urlid === "conferences" || props.urltype === "details") &&
            (props.btnname === "confCancel" &&
              <h4>{props.conference.confName} has been cancelled. An email will be sent to any registered participants.</h4>)}
          {(props.urlid === "profile" || props.urlid === "conferences" || props.urltype === "details") &&
            (props.btnname === "sessDelete" &&
              <h4>Delete! Delete! Delete!</h4>)}
          <Modal.Footer className="modalFooter">
            {(props.urltype === "details" || props.urltype === "attendees" || props.urltype === "exhibitors" || props.urltype === "presenters") &&
              <Button data-toggle="popover" title={props.conference.confName} type="button" className="button" onClick={props.hide}>{props.conference.confName}</Button>}
            {(props.urltype !== "details" && props.urltype !== "attendees" && props.urltype !== "exhibitors" && props.urltype !== "presenters" && props.urlid !== "new_conference" && props.urlid !== "update_user") &&
              <Link to={`/details/${props.conference._id}`} className={location.pathname === `/details/${props.conference._id}` ? "btnactive" : "btn"} >
                <Button data-toggle="popover" title={props.conference.confName} type="button" className="button">{props.conference.confName}</Button>
              </Link>}
            {props.urlid === "conferences"
              ? <Button data-toggle="popover" title="Conferences" type="button" className="button" onClick={props.hide}>Conferences</Button>
              : <Link to="/conferences" className={location.pathname === "/conferences" ? "btnactive" : "btn"} >
                <Button data-toggle="popover" title="Conferences" type="button" className="button">Conferences</Button>
              </Link>}
            {props.urlid === "profile"
              ? <Button data-toggle="popover" title="Profile" type="button" className="button" onClick={props.hide}>Profile</Button>
              : <Link to="/profile" className={location.pathname === "/profile" ? "btnactive" : "btn"} >
                <Button data-toggle="popover" title="Profile" type="button" className="button">Profile</Button>
              </Link>}
          </Modal.Footer>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default SuccessModal;