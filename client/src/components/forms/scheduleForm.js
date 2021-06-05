import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Form, Row, Col, Button, Card, Image } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { ErrorModal, SuccessModal } from "../modals"
import { ScheduleAPI, ConferenceAPI } from "../../utils/api";
import "./style.css";

const ScheduleForm = (props) => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const [schedule, setSchedule] = useState(props.schedule);
  const [errThrown, setErrThrown] = useState();
  const [confReady, setConfReady] = useState(false);

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


  // const fetchConf = async (id) => {
  //   await ConferenceAPI.getConferenceById(id)
  //     .then(resp => {
  //       console.log("from schedForm fetchConf", resp.data)
  //       setConference(resp.data[0])
  //       setConfReady(true)
  //     })
  // }

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
    console.log("Schedule update", schedule._id);
    // PUT call to update schedule document
    ScheduleAPI.updateScheduleById({ ...schedule }, schedule._id)
      .then(resp => {
        // If no errors thrown, show Success modal
        if (!resp.err) {
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

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     fetchConf(confId);
  //   }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

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

          <Card className="formCard">
            <Card.Body className="cardBody">
              <Row>
                <Col sm={12}>
                  <Form.Group controlId="formSchedRooms">
                    <Form.Label>Room names:</Form.Label><br />
                    <Form.Text className="subtitle" muted>Please separate room names with commas.</Form.Text>
                    <Form.Control type="input" name="schedRooms" placeholder="Enter room names here" value={schedule.schedRooms.join(", ")} className="formInput" onChange={handleInputChange} />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col sm={12}>
                  <Form.Group controlId="formSchedTimes">
                    <Form.Label>Time blocks:</Form.Label><br />
                    <Form.Text className="subtitle" muted>Please use the form hh:mm am/pm-hh:mm am/pm and separate by commas.</Form.Text>
                    <Form.Control type="input" name="schedTimes" placeholder="Enter time blocks here" value={schedule.schedTimes.join(", ")} className="formInput" onChange={handleInputChange} />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

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