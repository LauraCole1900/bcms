import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Form, Row, Col, Button, Card, Image } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { AttendeeAPI, ConferenceAPI } from "../../utils/api";
import { regValidate } from "../../utils/validation";
import { ErrorModal, SuccessModal } from "../modals";
import "./style.css";

const Registration = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const [pageReady, setPageReady] = useState(false);
  const [conference, setConference] = useState({});
  const [attendee, setAttendee] = useState({
    email: "",
    givenName: "",
    familyName: "",
    phone: "",
    employerName: "",
    employerAddress: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    allergyConfirm: "",
    allergies: "",
  });
  const [errThrown, setErrThrown] = useState();
  const [errors, setErrors] = useState({});

  // Breaks down the URL
  const urlArray = window.location.href.split("/")
  // Use to find confId from the URL
  const confId = urlArray[urlArray.length - 1]
  // Use to determine whether submitting new attendee or editing existing attendee
  const formType = urlArray[urlArray.length - 2]
  console.log("registrationForm update", formType)

  // Modal variables
  const [showSuccess, setShowSuccess] = useState(false);
  const [showErr, setShowErr] = useState(false);

  // Sets boolean to show or hide relevant modal
  const handleShowSuccess = () => setShowSuccess(true);
  const handleHideSuccess = () => setShowSuccess(false);
  const handleShowErr = () => setShowErr(true);
  const handleHideErr = () => setShowErr(false);

  // GET call for conference information
  const fetchConf = async (id) => {
    await ConferenceAPI.getConferenceById(id)
      .then(resp => {
        console.log("from regForm fetchConf", resp.data)
        const confArr = resp.data[0];
        console.log({ confArr });
        setConference(confArr);
      })
      .catch(err => console.log(err));
  }

  // Handles input changes to form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAttendee({ ...attendee, [name]: value })
  };

  // Handles click on "Update" button
  const handleFormUpdate = (e) => {
    e.preventDefault();
    // Validates required inputs
    const validationErrors = regValidate([attendee, conference]);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      switch (formType) {
        case "admin_edit_att":
          console.log("Attendee update", confId)
          // PUT call to update attendee document by attId in the URL
          AttendeeAPI.updateAttendeeById({ ...attendee }, confId)
            .then(res => {
              // If no errors thrown, show Success modal
              if (!res.err) {
                handleShowSuccess();
              }
            })
            // If yes errors thrown, setState(err.message) and show Error modal
            .catch(err => {
              console.log(err);
              setErrThrown(err.message);
              handleShowErr();
            })
          break;
        default:
          console.log("Attendee update", confId, attendee.email);
          // PUT call to update attendee document by confId and email
          AttendeeAPI.updateAttendee({ ...attendee }, confId, attendee.email)
            .then(res => {
              // If no errors thrown, show Success modal
              if (!res.err) {
                handleShowSuccess();
              }
            })
            // If yes errors thrown, setState(err.message) and show Error modal
            .catch(err => {
              console.log(err);
              setErrThrown(err.message);
              handleShowErr();
            })
      }
    } else {
      console.log({ validationErrors });
    }
  };

  // Handles click on "Submit" button
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Validates required inputs
    const validationErrors = regValidate([attendee, conference]);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      console.log("Attendee submit", confId, attendee)
      // POST call to create attendee document
      AttendeeAPI.registerAttendee({ ...attendee, confId: confId })
        .then(res => {
          // If no errors thrown, show Success modal
          if (!res.err) {
            handleShowSuccess();
          }
        })
        // If yes errors thrown, setState(err.message) and show Error modal
        .catch(err => {
          console.log(err);
          setErrThrown(err.message);
          handleShowErr();
        })
    } else {
      console.log({ validationErrors });
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      switch (formType) {
        case "register_edit":
          fetchConf(confId);
          // GET call by confId and user.email to pre-populate form if URL indicates this is an already-registered attendee
          AttendeeAPI.getAttendeeToUpdate(confId, user.email)
            .then(resp => {
              console.log("from registrationForm getAttendeeToUpdate", resp.data)
              const attArr = resp.data
              setAttendee(attArr)
            })
            .catch(err => console.log(err));
          break;
        case "admin_edit_att":
          // GET call by the attId in the URL to pre-populate form
          AttendeeAPI.getAttendeeById(confId)
            .then(resp => {
              console.log("from registrationForm getAttendeeById", resp.data)
              setAttendee(resp.data);
              fetchConf(resp.data.confId)
            })
            .catch(err => console.log(err));
          break;
        case "admin_register_att":
          fetchConf(confId);
          // Sets conference ID in state as attendee.confId
          setAttendee({ ...attendee, confId: confId })
          break;
        default:
          fetchConf(confId);
          // Sets conference ID in state as attendee.confId and the user's email as attendee.email
          setAttendee({ ...attendee, confId: confId, email: user.email })
      }
    }
    setPageReady(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
    <>
      {!isAuthenticated &&
        <Row>
          <h1 className="regRemind">Please <Link to={window.location.origin} className="login" onClick={() => loginWithRedirect()}>log in</Link> to register.</h1>
          <div className="authLogo"><Image fluid="true" className="loadLogo" src="/images/bristlecone-dark.png" alt="BCMS logo" /></div>
        </Row>}

      { pageReady === true &&
        isAuthenticated && (
          <Container>
            <Form className="regForm">

              <Row>
                <Col sm={2}>
                  {(formType === "register_edit" || formType === "admin_edit_att")
                    ? <Button data-toggle="popover" title="Update" className="button" onClick={handleFormUpdate} type="submit">Update Form</Button>
                    : <Button data-toggle="popover" title="Update" className="button" onClick={handleFormSubmit} type="submit">Submit Form</Button>}
                </Col>
              </Row>
              {Object.keys(errors).length !== 0 &&
                <Row>
                  <Col sm={12}>
                    <div className="error"><p>The nanobots have detected an error or omission in one or more required fields. Please review this form.</p></div>
                  </Col>
                </Row>}

              {(conference.confWaiver === "yes") &&
                <div className="alert">
                  <h5>A signed liability waiver will be required to participate in this event. It will be available at check-in to the event.</h5>
                </div>}

              <Card className="formCard">
                <Card.Title>
                  <Row>
                    <Col sm={12}>
                      <h1>Personal & Professional Information</h1>
                    </Col>
                  </Row>
                </Card.Title>
                <Card.Body className="cardBody">
                  <Row>
                    <Col sm={4}>
                      <Form.Group controlId="formRegEmail">
                        <Form.Label>Attendee email: <span className="red">*</span></Form.Label>
                        {errors.email &&
                          <div className="error"><p>{errors.email}</p></div>}
                        <Form.Control type="email" name="email" placeholder="name@email.com" value={attendee.email} className="formInput" onChange={handleInputChange} />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Form.Group controlId="formRegName">
                      <Col sm={6}>
                        <Form.Label>First name: <span className="red"><span className="red">*</span></span></Form.Label>
                        {errors.givenName &&
                          <div className="error"><p>{errors.givenName}</p></div>}
                        <Form.Control required type="input" name="givenName" placeholder="Martha" value={attendee.givenName} className="formInput" onChange={handleInputChange} />
                      </Col>
                      <Col sm={6}>
                        <Form.Label>Last name: <span className="red">*</span></Form.Label>
                        {errors.familyName &&
                          <div className="error"><p>{errors.familyName}</p></div>}
                        <Form.Control required type="input" name="familyName" placeholder="Jones" value={attendee.familyName} className="formInput" onChange={handleInputChange} />
                      </Col>
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group controlId="formRegPhone">
                      <Col sm={6}>
                        <Form.Label>Contact phone #: <span className="red">*</span></Form.Label><br />
                        {errors.phone &&
                          <div className="error"><p>{errors.phone}</p></div>}
                        <Form.Control required type="input" name="phone" placeholder="(123)456-7890" value={attendee.phone} className="formInput" onChange={handleInputChange} />
                      </Col>
                    </Form.Group>
                  </Row>

                  <Row>
                    <Col sm={12}>
                      <Form.Group controlId="formRegEmployer">
                        <Form.Label>Company, organization or school you represent:</Form.Label>
                        {errors.employerName &&
                          <div className="error"><p>{errors.employerName}</p></div>}
                        <Form.Control type="input" name="employerName" placeholder="Torchwood Institute" value={attendee.employerName} className="formInput" onChange={handleInputChange} />
                        <Form.Label>Address of your company, organization or school:</Form.Label>
                        <Form.Control type="input" name="employerAddress" placeholder="219 W 48th Street, New York, NY" value={attendee.employerAddress} className="formInput" onChange={handleInputChange} />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <Card className="formCard">
                <Card.Title>
                  <Row>
                    <Col sm={12}>
                      <h1>Emergency Information</h1>
                    </Col>
                  </Row>
                </Card.Title>
                <Card.Body className="cardBody">
                  <Row>
                    <Form.Group controlId="formRegEmergencyContact">
                      <Col sm={6}>
                        <Form.Label>Emergency contact name:</Form.Label>
                        <Form.Control type="input" name="emergencyContactName" placeholder="Sarah Jane Smith" value={attendee.emergencyContactName} className="formInput" onChange={handleInputChange} />
                      </Col>
                      <Col sm={6}>
                        <Form.Label>Emergency contact phone #:</Form.Label>
                        <Form.Control type="input" name="emergencyContactPhone" placeholder="(987)654-3210" value={attendee.emergencyContactPhone} className="formInput" onChange={handleInputChange} />
                      </Col>
                    </Form.Group>
                  </Row>

                  {(conference.confAllergies === "yes") &&
                    <Row>
                      <Form.Group controlId="allergyConfirm">
                        <Col sm={6}>
                          <Form.Label>Do you have known allergies? <span className="red">*</span></Form.Label>
                          {errors.allergyConfirm &&
                            <div className="error"><p>{errors.allergyConfirm}</p></div>}
                          <Form.Check type="radio" id="allergiesYes" name="allergyConfirm" label="Yes" value="yes" checked={attendee.allergyConfirm === "yes"} onChange={handleInputChange} />
                          <Form.Check type="radio" id="allergiesNo" name="allergyConfirm" label="No" value="no" checked={attendee.allergyConfirm === "no"} onChange={handleInputChange} />
                        </Col>
                        {(attendee.allergyConfirm === "yes") &&
                          <Col sm={6}>
                            <Form.Label>Please list your allergies:</Form.Label>
                            {errors.allergies &&
                              <div className="error"><p>{errors.allergies}</p></div>}
                            <Form.Control as="textarea" rows={5} name="allergies" placeholder="Peanuts, Eggs, Soy, Milk, Bee stings, Penicillin, etc." value={attendee.allergies} className="formText" onChange={handleInputChange} />
                          </Col>}
                      </Form.Group>
                    </Row>}
                </Card.Body>
              </Card>

              {Object.keys(errors).length !== 0 &&
                <Row>
                  <Col sm={12}>
                    <div className="error"><p>The nanobots have detected an error or omission in one or more required fields. Please review this form.</p></div>
                  </Col>
                </Row>}
              <Row>
                <Col sm={2}>
                  {(formType === "register_edit" || formType === "admin_edit_att")
                    ? <Button data-toggle="popover" title="Update" className="button" onClick={handleFormUpdate} type="submit">Update Form</Button>
                    : <Button data-toggle="popover" title="Update" className="button" onClick={handleFormSubmit} type="submit">Submit Form</Button>}
                </Col>
              </Row>

            </Form>

            <SuccessModal conference={conference} confname={conference.confName} confid={conference._id} urltype={formType} attname={attendee.givenName + " " + attendee.familyName} show={showSuccess} hide={e => handleHideSuccess(e)} />

            <ErrorModal conference={conference} confname={conference.confName} confid={conference._id} urltype={formType} errmsg={errThrown} attname={attendee.givenName + " " + attendee.familyName} show={showErr} hide={e => handleHideErr(e)} />

          </Container>
        )
      }
    </>
  )

}

export default Registration;