import React, { ChangeEvent, MouseEvent, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { ErrorModal, SuccessModal } from "./index";
import { SessionAPI } from "../../utils/api";
import { AxiosError, AxiosResponse } from "axios";
import "./style.css"

const AssignModal = (props: any): object => {
  const allSess: any[] = props.allSess;
  const filteredSess: any[] = allSess.filter(sess => (sess.sessRoom === "TBA" || sess.sessRoom === "TBD" || sess.sessRoom === "tba" || sess.sessRoom === "tbd"));
  let sessData: any;
  const [errThrown, setErrThrown] = useState<string>()
  const [session, setSession] = useState<any | void>();

  // Modal variables
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);

  // Sets boolean to show or hide relevant modal
  const handleShowSuccess = () => setShowSuccess(true);
  const handleHideSuccess = () => {
    setShowSuccess(false);
    props.change();
  }
  const handleShowError = () => setShowError(true);
  const handleHideError = () => {
    setShowError(false);
    props.change();
  }

  // Parse time to 24-hour to store in db
  const dbTime = (time: string): string => {
    const timeArr1: string[] = time.split(":");
    const timeArr2: string[] = [timeArr1[1].slice(0, 2), timeArr1[1].slice(2)];
    const hh = timeArr2[1] === "pm" ? JSON.stringify(JSON.parse(timeArr1[0]) + 12) : timeArr1[0];
    const dbTime = `${hh}:${timeArr2[0]}`
    return dbTime;
  }

  // Handles input changes to form fields
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): any => {
    const { value } = e.target;
    switch (value) {
      case "new":
        sessData = { ...session, sessDate: props.date, sessRoom: props.room, sessStart: dbTime(props.startTime), sessEnd: dbTime(props.endTime) }
        setSession(sessData);
        // return sessData;
        break;
      default:
        const sess = allSess.filter(sess => sess._id === value)[0];
        sessData = { ...sess, sessDate: props.date, sessRoom: props.room, sessStart: dbTime(props.startTime), sessEnd: dbTime(props.endTime) }
        setSession(sessData);
        // return sessData
    }
    console.log({ session }, { sessData })
    return sessData;
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
        console.log(err.message);
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
            <Row>
              {session?.sessName !== undefined
                ? <Button data-toggle="popover" title="Assign" className="button" type="submit" onClick={updateSess}>Assign Session</Button>
                : <Button data-toggle="popover" title="Create" className="button" type="submit" onClick={updateSess}>Create Session</Button>}

              {/* No, take no action button */}
              <Button data-toggle="popover" title="No, take me back" className="button" type="submit" onClick={props.hide}>No, take me back</Button>
            </Row>

          </Modal.Footer>
        </Modal.Body>

        {session?._id !== undefined &&
          <>
            <SuccessModal session={session} confname={props.conference.confName} conference={props.conference} urlid={props.urlid} urltype={props.urltype} show={showSuccess === true} hide={() => handleHideSuccess()} />

            <ErrorModal session={session} confname={props.conference.confName} urlid={props.urlid} urltype={props.urltype} errmsg={errThrown} show={showError === true} hide={() => handleHideError()} />
          </>}

      </Modal>
    </>
  )
}

export default AssignModal;