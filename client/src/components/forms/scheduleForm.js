import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Container, Form, Row, Col, Button, Card, Image } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { ErrorModal, SuccessModal } from "../modals"
import { ScheduleAPI } from "../../utils/api";
import "./style.css";

const ScheduleForm = (props) => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const [schedule, setSchedule] = useState(props.schedule);
  const [errThrown, setErrThrown] = useState();

  // Grabs conference ID from URL
  const urlArray = window.location.href.split("/")
  const confId = urlArray[urlArray.length - 1]
  const formType = urlArray[urlArray.length - 2];

  // Modal variables
  const [showSuccess, setShowSuccess] = useState(false);
  const [showErr, setShowErr] = useState(false);

  // Sets boolean to show or hide relevant modal
  const handleShowSuccess = () => setShowSuccess(true);
  const handleHideSuccess = () => setShowSuccess(false);
  const handleShowErr = () => setShowErr(true);
  const handleHideErr = () => setShowErr(false);

  // Handles input changes to form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Splits inputs at commas to create an array
    let array = value.split(",")
    setSchedule({ ...schedule, [name]: array })
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Schedule submit", schedule)
    // POST call to create schedule document
    ScheduleAPI.saveSchedule({ ...schedule, confId: props.conference._id })
      .then(resp => {
        // If no errors thrown, show Success modal
        if (!resp.err) {
          handleShowSuccess();
        }
      })
      .catch(err => {
        console.log(err)
        setErrThrown(err.message);
        handleShowErr();
      })
  }

  const handleFormUpdate = (e) => {
    e.preventDefault();
    console.log("Schedule update", confId);
    // PUT call to update schedule document
    ScheduleAPI.updateScheduleByConfId({ ...schedule }, confId)
      .then(res => {
        // If no errors thrown, show Success modal
        if (!res.err) {
          handleShowSuccess();
        }
      })
      // If yes errors thrown, setState(err.message) and show Error modal
      .catch(err => {
        console.log(err)
        setErrThrown(err.message);
        handleShowErr();
      })

  }


  return (
    <>
      {!isAuthenticated &&
        <Row>
          <h1 className="authRemind">Please <Link to={window.location.origin} className="login" onClick={() => loginWithRedirect()}>
            log in
          </Link> to create or edit the schedule.</h1>
          <div className="authLogo"><Image fluid="true" className="loadLogo" src="/images/bristlecone-dark.png" alt="BCMS logo" /></div>
        </Row>}

      <Container>
        <Form className="schedForm">

          <Row>
            <Col sm={2}>
              {Object.keys(props.schedule).length !== 0
                ? <Button data-toggle="popover" title="Update" className="button" onClick={handleFormUpdate} type="submit">Update Schedule</Button>
                : <Button data-toggle="popover" title="Submit" className="button" onClick={handleFormSubmit} type="submit">Create Schedule</Button>}
            </Col>
          </Row>

          <Row>
            <Col sm={10}>
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
            </Col>
          </Row>

          <Row>
            <Col sm={2}>
              {Object.keys(props.schedule).length !== 0
                ? <Button data-toggle="popover" title="Update" className="button" onClick={handleFormUpdate} type="submit">Update Schedule</Button>
                : <Button data-toggle="popover" title="Next Page" className="button" onClick={handleFormSubmit} type="submit">Create Schedule</Button>}
            </Col>
          </Row>

        </Form>

        <SuccessModal conference={props.conference} confname={props.conference.confName} urlid={props.urlid} urltype={formType} show={showSuccess} hide={e => handleHideSuccess(e)} />

        <ErrorModal conference={props.conference} confname={props.conference.confName} urlid={confId} urltype={props.urltype} errmsg={errThrown} show={showErr} hide={e => handleHideErr(e)} />

      </Container>
    </>
  )

};

export default ScheduleForm;