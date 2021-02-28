import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { AttendeeAPI, ConferenceAPI, ExhibitorAPI } from "../../utils/api";
import "./style.css"

const Confirm = () => {
  const { user, isAuthenticated } = useAuth0();
  const history = useHistory();
  const location = useLocation();
  const [pageReady, setPageReady] = useState(false);
  const [conference, setConference] = useState({});

  const urlArray = window.location.href.split("/")
  const confId = urlArray[urlArray.length - 1]
  const unregType = urlArray[urlArray.length - 2]

  useEffect(() => {
    ConferenceAPI.getConferenceById(confId)
      .then(resp => {
        console.log("from confirm getConfById", resp.data)
        const confArr = resp.data[0];
        setConference(confArr);
      })
      .catch(err => console.log(err));
    setPageReady(true);
  }, [])

  // At some point, this needs to send a message or alert to conference organizer(s)
  function handleAttUnregister(confId, email) {
    console.log("from confirm attUnreg", conference._id, user.email)
    AttendeeAPI.unregisterAttendee(conference._id, user.email)
      .then(history.push("/unregistered"))
      .catch(err => console.log(err));
  }

  function handleExhUnregister(confId, email) {
    console.log("from confirm exhUnreg", conference._id, user.email)
    ExhibitorAPI.deleteExhibitor(conference._id, user.email)
      .then(history.push("/unregistered"))
      .catch(err => console.log(err));
  }

  return (
    <>
      { pageReady === true &&
        isAuthenticated && (
          <Container fluid>
            <Row>
              <Col sm={2}></Col>
              <Col sm={8}>
                {unregType === "unregister_confirm" &&
                  <h1>Are you sure you want to unregister from {conference.confName}?</h1>}
                {unregType === "unregister_exhibit_confirm" &&
                  <h1>Are you sure you want to unregister your exhibit from {conference.confName}?</h1>}
              </Col>
            </Row>
            <Row>
              <Col sm={3}></Col>
              <Col sm={2}>
                {unregType === "unregister_confirm" &&
                  <Button data-toggle="popover" title="Unregister Attendee" className="button" onClick={handleAttUnregister} type="submit">Yes, Unregister</Button>}
                {unregType === "unregister_exhibit_confirm" &&
                  <Button data-toggle="popover" title="Unregister Exhibit" className="button" onClick={handleExhUnregister} type="submit">Yes, Unregister</Button>}
              </Col>
              <Col sm={1}></Col>
              <Col sm={2}>
                <Link to="/profile" className={location.pathname === "/profile" ? "link active" : "link"}>
                  <Button data-toggle="popover" title="Stay registered" className="button" type="submit">No, stay registered</Button>
                </Link>
              </Col>
            </Row>
          </Container>
        )
      }
    </>
  )
}

export default Confirm;