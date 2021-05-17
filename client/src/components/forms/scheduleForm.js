import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Container, Form, Row, Col, Button, Card, Image } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { ScheduleAPI, ConferenceAPI } from "../../utils/api";
import "./style.css";

const ScheduleForm = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const [conference, setConference] = useState();
  const [schedule, setSchedule] = useState();
  const [confReady, setConfReady] = useState(false);


  // Grabs conference ID from URL
  const urlArray = window.location.href.split("/")
  const confId = urlArray[urlArray.length - 1]
  const formType = urlArray[urlArray.length - 2];


  const fetchConf = async (id) => {
    await ConferenceAPI.getConferenceById(id)
      .then(resp => {
        console.log("from schedForm fetchConf", resp.data)
        setConference(resp.data[0])
        setConfReady(true)
      })
  }

  // Handles input changes to form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "schedRooms") {
      // Splits input to sessPresEmail field at commas to create an array
      let rooms = value.split(",")
      setSchedule({ ...schedule, schedRooms: rooms })
    } else if (name === "schedTimes") {
      let times = value.split(",")
      setSchedule({ ...schedule, schedTimes: times })
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

  }

  const handleFormUpdate = (e) => {
    e.preventDefault();

  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchConf(confId);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {!isAuthenticated &&
        <Row>
          <h1 className="authRemind">Please <Link to={window.location.origin} className="login" onClick={() => loginWithRedirect()}>
            log in
          </Link> to add or edit a session.</h1>
          <div className="authLogo"><Image fluid="true" className="loadLogo" src="/images/bristlecone-dark.png" alt="BCMS logo" /></div>
        </Row>}

      {isAuthenticated &&
        confReady === true &&
        (user.email === conference.ownerEmail || conference.confAdmins.includes(user.email)) &&
        <Container>
          <Form className="schedForm">

            <Row>
              <Col sm={2}>
                {(formType === "edit_presenter" || formType === "admin_edit_pres")
                  ? <Button data-toggle="popover" title="Update" className="button" onClick={handleFormUpdate} type="submit">Update Form</Button>
                  : <Button data-toggle="popover" title="Submit" className="button" onClick={handleFormSubmit} type="submit">Submit Form</Button>}
              </Col>
            </Row>

            <Card className="formCard">
              <Card.Body className="cardBody">
                <Row>
                  <Col sm={12}>
                    <Form.Group controlId="formSchedRooms">
                      <Form.Label>Room names:</Form.Label><br />
                      <Form.Text className="subtitle" muted>Please separate room names with commas.</Form.Text>
                      <Form.Control type="input" name="schedRooms" placeholder="Enter room names here" value={schedule.schedRooms} className="formInput" onChange={handleInputChange} />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col sm={12}>
                    <Form.Group controlId="formSchedTimes">
                      <Form.Label>Time blocks:</Form.Label><br />
                      <Form.Text className="subtitle" muted>Please use the form hh:mm am/pm-hh:mm am/pm and separate by commas.</Form.Text>
                      <Form.Control type="input" name="schedTimes" placeholder="Enter time blocks here" value={schedule.schedTimes} className="formInput" onChange={handleInputChange} />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

          </Form>
        </Container>}
    </>
  )

};

export default ScheduleForm;