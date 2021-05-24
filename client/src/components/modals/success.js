import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import "./style.css"

const SuccessModal = (props) => {
  const location = useLocation();

  // Buttons give user choice to return to previous {conference or session}, allConfsPage or profilePage


  return (
    <>
      <Modal show={props.show} onHide={props.hide} backdrop="static" keyboard={false} centered={true} className="modal">
        <Modal.Header className="modalHead">
          <Modal.Title className="modalTitle"><h2>Success!</h2></Modal.Title>
        </Modal.Header>
        <Modal.Body className="modalBody">

          {/* Update User form */}
          {props.urlid === "update_user" &&
            <h4>You have updated your information.</h4>}

          {/* Add Conference form */}
          {props.urlid === "new_conference" &&
            <h4>You have created a new conference.</h4>}

          {/* Edit Conference form */}
          {props.urltype === "edit_conference" &&
            <h4>You have updated your conference.</h4>}

          {/* Add Session form */}
          {props.urltype === "new_session" &&
            <h4>You have added a session. Click "Next Page" to add presenter information.</h4>}

          {/* Edit Session form */}
          {props.urltype === "edit_session" &&
            <h4>You have updated your session.</h4>}

          {/* Propose Session form */}
          {props.urltype === "propose_session" &&
            <h4>You have added basic information for your proposal. Click "Next Page" to add supplemental information.</h4>}

          {/* Edit Session Proposal form */}
          {props.urltype === "edit_propose_session" &&
            <h4>You have updated your proposal. Click "Next Page" to edit supplemental information.</h4>}

          {/* Session Proposal Supplemental form */}
          {props.urltype === "propose_session_supp" &&
            <h4>You have added supplemental information for your proposal. Click "Next Page" to add presenter information.</h4>}

          {/* Edit Session Proposal Supplemental form */}
          {props.urltype === "edit_propose_session_supp" &&
            <h4>You have updated supplemental information for your proposal. Click "Next Page" to edit presenter information.</h4>}

          {/* Add Presenter(s) form */}
          {props.urltype === "new_session_pres" &&
            <h4>You have added your session.</h4>}

          {/* Edit Presenter(s) form */}
          {props.urltype === "edit_presenter" &&
            <h4>You have updated presenter information for this session.</h4>}

          {/* Session Proposal Presenter form */}
          {props.urltype === "propose_session_pres" &&
            <h4>You have added presenter information for your proposal.</h4>}

          {/* Edit Session Proposal Presenter form */}
          {props.urltype === "edit_propose_session_pres" &&
            <h4>You have updated presenter information for your proposal.</h4>}

          {/* Registration form */}
          {props.urltype === "register_attend" &&
            <h4>You have registered for {props.confname}.</h4>}

          {/* Add Attendee form (available from Attendee Table) */}
          {props.urltype === "admin_register_att" &&
            <h4>You have registered {props.attname} for {props.confname}.</h4>}

          {/* Edit Registration form */}
          {props.urltype === "register_edit" &&
            <h4>You have edited your registration for {props.confname}.</h4>}

          {/* Edit Attendee form, owner/admin version */}
          {props.urltype === "admin_edit_att" &&
            <h4>You have edited {props.attname}'s registration for {props.confname}.</h4>}

          {/* Register Exhibit form */}
          {props.urltype === "register_exhibit" &&
            <h4>You have registered your exhibit for {props.confname}.</h4>}

          {/* Add Exhibitor form (available from Exhibitor Table) */}
          {props.urltype === "admin_register_exh" &&
            <h4>You have registered {props.exhname}'s exhibit for {props.confname}.</h4>}

          {/* Edit Exhibit form */}
          {props.urltype === "edit_exhibit" &&
            <h4>You have edited your exhibit's information for {props.confname}.</h4>}

          {/* Edit Exhibit form, owner/admin version */}
          {props.urltype === "admin_edit_exh" &&
            <h4>You have edited {props.exhname}'s exhibit information for {props.confname}.</h4>}

          {/* Unregister button */}
          {(props.urlid === "profile" || props.urlid === "conferences" || props.urltype === "details") &&
            (props.btnname === "unregAtt" &&
              <h4>You have unregistered from {props.confname}. If you paid a registration fee, please contact the conference organizers.</h4>)}

          {/* Unregister button, owner/admin version */}
          {props.urltype === "attendees" &&
            (props.btnname === "admUnregAtt" &&
              <h4>You have unregistered {props.attname} from {props.confname}.</h4>)}

          {/* Unregister Exhibit button */}
          {(props.urlid === "profile" || props.urlid === "conferences" || props.urltype === "details") &&
            (props.btnname === "unregExh" &&
              <h4>You have unregistered your exhibit from {props.confname}. If you paid a registration fee, please contact the conference organizers.</h4>)}

          {/* Unregister Exhibit, owner/admin version */}
          {props.urltype === "exhibitors" &&
            (props.btnname === "admUnregExh" &&
              <h4>You have unregistered {props.exhname}'s exhibit from {props.confname}.</h4>)}

          {/* Remove Presenter button, owner/admin version */}
          {props.urltype === "presenters" &&
            (props.btnname === "admUnregPres" &&
              <h4>{props.presname} is no longer presenting at {props.confname}.</h4>)}

          {/* Cancel Conference button */}
          {(props.urlid === "profile" || props.urlid === "conferences" || props.urltype === "details") &&
            (props.btnname === "confCancel" &&
              <h4>{props.confname} has been cancelled. An email will be sent to any registered participants.</h4>)}

          {/* Delete Session button */}
          {props.urltype === "details" &&
            (props.btnname === "sessDelete" &&
              <h4>Delete! Delete! Delete!</h4>)}

          {/* Navigation buttons */}
          <Modal.Footer className="modalFooter">

            {/* Close modal and return to Conference Details page */}
            {(props.urltype === "details" || props.urltype === "attendees" || props.urltype === "exhibitors" || props.urltype === "presenters") &&
              <Button data-toggle="popover" title={props.confname} type="button" className="button" onClick={props.hide}>Return to Details</Button>}

            {/* Add Session form: go on to Presenter Form */}
            {(props.urltype === "new_session") &&
              <Link to={`/new_session_pres/${props.urlid}`} className={location.pathname === `/new_session_pres/${props.urlid}` ? "btnactive" : "btn"} >
                <Button data-toggle="popover" title="Presenter information" type="button" className="button">Next page</Button>
              </Link>}

            {/* Propose Session form: go on to Supplemental Information Form */}
            {(props.urltype === "propose_session") &&
              <Link to={`/propose_session_supp/${props.urlid}`} className={location.pathname === `/propose_session_supp/${props.urlid}` ? "btnactive" : "btn"} >
                <Button data-toggle="popover" title="Supplemental information" type="button" className="button">Next page</Button>
              </Link>}

            {/* Propose Session form: go on to Presenter Form */}
            {(props.urltype === "propose_session_supp") &&
              <Link to={`/propose_session_pres/${props.urlid}`} className={location.pathname === `/propose_session_pres/${props.urlid}` ? "btnactive" : "btn"} >
                <Button data-toggle="popover" title="Presenter information" type="button" className="button">Next page</Button>
              </Link>}

            {/* Edit Propose Session form: go on to Supplemental Information Form */}
            {(props.urltype === "edit_propose_session") &&
              <Link to={`/edit_propose_session_supp/${props.urlid}`} className={location.pathname === `/edit_propose_session_supp/${props.urlid}` ? "btnactive" : "btn"} >
                <Button data-toggle="popover" title="Supplemental information" type="button" className="button">Next page</Button>
              </Link>}

            {/* Edit Propose Session form: go on to Presenter Form */}
            {(props.urltype === "edit_propose_session_supp") &&
              <Link to={`/edit_propose_session_pres/${props.urlid}`} className={location.pathname === `/edit_propose_session_pres/${props.urlid}` ? "btnactive" : "btn"} >
                <Button data-toggle="popover" title="Presenter information" type="button" className="button">Next page</Button>
              </Link>}

            {/* Link to Conference Details page */}
            {(props.urltype !== "details" && props.urltype !== "attendees" && props.urltype !== "exhibitors" && props.urltype !== "presenters" && props.urltype !== "new_session" && props.urlid !== "new_conference" && props.urlid !== "update_user") &&
              <Link to={`/details/${props.conference._id}`} className={location.pathname === `/details/${props.conference._id}` ? "btnactive" : "btn"} >
                <Button data-toggle="popover" title={props.confname} type="button" className="button">{props.confname}</Button>
              </Link>}

            {/* Return to Profile page */}
            {props.urlid === "profile" &&
              <Button data-toggle="popover" title="Profile" type="button" className="button" onClick={props.hide}>Profile</Button>}

            {/* Link to Profile page */}
            {props.urlid !== "profile" && props.urltype !== "new_session" &&
              <Link to="/profile" className={location.pathname === "/profile" ? "btnactive" : "btn"} >
                <Button data-toggle="popover" title="Profile" type="button" className="button">Profile</Button>
              </Link>}

            {/* Return to Conferences page */}
            {props.urlid === "conferences" &&
              <Button data-toggle="popover" title="Conferences" type="button" className="button" onClick={props.hide}>Conferences</Button>}

            {/* Link to Conferences page */}
            {props.urlid !== "conferences" && props.urltype !== "new_session" &&
              <Link to="/conferences" className={location.pathname === "/conferences" ? "btnactive" : "btn"} >
                <Button data-toggle="popover" title="Conferences" type="button" className="button">Conferences</Button>
              </Link>}

          </Modal.Footer>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default SuccessModal;