import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { AttendeeAPI } from "../../utils/api";
import "./style.css";

const Registration = () => {
  const { user, isAuthenticated } = useAuth0();
  const history = useHistory();
  const [pageReady, setPageReady] = useState(false);
  const [userInfo, setUserInfo] = useState({})
  const [attendee, setAttendee] = useState({})

  const urlArray = window.location.href.split("/")
  const confId = urlArray[urlArray.length - 1]

  useEffect(() => {
    setAttendee({ ...attendee, confId: confId })
    setPageReady(true);
  }, [])

  const handleInputChange = (e) => {
    setAttendee({ ...attendee, [e.target.name]: e.target.value })
  };

  const handleFormUpdate = (e) => {
    e.preventDefault();
    console.log("Attendee update", confId, user.email);
    AttendeeAPI.updateAttendee({ ...attendee }, confId, user.email)
      .then(history.push("/attendee_updated"))
      .catch(err => console.log(err))
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Attendee submit")
    AttendeeAPI.registerAttendee({ ...attendee, email: user.email })
      .then(history.push(`/register_success/${confId}`))
      .catch(err => console.log(err));
  }

  return (
    <>
      { pageReady === true &&
        isAuthenticated && (
          <Container>
            <Form className="regForm">

              <Row>
                <Form.Group controlId="formRegName">
                  <Col sm={6}>
                    <Form.Label>Given name: *</Form.Label>
                    <Form.Control required type="input" name="givenName" placeholder="Martha" value={attendee.givenName} className="attendeeFName" onChange={handleInputChange} />
                  </Col>
                  <Col sm={6}>
                    <Form.Label>Family name: *</Form.Label>
                    <Form.Control required type="input" name="familyName" placeholder="Jones" value={attendee.familyName} className="attendeeLName" onChange={handleInputChange} />
                  </Col>
                </Form.Group>
              </Row>

              <Row>
                <Form.Group controlId="formRegPhone">
                  <Col sm={6}>
                    <Form.Label>Contact phone #: *</Form.Label><br />
                    <Form.Control required type="input" name="phone" placeholder="(123)456-7890" value={attendee.phone} className="attendeePhone" onChange={handleInputChange} />
                  </Col>
                </Form.Group>
              </Row>

            </Form>
          </Container>
        )}
    </>
  )

}

export default Registration;