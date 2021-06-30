import React, { ReactElement } from "react";
import { Link, useLocation } from "react-router-dom";
import { Location } from "history";
import { Button, Modal } from "react-bootstrap";
import { CloseModalButton, ConferencesButton, DetailsButton, ProfileButton } from "../buttons";
import "./style.css"

const ErrorModal = (props: any): ReactElement => {
  const location = useLocation<Location>();


  return (
    <>
      <Modal show={props.show} onHide={props.hide} backdrop="static" keyboard={false} centered={true} className="modal">
        <Modal.Header className="modalHead">
          <Modal.Title className="modalTitle"><h2>We're sorry.</h2></Modal.Title>
        </Modal.Header>
        <Modal.Body className="modalBody">
          <h3>Gremlins appear to have gotten into our system. Please copy the error message below and send it to us to help us find and banish these gremlins as quickly as we can.</h3>

          {/* Update User form */}
          {props.urlid === "update_user" &&
            <h4>{props.errmsg}. Your user information was not updated.</h4>}

          {/* Add Conference form */}
          {props.urlid === "new_conference" &&
            <h4>{props.errmsg}. Your conference was not created.</h4>}

          {/* Edit Conference form */}
          {props.urltype === "edit_conference" &&
            <h4>{props.errmsg}. Your conference was not updated.</h4>}

          {/* Create Schedule form */}
          {props.urltype === "schedule" &&
            props.btnname === undefined &&
            <h4>{props.errmsg}. Your schedule was not created.</h4>}

          {/* Create Schedule form, add session */}
          {props.urltype === "schedule" &&
            props.btnname === "Assign" &&
            <h4>{props.errmsg}. {props.session.sessName} was not added to your conference schedule.</h4>}

          {/* Add Session form */}
          {props.urltype === "new_session" &&
            <h4>{props.errmsg}. Your session was not added.</h4>}

          {/* Edit Session form */}
          {props.urltype === "edit_session" &&
            <h4>{props.errmsg}. Your session was not updated.</h4>}

          {/* Propose Session form */}
          {props.urltype === "propose_session" &&
            <h4>{props.errmsg}. Your session proposal was not added.</h4>}

          {/* Edit Session Proposal form */}
          {props.urltype === "propose_session_edit" &&
            <h4>{props.errmsg}. Your session proposal was not updated.</h4>}

          {/* Session Proposal Supplemental form */}
          {props.urltype === "propose_session_supp" &&
            <h4>{props.errmsg}. Supplemental information for your proposal was not added.</h4>}

          {/* Edit Session Proposal Supplemental form */}
          {props.urltype === "edit_propose_session_supp" &&
            <h4>{props.errmsg}. Supplemental information for your proposal was not updated.</h4>}

          {/* Add Presenter(s) form */}
          {props.urltype === "new_session_pres" &&
            <h4>{props.errmsg}. Presenter(s) was/were not added.</h4>}

          {/* Edit Presenter(s) form */}
          {props.urltype === "edit_presenter" &&
            <h4>{props.errmsg}. Presenter(s) was/were not updated.</h4>}

          {/* Session Proposal Presenter form */}
          {props.urltype === "propose_session_pres" &&
            <h4>{props.errmsg}. Presenter information for your proposal was not added.</h4>}

          {/* Edit Session Proposal Presenter form */}
          {props.urltype === "edit_propose_session_pres" &&
            <h4>{props.errmsg}. Presenter information for your proposal was not updated.</h4>}

          {/* Registration form */}
          {props.urltype === "register_attend" &&
            <h4>{props.errmsg}. Your registration for {props.confname} could not be processed at this time.</h4>}

          {/* Add Attendee form (available from Attendee Table) */}
          {props.urltype === "admin_register_att" &&
            <h4>{props.errmsg}. Your registration of {props.attname} for {props.confname} could not be processed at this time.</h4>}

          {/* Edit Registration form */}
          {props.urltype === "register_edit" &&
            <h4>{props.errmsg}. Your registration for {props.confname} could not be updated at this time.</h4>}

          {/* Edit Attendee form, owner/admin version */}
          {props.urltype === "admin_edit_att" &&
            <h4>{props.errmsg}. Your registration of {props.attname} for {props.confname} could not be updated at this time.</h4>}

          {/* Update Committee form (available from Committee Table) */}
          {props.urltype === "committee" &&
            props.btnname === "updateComm" &&
            <h4>{props.errmsg}. {props.commname}'s information could not be added or updated at this time.</h4>}

          {/* Set Committee Chair (available from Committee Table) */}
          {props.urltype === "committee" &&
            props.btnname === "chair" &&
            <h4>{props.errmsg}. The chair for the session proposal review committee for {props.confname} could not be set or updated at this time.</h4>}

          {/* Register Exhibit form */}
          {props.urltype === "register_exhibit" &&
            <h4>{props.errmsg}. The registration of your exhibit for {props.confname} could not be processed at this time.</h4>}

          {/* Add Exhibitor form (available from Exhibitor Table) */}
          {props.urltype === "admin_register_exh" &&
            <h4>{props.errmsg}. Your registration of {props.exhname}'s exhibit for {props.confname} could not be processed at this time.</h4>}

          {/* Edit Exhibit form */}
          {props.urltype === "edit_exhibit" &&
            <h4>{props.errmsg}. The registration of your exhibit for {props.confname} could not be updated at this time.</h4>}

          {/* Edit Exhibitor form, owner/admin version */}
          {props.urltype === "admin_edit_exh" &&
            <h4>{props.errmsg}. Your registration of {props.exhname}'s exhibit for {props.confname} could not be updated at this time.</h4>}

          {/* Unregister button */}
          {(props.urlid === "profile" || props.urlid === "conferences" || props.urltype === "details") &&
            (props.btnname === "unregAtt" &&
              <h4>{props.errmsg}. Your unregistration from {props.confname} could not be processed at this time.</h4>)}

          {/* Remove Member button */}
          {(props.urlid === "committee") &&
            (props.btnname === "delComm" &&
              <h4>{props.errmsg}. {props.commname} could not be removed at this time.</h4>)}

          {/* Unregister Exhibit button */}
          {(props.urlid === "profile" || props.urlid === "conferences" || props.urltype === "details") &&
            (props.btnname === "unregExh" &&
              <h4>{props.errmsg}. The unregistration of your exhibit from {props.confname} could not be processed at this time.</h4>)}

          {/* Cancel Conference button */}
          {(props.urlid === "profile" || props.urlid === "conferences" || props.urltype === "details") &&
            (props.btnname === "confCancel" &&
              <h4>{props.errmsg}. Your conference could not be cancelled at this time.</h4>)}

          {/* Delete Session button */}
          {(props.urlid === "profile" || props.urlid === "conferences" || props.urltype === "details") &&
            (props.btnname === "sessDelete" &&
              <h4>{props.errmsg}. Your session could not be deleted at this time.</h4>)}

          {/* Navigation buttons */}
          <Modal.Footer className="modalFooter">

            {/* Close modal and return to Conference Schedule page */}
            {props.urltype === "schedule" &&
              <CloseModalButton confname={props.confname} click={props.hide} page="Schedule" />}

            {/* Link to Conference Details page */}
            {(props.urltype !== "details" && props.urltype !== "attendees" && props.urltype !== "committee" && props.urltype !== "exhibitors" && props.urltype !== "presenters" && props.urltype !== "new_session" && props.urlid !== "new_conference" && props.urlid !== "update_user" && props.urlid !== "conferences" && props.urlid !== "") &&
              <DetailsButton confname={props.confname} confid={props.conference?._id} button="button" />}

            {/* Close modal and return to Conference Details page */}
            {(props.urltype === "details" || props.urltype === "attendees" || props.urltype === "committee" || props.urltype === "exhibitors" || props.urltype === "presenters") &&
              <CloseModalButton confname={props.confname} click={props.hide} page="Details" />}

            {/* Link to Profile page */}
            {props.urlid !== "profile" &&
              <ProfileButton />}

            {/* Close modal and return to Profile page */}
            {props.urlid === "profile" &&
              <CloseModalButton confname={props.confname} click={props.hide} page="Profile" />}

            {/* Link to Conferences page */}
            {props.urlid !== "conferences" &&
              <ConferencesButton />}

            {/* Close modal and return to Conference Schedule page */}
            {props.urlid === "conferences" &&
              <CloseModalButton confName={props.confname} click={props.hide} page="Conferences" />}

          </Modal.Footer>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default ErrorModal;