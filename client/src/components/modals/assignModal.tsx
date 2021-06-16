import React, { ChangeEvent, MouseEvent, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { SessionAPI } from "../../utils/api";
import { AxiosError, AxiosResponse } from "axios";
import "./style.css"

const AssignModal = (props: any): object => {
  const allSess: any[] = props.allSess;
  const [errThrown, setErrThrown] = useState<string>()
  const [session, setSession] = useState<object | void>();


  // Modal variables
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);

  // Sets boolean to show or hide relevant modal
  const handleShowSuccess = () => setShowSuccess(true);
  const handleHideSuccess = () => setShowSuccess(false);
  const handleShowError = () => setShowError(true);
  const handleHideError = () => setShowError(false);

  // Handles input changes to form fields
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): any => {
    const { value } = e.target;
    switch (value) {
      case "new":
        setSession({ ...session, sessRoom: props.room, sessStart: props.startTime, sessEnd: props.endTime })
        break;
      default:
        const sess = allSess.filter(sess => sess._id === value);
        setSession({ ...sess, sessRoom: props.room, sessStart: props.startTime, sessEnd: props.endTime })
    }
  };

  const updateSess = async (e: MouseEvent): Promise<void> => {
    e.preventDefault();
    SessionAPI.updateSession({ ...session }, props.session._id)
      .then((resp: AxiosResponse<object>) => {
        console.log("from assignModal updateSess", resp.data)
        // TS doesn't like resp.err
        if (resp.status !== 422) {
          handleShowSuccess();
        }
      })
      .catch((err: AxiosError) => {
        console.log(err);
        setErrThrown(err.message);
        handleShowError();
      })
  }

  return (
    <>
      <Modal show={props.show} onHide={props.hide} backdrop="static" keyboard={false} centered={true} className="modal">
        <Modal.Body className="modalBody">
          <Form className="assignForm">

            <Form.Group controlId="formAssignSessChoose">
              <Row>
                <Col sm={12}>
                  <Form.Label>Choose session:</Form.Label>
                  <Form.Control as="select" className="formSelect" onChange={handleInputChange}>
                    <option value="new">Create New Session</option>
                    {allSess.map((sess, idx) => (
                      <option key={idx} value={sess._id}>{sess.sessName}</option>
                    ))}
                  </Form.Control>
                </Col>
              </Row>
            </Form.Group>

          </Form>
          { }
          <Button data-toggle="popover" title="Assign" className="button" type="submit" onClick={updateSess}>Assign Session</Button>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default AssignModal;