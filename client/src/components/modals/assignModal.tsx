import React, { ChangeEvent, MouseEvent, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { SessionAPI } from "../../utils/api";
import { AxiosError, AxiosResponse } from "axios";
import "./style.css"

interface Session {
  confId: string,
  sessName: string,
  sessPresEmails: string[],
  sessDate: string,
  sessStart: string,
  sessEnd: string,
  sessDesc: string,
  sessKeynote: string,
  sessPanel: string,
  sessRoom: string,
  sessAccepted: string,
  _id: string
}

const AssignModal = (props: any): object => {
  const history = useHistory();
  const allSess: any[] = props.allSess;
  const filteredSess: any[] = allSess.filter(sess => (sess.sessRoom === "TBA" || sess.sessRoom === "TBD" || sess.sessRoom === "tba" || sess.sessRoom === "tbd"));
  let sessData: any;
  // const [errThrown, setErrThrown] = useState<string>()
  const [session, setSession] = useState<any | void>();

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
        props.setThisSess(sessData);
        setSession(sessData);
        break;
      default:
        const sess = allSess.filter(sess => sess._id === value)[0];
        sessData = { ...sess, sessDate: props.date, sessRoom: props.room, sessStart: dbTime(props.startTime), sessEnd: dbTime(props.endTime) }
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
    SessionAPI.updateSession({ ...session }, session._id)
      .then((resp: AxiosResponse<object>) => {
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
    SessionAPI.saveSession({ confId: props.urlid, sessName: "", sessPresEmails: "", sessDate: props.date, sessStart: dbTime(props.startTime), sessEnd: dbTime(props.endTime), sessDesc: "", sessKeynote: "", sessPanel: "", sessRoom: props.room, sessAccepted: "yes" })
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
                      <option key={idx} value={sess._id}>{sess.sessName}</option>
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