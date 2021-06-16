import React, { ChangeEvent, MouseEvent, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { SessionAPI } from "../../utils/api";
import { AxiosError, AxiosResponse } from "axios";
import "./style.css"

const AssignModal = (props: any): object => {
  const allSess: any[] = props.allSess;
  const filteredSess: any[] = allSess.filter(sess => (sess.sessRoom === "TBA" || sess.sessRoom === "TBD" || sess.sessRoom === "tba" || sess.sessRoom === "tbd"));
  console.log({ allSess }, { filteredSess });
  const [errThrown, setErrThrown] = useState<string>()
  const [session, setSession] = useState<any | void>();


  // Modal variables
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);

  // Sets boolean to show or hide relevant modal
  const handleShowSuccess = () => setShowSuccess(true);
  const handleHideSuccess = () => setShowSuccess(false);
  const handleShowError = () => setShowError(true);
  const handleHideError = () => setShowError(false);

  // Parse time to 24-hour to store in db
  // Split hh, mm, am/pm
  // If pm, hh + 12
  // Join hh:mm
  const sTime: string = props.startTime.slice(0, props.startTime.length - 2);
  const eTime: string = props.endTime.slice(0, props.endTime.length - 2);

  // Handles input changes to form fields
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): any => {
    const { value } = e.target;
    switch (value) {
      case "new":
        setSession({ ...session, sessDate: props.date, sessRoom: props.room, sessStart: sTime, sessEnd: eTime })
        break;
      default:
        const sess = allSess.filter(sess => sess._id === value)[0];
        console.log(sess);
        setSession({ ...sess, sessDate: props.date, sessRoom: props.room, sessStart: sTime, sessEnd: eTime })
    }
  };

  // Handles click on "Update" button
  const updateSess = async (e: MouseEvent): Promise<void> => {
    e.preventDefault();
    SessionAPI.updateSession({ ...session }, session._id)
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
        <Modal.Title className="modalHead">
          <h2>Assign Session</h2><br />
          <p>Date: {props.date}</p>
          <p>Room: {props.room}</p>
          <p>Time: {props.startTime}-{props.endTime}</p>
        </Modal.Title>
        <Modal.Body className="modalBody">
          <Form className="assignForm">

            <Form.Group controlId="formAssignSessChoose">
              <Row>
                <Col sm={12}>
                  <Form.Label>Choose session:</Form.Label>
                  <Form.Control as="select" className="formSelect" onChange={handleInputChange}>
                    <option value="new">Create New Session</option>
                    {filteredSess.map((sess, idx) => (
                      <option key={idx} value={sess._id}>{sess.sessName}</option>
                    ))}
                  </Form.Control>
                </Col>
              </Row>
            </Form.Group>

          </Form>

          <Modal.Footer className="modalFooter">

            {session?.sessName !== undefined
              ? <Button data-toggle="popover" title="Assign" className="button" type="submit" onClick={updateSess}>Assign Session</Button>
              : <Button data-toggle="popover" title="Create" className="button" type="submit" onClick={updateSess}>Create Session</Button>}

            {/* No, take no action button */}
            <Button data-toggle="popover" title="No" className="button" onClick={props.hide} type="submit">No, take me back</Button>

          </Modal.Footer>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default AssignModal;