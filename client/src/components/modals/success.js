import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

const SuccessModal = ({ props }) => {
  // Show onClick of "Update" or "Submit" button, if !res.err
  // Gives success message as does success page
  // Buttons give user choice to return to previous {conference or session}, allConfsPage or profilePage
  // New uses props.urlId
  // Edit uses props.urlType EXCEPT
  // "update_user" uses props.urlId AND
  // "new_session" and "propose_session" use props.urlType

  
  return (
    <>
      {props.show === true &&
        <Modal show={props.show} onHide={props.hide} backdrop="static" keyboard={false} centered>
          <Modal.Header closeButton>
            <Modal.Title>Success!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {props.urlId === "new_conference" &&
              <h4>You have created a new conference.</h4>}
            {props.urlType === "edit_conference" &&
              <h4>You have updated your conference.</h4>}
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>
      }
    </>
  )
}

export default SuccessModal;