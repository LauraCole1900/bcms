import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Container, Form, Row, Col, Button, Card, Image } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { ErrorModal, SuccessModal } from "../modals"
import { CommitteeAPI } from "../../utils/api";
import "./style.css";

const CommitteeForm = (props) => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const [member, setMember] = useState(props.member);
  const [errThrown, setErrThrown] = useState();
  const [btnName, setBtnName] = useState();

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
    // Splits inputs at commas to create an array
    let array = value.split(",")
    setMember({ ...member, [name]: array })
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setBtnName(e.target.dataset.btnname);
    console.log("Committee submit", member)
    // POST call to create schedule document
    CommitteeAPI.createCommMember({ ...member, confId: props.conference._id })
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
    setBtnName(e.target.dataset.btnname);
    console.log("Committee member update", confId);
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
        <Form className="commForm">

          <Row>
            <Col sm={10}>
              <Card className="formCard">
                <Card.Body className="cardBody">
                  <Form.Group controlId="formCommName">
                    <Row>
                      <Col sm={6}>
                        <Form.Label>Member's first name: <span className="red">*</span></Form.Label><br />
                        <Form.Control type="input" name="commFirstName" placeholder="Donna" value={member.commFirstName} className="formInput" onChange={handleInputChange} />
                      </Col>
                      <Col sm={6}>
                        <Form.Label>Member's last name: <span className="red">*</span></Form.Label><br />
                        <Form.Control type="input" name="commLastName" placeholder="Noble" value={member.commLastName} className="formInput" onChange={handleInputChange} />
                      </Col>
                    </Row>
                  </Form.Group>

                  <Form.Group controlId="formCommContact">
                    <Row>
                      <Col sm={6}>
                        <Form.Label>Member's email address: <span className="red">*</span></Form.Label>
                        <Form.Control type="email" name="commEmail" placeholder="name@email.com" value={member.commEmail} className="formInput" onChange={handleInputChange} />
                      </Col>
                      <Col sm={6}>
                        <Form.Label>Member's phone:</Form.Label>
                        <Form.Control type="input" name="commPhone" placeholder="(123) 456-7890" value={member.commPhone} className="formInput" onChange={handleInputChange} />
                      </Col>
                    </Row>
                  </Form.Group>

                  <Row>
                    <Col sm={12}>
                      <Form.Group controlId="formCommOrg">
                        <Form.Label>Member's organization: <span className="red">*</span></Form.Label><br />
                        <Form.Control type="input" name="commOrg" placeholder="Enter the name of the member's organization" value={member.commOrg} className="formInput" onChange={handleInputChange} />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col sm={2}>
              {Object.keys(props.member).length !== 0
                ? <Button data-toggle="popover" title="Update" className="button" data-btnname="editComm" onClick={handleFormUpdate} type="submit">Update Member Information</Button>
                : <Button data-toggle="popover" title="Submit" className="button" data-btnname="addComm" onClick={handleFormSubmit} type="submit">Add Member</Button>}
            </Col>
          </Row>

        </Form>

        <SuccessModal conference={props.conference} confname={props.conference.confName} btnname={btnName} urlid={props.urlid} urltype={formType} show={showSuccess === "form"} hide={e => handleHideSuccess(e)} />

        <ErrorModal conference={props.conference} confname={props.conference.confName} urlid={confId} urltype={props.urltype} errmsg={errThrown} show={showErr === "form"} hide={e => handleHideErr(e)} />

      </Container>
    </>
  )

};

export default CommitteeForm;