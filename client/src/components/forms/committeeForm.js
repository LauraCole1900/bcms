import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Form, Row, Col, Button, Card, Image } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { ErrorModal, SuccessModal } from "../modals"
import { CommitteeAPI } from "../../utils/api";
import { commValidate } from "../../utils/validation";
import "./style.css";

const CommitteeForm = (props) => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const [member, setMember] = useState(props.member);
  const [errThrown, setErrThrown] = useState();
  const [errors, setErrors] = useState([]);

  // Grabs conference ID from URL
  const urlArray = window.location.href.split("/")
  const confId = urlArray[urlArray.length - 1]
  const formType = urlArray[urlArray.length - 2];

  // Modal variables
  const [showSuccess, setShowSuccess] = useState("none");
  const [showErr, setShowErr] = useState("none");

  // Sets boolean to show or hide relevant modal
  const handleShowSuccess = () => setShowSuccess("form");
  const handleHideSuccess = () => setShowSuccess("none");
  const handleShowErr = () => setShowErr("form");
  const handleHideErr = () => setShowErr("none");

  // Handles input changes to form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMember({ ...member, [name]: value })
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    props.setBtnName(e.target.dataset.btnname);
    console.log("Committee submit", member)
    const validationErrors = commValidate(member);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    switch (noErrors) {
      case true:
        // POST call to create schedule document
        CommitteeAPI.createCommMember({ ...member, confId: props.conference[0]._id })
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
        break;
      default:
        console.log({ errors });
    }
  }

  const handleFormUpdate = (e) => {
    e.preventDefault();
    props.setBtnName(e.target.dataset.btnname);
    console.log("Committee member update", confId);
    const validationErrors = commValidate(member);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    switch (noErrors) {
      case true:
        // PUT call to update schedule document
        CommitteeAPI.updateScheduleByConfId({ ...member }, confId)
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
        break;
      default:
        console.log({ errors })
    }
  }


  return (
    <>
      {!isAuthenticated &&
        <Row>
          <h1 className="regRemind">Please <Link to={window.location.origin} className="login" onClick={() => loginWithRedirect()}>log in</Link> to add or edit committee members.</h1>
          <div className="authLogo"><Image fluid="true" className="loadLogo" src="/images/bristlecone-dark.png" alt="BCMS logo" /></div>
        </Row>}

      <Container>
        <Form className="commForm">

          <Row>
            <Col sm={10}>
              <Card className="formCard">
                <Card.Body className="cardBody">

                  <Form.Group>
                    <Row>
                      <Col sm={6}>
                        <Form.Label>Member's first name: <span className="red">*</span></Form.Label><br />
                        {errors.commGivenName &&
                          <div className="error"><p>{errors.commGivenName}</p></div>}
                        <Form.Control type="input" id="formCommFName" name="commGivenName" placeholder="Donna" value={member?.commGivenName} className="formInput" onChange={handleInputChange} />
                      </Col>
                      <Col sm={6}>
                        <Form.Label>Member's last name: <span className="red">*</span></Form.Label><br />
                        {errors.commFamilyName &&
                          <div className="error"><p>{errors.commFamilyName}</p></div>}
                        <Form.Control type="input" id="formCommLName" name="commFamilyName" placeholder="Noble" value={member?.commFamilyName} className="formInput" onChange={handleInputChange} />
                      </Col>
                    </Row>
                  </Form.Group>

                  <Form.Group>
                    <Row>
                      <Col sm={6}>
                        <Form.Label>Member's email: <span className="red">*</span></Form.Label><br />
                        {errors.commEmail &&
                          <div className="error"><p>{errors.commEmail}</p></div>}
                        <Form.Control type="email" id="formCommEmail" name="commEmail" placeholder="name@email.com" value={member?.commEmail} className="formInput" onChange={handleInputChange} />
                      </Col>
                      <Col sm={6}>
                        <Form.Label>Member's phone:</Form.Label><br />
                        <Form.Control type="input" id="formCommPhone" name="commPhone" placeholder="(123) 456-7890" value={member?.commPhone} className="formInput" onChange={handleInputChange} />
                      </Col>
                    </Row>
                  </Form.Group>

                  <Row>
                    <Col sm={12}>
                      <Form.Group controlId="formCommOrg">
                        <Form.Label>Member's organization: <span className="red">*</span></Form.Label><br />
                        {errors.commOrg &&
                          <div className="error"><p>{errors.commOrg}</p></div>}
                        <Form.Control type="input" name="commOrg" placeholder="Enter the name of the member's organization" value={member?.commOrg} className="formInput" onChange={handleInputChange} />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {Object.keys(errors).length > 0 && errors.every(err => err.length > 0) &&
            <Row>
              <Col sm={12}>
                <div className="error"><p>The nanobots have detected an error or omission in one or more required fields. Please review this form.</p></div>
              </Col>
            </Row>}

          <Row>
            <Col sm={2}>
              {member === undefined
                ? <Button data-toggle="popover" title="Submit" className="button" data-btnname="addComm" onClick={handleFormSubmit} type="submit">Add Member</Button>
                : <Button data-toggle="popover" title="Update" className="button" data-btnname="editComm" onClick={handleFormUpdate} type="submit">Update Member Information</Button>}
            </Col>
          </Row>

        </Form>

        <SuccessModal conference={props.conference} confname={props.conference.confName} btnname={props.btnName} urlid={props.urlid} urltype={formType} show={showSuccess === "form"} hide={e => handleHideSuccess(e)} />

        <ErrorModal conference={props.conference} confname={props.conference.confName} btnname={props.btnName} urlid={confId} urltype={props.urltype} errmsg={errThrown} show={showErr === "form"} hide={e => handleHideErr(e)} />

      </Container>
    </>
  )

};

export default CommitteeForm;