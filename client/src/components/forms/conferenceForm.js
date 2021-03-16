import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Card, Form, Row, Col, Button, Image } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import Moment from "react-moment";
import "moment-timezone";
import { ConferenceAPI } from "../../utils/api";
import { ErrorModal, SuccessModal } from "../modals";
import "./style.css";

const ConferenceForm = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  let err;
  const [pageReady, setPageReady] = useState(false);
  const [conference, setConference] = useState({
    creatorEmail: "",
    confName: "",
    confOrg: "",
    confDesc: "",
    startDate: "",
    endDate: "",
    numDays: 1,
    confStartTime: "",
    confEndTime: "",
    confType: "",
    confLoc: "",
    confRegDeadline: "",
    confEarlyRegDeadline: "",
    confCapConfirm: "no",
    confFee: "no",
    confEarlyRegConfirm: "no",
    confAllergies: "no",
    confWaiver: "no",
  });

  const confOffset = new Date().getTimezoneOffset()

  // Breaks down the URL
  const urlArray = window.location.href.split("/")
  // Use to refer to "/new_conference"
  const confId = urlArray[urlArray.length - 1]
  // Use to refer to "/edit_conference/{confId}"
  const urlType = urlArray[urlArray.length - 2]

  // Modal variables
  const [showSuccess, setShowSuccess] = useState(false);
  const [showErr, setShowErr] = useState(false);

  // Sets boolean to show or hide relevant modal
  const handleShowSuccess = () => setShowSuccess(true);
  const handleHideSuccess = () => setShowSuccess(false);
  const handleShowErr = () => setShowErr(true);
  const handleHideErr = () => setShowErr(false);

  // Finds the length of the conference in days & adds that to conference info in state
  const findNumDays = (e) => {
    const confStart = new Date(conference.startDate)
    const confEnd = new Date(e.target.value)
    const confNumDays = (confEnd - confStart) / (1000 * 3600 * 24) + 1
    setConference({ ...conference, [e.target.name]: e.target.value, numDays: confNumDays })
  };

  // Handles input changes to form fields
  const handleInputChange = (e) => {
    setConference({ ...conference, [e.target.name]: e.target.value })
  };

  // Handles click on "Update" button
  const handleFormUpdate = (e) => {
    e.preventDefault();
    console.log("Conference update", confId);
    // PUT call to update conference document
    ConferenceAPI.updateConference({ ...conference }, confId)
      .then(res => {
        // If no errors thrown, show Success modal
        if (!res.err) {
          handleShowSuccess();
          console.log({ showSuccess });
        }
      })
      // If yes errors thrown, show Error modal
      .catch(err => {
        handleShowErr()
        console.log(err)
        return err
      });
  }

  // Handles click on "Submit" button
  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Conference submit", conference)
    // POST call to create conference document
    ConferenceAPI.createConference({ ...conference, creatorEmail: user.email })
      .then(res => {
        // If no errors thrown, show Success modal
        if (!res.err) {
          handleShowSuccess();
          console.log({ showSuccess });
        }
      })
      // If yes errors thrown, show Error modal
      .catch(err => {
        handleShowErr();
        console.log(err);
        return err;
      });
  }

  useEffect(() => {
    if (isAuthenticated) {
      switch (urlType) {
        case "edit_conference":
          // GET call to pre-populate the form if the URL indicates this is an existing conference
          ConferenceAPI.getConferenceById(confId)
            .then(resp => {
              console.log("from conferenceForm getConfById", resp.data);
              const confArr = resp.data;
              setConference(confArr[0])
            })
            .catch(err => console.log(err))
          break;
        default:
          // Sets the user's email in state as conference.creatorEmail
          setConference({ ...conference, creatorEmail: user.email })
      }
    }
    setPageReady(true);
  }, []);


  return (
    <>
      {!isAuthenticated &&
        <Row>
          <h1 className="authRemind">Please <Link className="login" onClick={() => loginWithRedirect()}>
            log in
          </Link> to create or update a conference.</h1>
          <div className="authLogo"><Image fluid="true" className="loadLogo" src="/images/bristlecone-dark.png" alt="BCMS logo" /></div>
        </Row>}

      { pageReady === true &&
        isAuthenticated && (
          <Container>

            <Form className="confForm">

              <Card className="formCard">
                <Card.Title><h1>Basic Information</h1></Card.Title>
                <Card.Body className="cardBody">
                  <Row>
                    <Col sm={12}>
                      <Form.Group controlId="formConfName">
                        <Form.Label>Name of conference: <span className="red">*</span></Form.Label>
                        <Form.Control required type="input" name="confName" placeholder="Enter conference name" value={conference.confName} className="formInput" onChange={handleInputChange} />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col sm={12}>
                      <Form.Group controlId="formConfOrg">
                        <Form.Label>Conference organization: <span className="red">*</span></Form.Label>
                        <Form.Control required type="input" name="confOrg" placeholder="Enter name of organizing body" value={conference.confOrg} className="formInput" onChange={handleInputChange} />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col sm={12}>
                      <Form.Group controlId="formConfDesc">
                        <Form.Label>Conference description: <span className="red">*</span></Form.Label>
                        <Form.Control required as="textarea" rows={10} type="input" name="confDesc" placeholder="Enter conference description" value={conference.confDesc} className="formText" onChange={handleInputChange} />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <Card className="formCard">
                <Card.Title><h1>When & Where</h1></Card.Title>
                <Card.Body className="cardBody">
                  <Row className="rowSpace">
                    <Form.Group controlId="formConfDates">
                      <Col sm={4}>
                        <Form.Label>Conference start date: <span className="red">*</span></Form.Label>
                        <Form.Control required type="date" name="startDate" placeholder="2021/01/01" value={conference.startDate} className="formDate" onChange={handleInputChange} />
                      </Col>
                      <Col sm={4}>
                        <Form.Label>Conference end date: <span className="red">*</span></Form.Label>
                        <Form.Control required type="date" min={conference.startDate} name="endDate" placeholder="2021/01/01" value={conference.endDate} className="formDate" onChange={findNumDays} />
                      </Col>
                      {conference.startDate !== "" &&
                        conference.endDate !== "" &&
                        <Col sm={4}>
                          <p>Your conference is {conference.numDays} days long.</p>
                        </Col>}
                    </Form.Group>
                  </Row>

                  <Row className="rowSpace">
                    <Form.Group controlId="formConfTimes">
                      <Col sm={4}>
                        <Form.Label>Conference start time: <span className="red">*</span></Form.Label>
                        <Form.Control required type="time" name="confStartTime" placeholder="09:00" value={conference.confStartTime} className="formTime" onChange={handleInputChange} />
                      </Col>
                      <Col sm={4}>
                        <Form.Label>Conference end time: <span className="red">*</span></Form.Label>
                        <Form.Control required type="time" name="confEndTime" placeholder="17:00" value={conference.confEndTime} className="formTime" onChange={handleInputChange} />
                      </Col>
                    </Form.Group>
                  </Row>

                  <Row>
                    <Col sm={12}>
                      <Form.Group controlId="formConfType">
                        <Form.Label>Live or Virtual? <span className="red">*</span></Form.Label>
                        <Form.Check type="radio" id="confLive" name="confType" label="Live" value="Live" checked={conference.confType === "Live"} onChange={handleInputChange} />
                        <Form.Check type="radio" id="confVirtual" name="confType" label="Virtual" value="Virtual" checked={conference.confType === "Virtual"} onChange={handleInputChange} />
                      </Form.Group>
                    </Col>
                  </Row>

                  {(conference.confType === "Live") &&
                    <div>
                      <Row>
                        <Col sm={12}>
                          <Form.Group controlId="formConfLocLive">
                            <Form.Label>Venue: <span className="red">*</span></Form.Label>
                            <Form.Control required type="input" name="confLocName" placeholder="Enter venue name" value={conference.confLocName} className="formInput" onChange={handleInputChange} />
                            <Form.Control required type="input" name="confLoc" placeholder="Enter venue address" value={conference.confLoc} className="formInput" onChange={handleInputChange} />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col sm={12}>
                          <Form.Group controlId="formConfLocUrl">
                            <Form.Label>Venue website:</Form.Label>
                            <Form.Control type="input" name="confLocUrl" placeholder="Enter URL of venue's website" value={conference.confLocUrl} className="formInput" onChange={handleInputChange} />
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>
                  }

                  {(conference.confType === "Virtual") &&
                    <div>
                      <Row>
                        <Col sm={12}>
                          <Form.Group controlId="formConfLocVir">
                            <Form.Label>Message or link text: <span className="red">*</span></Form.Label>
                            <Form.Control required type="input" name="confLoc" placeholder="Enter link text or advisory that URL will be emailed to attendees at a future date" value={conference.confLoc} className="formInput" onChange={handleInputChange} />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col sm={12}>
                          <Form.Group controlId="formConfUrl">
                            <Form.Label>Conference URL:</Form.Label><br />
                            <Form.Control required type="input" name="confLocUrl" placeholder="Enter URL or leave blank if URL will be emailed to attendees at a future date" value={conference.confLocUrl} className="formInput" onChange={handleInputChange} />
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>
                  }
                </Card.Body>
              </Card>

              <Card className="formCard">
                <Card.Title><h1>Registration Information</h1></Card.Title>
                <Card.Body className="cardBody">
                  <Row>
                    <Col sm={6}>
                      <Form.Group controlId="formRegDeadline">
                        <Form.Label>Registration deadline: <span className="red">*</span></Form.Label><br />
                        <Form.Text className="subtitle" muted>If attendees may register through the entire conference, please enter the conference's end date.</Form.Text>
                        <Form.Control required type="date" max={conference.endDate} name="confRegDeadline" placeholder="2021/01/01" value={conference.confRegDeadline} className="formDate" onChange={handleInputChange} />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col sm={6}>
                      <Form.Group controlId="formConfFeeConfirm">
                        <Form.Label>Will a registration fee be charged? <span className="red">*</span></Form.Label>
                        <Form.Check type="radio" id="confFeeYes" name="confFee" label="Yes" value="yes" checked={conference.confFee === "yes"} onChange={handleInputChange} />
                        <Form.Check type="radio" id="confFeeNo" name="confFee" label="No" value="no" checked={conference.confFee === "no"} onChange={handleInputChange} />
                      </Form.Group>
                    </Col>

                    {(conference.confFee === "yes") &&
                      <Col sm={6}>
                        <Form.Group controlId="formConfFeeAmt">
                          <Form.Label>Registration fee amount:</Form.Label><br />
                          <Form.Text className="subtitle" muted>Please enter only numbers with no decimals or commas.</Form.Text>
                          <Form.Control type="number" min="0" name="confFeeAmt" placeholder="300" value={conference.confFeeAmt} className="formNum" onChange={handleInputChange}></Form.Control>
                        </Form.Group>
                      </Col>}
                  </Row>

                  <Row>
                    <Col sm={4}>
                      <Form.Group controlId="formEarlyRegConfirm">
                        <Form.Label>Will there be incentives for early registration? <span className="red">*</span></Form.Label>
                        <Form.Check type="radio" id="earlyRegYes" name="confEarlyRegConfirm" label="Yes" value="yes" checked={conference.confEarlyRegConfirm === "yes"} onChange={handleInputChange} />
                        <Form.Check type="radio" id="earlyRegNo" name="confEarlyRegConfirm" label="No" value="no" checked={conference.confEarlyRegConfirm === "no"} onChange={handleInputChange} />
                      </Form.Group>
                    </Col>

                    {(conference.confEarlyRegConfirm === "yes") &&
                      <div>
                        <Col sm={4}>
                          <Form.Group controlId="formEarlyRegDeadline">
                            <Form.Label>Early registration deadline:</Form.Label>
                            <Form.Control required type="date" max={conference.endDate} name="confEarlyRegDeadline" placeholder="2021/01/01" value={conference.confEarlyRegDeadline} className="formDate" onChange={handleInputChange} />
                          </Form.Group>
                        </Col>

                        <Col sm={4}>
                          <Form.Group controlId="formEarlyRegFee">
                            <Form.Label>Early registration fee amount:</Form.Label><br />
                            <Form.Text className="subtitle" muted>Please enter only numbers with no decimals or commas.</Form.Text>
                            <Form.Control type="number" name="confEarlyRegFee" placeholder="150" value={conference.EarlyRegFee} className="formNum" onChange={handleInputChange} />
                          </Form.Group>
                        </Col>
                      </div>}
                  </Row>

                  {(conference.confEarlyRegConfirm === "yes") &&
                    <Row>
                      <Col sm={4}>
                        <Form.Group controlId="formEarlyRegSwagConfirm">
                          <Form.Label>Will there be additional incentives for early registration?</Form.Label>
                          <Form.Check type="radio" id="earlyRegSwagYes" name="confEarlyRegSwagConfirm" label="Yes" value="yes" checked={conference.confEarlyRegSwagConfirm === "yes"} onChange={handleInputChange} />
                          <Form.Check type="radio" id="earlyRegSwagNo" name="confEarlyRegSwagConfirm" label="No" value="no" checked={conference.confEarlyRegSwagConfirm === "no"} onChange={handleInputChange} />
                        </Form.Group>
                      </Col>

                      {(conference.confEarlyRegSwagConfirm === "yes") &&
                        <div>
                          <Col sm={4}>
                            <Form.Group controlId="formEarlyRegSwagType">
                              <Form.Label>What additional incentive(s) will you offer for early registration?</Form.Label>
                              <Form.Control type="input" name="confEarlyRegSwagType" placeholder="T-shirts" className="formInput" onChange={handleInputChange} />
                            </Form.Group>
                          </Col>

                          <Col sm={4}>
                            <Form.Group controlId="formEarlyRegSizeConfirm">
                              <Form.Label>Do you need to know early registrants' shirt size?</Form.Label>
                              <Form.Check type="radio" id="earlyRegSizeYes" name="confEarlyRegSizeConfirm" label="Yes" value="yes" checked={conference.confEarlyRegSizeConfirm === "yes"} onChange={handleInputChange} />
                              <Form.Check type="radio" id="earlyRegSizeNo" name="confEarlyRegSizeConfirm" label="No" value="no" checked={conference.confEarlyRegSizeConfirm === "no"} onChange={handleInputChange} />
                            </Form.Group>
                          </Col>
                        </div>}
                    </Row>}
                </Card.Body>
              </Card>

              <Card className="formCard">
                <Card.Title><h1>Miscellaneous Other Information</h1></Card.Title>
                <Card.Body className="cardBody">
                  <Row>
                    <Col sm={6}>
                      <Form.Group controlId="formConfKeynote">
                        <Form.Label>Will this conference have a keynote speaker? <span className="red">*</span></Form.Label>
                        <Form.Check type="radio" id="confKeynoteYes" name="confKeynote" label="Yes" value="yes" checked={conference.confKeynote === "yes"} onChange={handleInputChange} />
                        <Form.Check type="radio" id="confKeynoteNo" name="confKeynote" label="No" value="no" checked={conference.confKeynote === "no"} onChange={handleInputChange} />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={6}>
                      <Form.Group controlId="formConfCapConfirm">
                        <Form.Label>Will there be a cap on the number of attendees? <span className="red">*</span></Form.Label>
                        <Form.Check type="radio" id="confCapYes" name="confCapConfirm" label="Yes" value="yes" checked={conference.confCapConfirm === "yes"} onChange={handleInputChange} />
                        <Form.Check type="radio" id="confCapNo" name="confCapConfirm" label="No" value="no" checked={conference.confCapConfirm === "no"} onChange={handleInputChange} />
                      </Form.Group>
                    </Col>

                    {(conference.confCapConfirm === "yes") &&
                      <Col sm={6}>
                        <Form.Group controlId="formConfAttendCap">
                          <Form.Label>Maximum number of attendees:</Form.Label><br />
                          <Form.Text className="subtitle" muted>Please enter only numbers with no decimals or commas.</Form.Text>
                          <Form.Control type="number" min="0" name="confAttendCap" placeholder="50" className="formNum" value={conference.confAttendCap} onChange={handleInputChange} />
                        </Form.Group>
                      </Col>}
                  </Row>

                  <Row>
                    <Form.Group controlId="formSessProposal">
                      <Col sm={4}>
                        <Form.Label>Will this conference require prospective presenters to submit proposals for their sessions? <span className="red">*</span></Form.Label>
                        <Form.Check type="radio" id="confSessPropConfYes" name="confSessProposalConfirm" label="Yes" value="yes" checked={conference.confSessProposalConfirm === "yes"} onChange={handleInputChange} />
                        <Form.Check type="radio" id="confSessPropConfNo" name="confSessProposalConfirm" label="No" value="no" checked={conference.confSessProposalConfirm === "no"} onChange={handleInputChange} />
                      </Col>
                      <Col sm={8}>
                        {conference.confSessProposalConfirm === "yes" &&
                          <Form.Text>Prospective presenters will input session information to be reviewed by a review team designated by you. Sessions that are marked as accepted will have their information auto-filled in your conference's "details" section. You or a designated admin will still need to enter sessions into your conference's schedule.</Form.Text>}
                        {conference.confSessProposalConfirm === "no" &&
                          <Form.Text>You or a designated admin will need to input session information into your conference's "details" section and schedule.</Form.Text>}
                      </Col>
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group controlId="formConfAllergies">
                      <Col sm={4}>
                        <Form.Label>Do you need to ask attendees about allergies? <span className="red">*</span></Form.Label>
                        <Form.Check type="radio" id="confAllergiesYes" name="confAllergies" label="Yes" value="yes" checked={conference.confAllergies === "yes"} onChange={handleInputChange} />
                        <Form.Check type="radio" id="confAllergiesNo" name="confAllergies" label="No" value="no" checked={conference.confAllergies === "no"} onChange={handleInputChange} />
                      </Col>
                      <Col sm={8}>
                        {(conference.confAllergies === "yes") &&
                          <Form.Text> Attendees will be asked about allergies on the registration form.</Form.Text>}
                      </Col>
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group controlId="formConfWaiver">
                      <Col sm={4}>
                        <Form.Label>Will a liability waiver be required? <span className="red">*</span></Form.Label>
                        <Form.Check type="radio" id="confWaiverYes" name="confWaiver" label="Yes" value="yes" checked={conference.confWaiver === "yes"} onChange={handleInputChange} />
                        <Form.Check type="radio" id="confWaiverNo" name="confWaiver" label="No" value="no" checked={conference.confWaiver === "no"} onChange={handleInputChange} />
                      </Col>
                      <Col sm={8}>
                        {(conference.confWaiver === "yes") &&
                          <Form.Text>Attendees will be alerted on the registration form that they will be expected to sign a liability waiver upon checking in to the event.</Form.Text>}
                      </Col>
                    </Form.Group>
                  </Row>
                </Card.Body>
              </Card>

              <Row>
                {(confId !== "new_conference")
                  ? <Button data-toggle="popover" title="Update" className="button" onClick={handleFormUpdate} type="submit">Update Form</Button>
                  : <Button data-toggle="popover" title="Submit" className="button" onClick={handleFormSubmit} type="submit">Submit Form</Button>}
              </Row>

            </Form>

            <SuccessModal conference={conference} urlid={confId} urltype={urlType} show={showSuccess} hide={e => handleHideSuccess(e)} />

            <ErrorModal conference={conference} urlid={confId} urltype={urlType} errMsg={err} show={showErr} hide={e => handleHideErr(e)} />

          </Container >
        )
      }
    </>
  )
}

export default ConferenceForm;