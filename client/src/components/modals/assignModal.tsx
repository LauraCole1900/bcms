import React, { ChangeEvent, MouseEvent, ReactElement, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { SessionAPI } from "../../utils/api";
import { handleDbTime } from "../../utils/functions";
import { Session } from "../../utils/interfaces";
import { AxiosError, AxiosResponse } from "axios";
import "./style.css"

const AssignModal = (props: any): ReactElement => {
  const history = useHistory();
  const allSess: Array<any> = props.allSess;
  const filteredSess: Array<Session> = allSess.filter((sess: Session) => (sess.sessRoom === "TBA" || sess.sessRoom === "TBD" || sess.sessRoom === "tba" || sess.sessRoom === "tbd"));
  let sessData: Session;
  const [session, setSession] = useState<Session>();

  // Handles input changes to form fields
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): any => {
    const { value } = e.target;
    switch (value) {
      case "new":
        sessData = { ...session!, sessDate: props.date, sessRoom: props.room, sessStart: handleDbTime(props.startTime), sessEnd: handleDbTime(props.endTime) }
        props.setThisSess(sessData);
        setSession(sessData);
        break;
      default:
        const sess: Session = allSess.filter((sess: Session) => sess._id.toString() === value)[0];
        sessData = { ...sess, sessDate: props.date, sessRoom: props.room, sessStart: handleDbTime(props.startTime), sessEnd: handleDbTime(props.endTime) }
        props.setThisSess(sessData);
        setSession(sessData);
    }
    return sessData;
  };

  // Handles click on "Update" button
  const handleUpdateSess = (e: MouseEvent): any | void => {
    e.preventDefault();
    const { name } = e.target as HTMLButtonElement
    props.setBtnName(name);
    SessionAPI.updateSession({ ...session }, session!._id)
      .then((resp: AxiosResponse<Session>) => {
        console.log("from assignModal updateSess", resp.data)
        // TS doesn't like resp.err
        if (resp.status !== 422) {
          props.handleShowSuccess();
        }
      })
      .catch((err: AxiosError) => {
        console.log(err);
        props.errThrown(err.message);
        props.handleShowError();
      })
  }

  // Handles click on "Create" button
  const handleCreateSess = (e: MouseEvent): any | void => {
    e.preventDefault();
    const { name } = e.target as HTMLButtonElement
    props.setBtnName(name);
    SessionAPI.saveSession({ confId: props.urlid, sessName: "", sessPresEmails: "", sessDate: props.date, sessStart: handleDbTime(props.startTime), sessEnd: handleDbTime(props.endTime), sessDesc: "", sessKeynote: "", sessPanel: "", sessRoom: props.room, sessAccepted: "yes" })
      .then((resp: AxiosResponse<Session>) => {
        console.log("from assignModal createSess", resp.data)
        // TS doesn't like resp.err
        if (resp.status !== 422) {
          history.push(`/edit_session/${resp.data._id}`)
        }
      })
      .catch((err: AxiosError) => {
        console.log(err);
        props.errThrown(err.message);
        props.handleShowError();
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
                      <option key={idx} value={sess._id.toString()}>{sess.sessName}</option>
                    ))}
                  </Form.Control>
                </Col>
              </Row>
            </Form.Group>

          </Form>

          <Modal.Footer className="modalFooter">

            {session?.sessName !== undefined
              ? <Button data-toggle="popover" title="Assign" name="Assign" className="button" type="button" onClick={(e) => handleUpdateSess(e)}>Assign Session</Button>
              : <Button data-toggle="popover" title="Create" className="button" type="button" onClick={handleCreateSess}>Create Session</Button>}

            {/* No, take no action button */}
            <Button data-toggle="popover" title="No, take me back" className="button" type="button" onClick={props.hide}>No, take me back</Button>

          </Modal.Footer>
        </Modal.Body>

      </Modal>
    </>
  )
}

export default AssignModal;