import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import Moment from "react-moment";
import "moment-timezone";
import { ConferenceAPI } from "../../utils/api";
import "./style.css";

const ConferenceForm = () => {
  const { user, isAuthenticated } = useAuth0();
  const history = useHistory();
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
    confCapConfirm: "no",
    confFee: "no",
    confAllergies: "no",
    confWaiver: "no",
  });

  const urlArray = window.location.href.split("/")
  const confId = urlArray[urlArray.length - 1]

  const startSplit = conference.startDate.split("T")
  const startD = startSplit[0]
  const endSplit = conference.endDate.split("T")
  const endD = endSplit[0]

  const confOffset = new Date().getTimezoneOffset()

  useEffect(() => {
    if (confId !== "new_conference") {
      ConferenceAPI.getConferenceById(confId)
        .then(resp => {
          console.log("from conferenceForm getConfById", resp.data);
          const confArr = resp.data;
          setConference(confArr[0])
        })
        .catch(err => console.log(err))
    } else {
      setConference({ ...conference, creatorEmail: user.email })
    }
    setPageReady(true);
  }, []);

  const handleInputChange = (e) => {
    setConference({ ...conference, [e.target.name]: e.target.value })
  };

  const findNumDays = (e) => {
    const confStart = new Date(conference.startDate)
    const confEnd = new Date(e.target.value)
    const confNumDays = (confEnd - confStart) / (1000 * 3600 * 24) + 1
    setConference({ ...conference, [e.target.name]: e.target.value, numDays: confNumDays })
  };

  const handleFormUpdate = (e) => {
    e.preventDefault();
    console.log("Conference update", confId);
    ConferenceAPI.updateConference({ ...conference }, confId)
      .then(history.push("/conference_updated"))
      .catch(err => console.log(err))
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Conference submit", conference)
    ConferenceAPI.createConference({ ...conference, creatorEmail: user.email })
      .then(history.push("/conference_created"))
      .catch(err => console.log(err));
  }

  return (
    <>
      { pageReady === true &&
        isAuthenticated && (
          <Container>
            <Form className="confForm">

              <Row>
                <Form.Group controlId="formConfName">
                  <Form.Label>Name of conference: <span className="red">*</span></Form.Label>
                  <Form.Control required type="input" name="confName" placeholder="Enter conference name" value={conference.confName} className="confName" onChange={handleInputChange} />
                </Form.Group>
              </Row>

              <Row>
                <Form.Group controlId="formConfOrg">
                  <Form.Label>Conference Organization: <span className="red">*</span></Form.Label>
                  <Form.Control required type="input" name="confOrg" placeholder="Enter name of organizing body" value={conference.confOrg} className="confOrg" onChange={handleInputChange} />
                </Form.Group>
              </Row>

              <Row>
                <Form.Group controlId="formConfDesc">
                  <Form.Label>Conference Description: <span className="red">*</span></Form.Label>
                  <Form.Control required as="textarea" rows={10} type="input" name="confDesc" placeholder="Enter conference description" value={conference.confDesc} className="confDesc" onChange={handleInputChange} />
                </Form.Group>
              </Row>

              <Row>
                <Form.Group controlId="formConfDate">
                  <Col sm={4}>
                    <Form.Label>Conference Start Date: <span className="red">*</span></Form.Label>
                    <Form.Control required type="date" name="startDate" placeholder="2021/01/01" value={startD} className="startDate" onChange={handleInputChange} />
                  </Col>
                  <Col sm={4}>
                    <Form.Label>Conference End Date: <span className="red">*</span></Form.Label>
                    <Form.Control required type="date" name="endDate" placeholder="2021/01/01" value={endD} className="endDate" onChange={findNumDays} />
                  </Col>
                  {conference.startDate !== "" &&
                    conference.endDate !== "" &&
                    <Col sm={4}>
                      <p>Your conference is {conference.numDays} days long.</p>
                    </Col>}
                </Form.Group>
              </Row>

              <Row>
                <Form.Group controlId="formConfTimes">
                  <Col>
                    <Form.Label>Conference Start Time: <span className="red">*</span></Form.Label>
                    <Form.Control required type="time" name="confStartTime" placeholder="09:00" value={conference.confStartTime} className="confStartTime" onChange={handleInputChange} />
                  </Col>
                  <Col>
                    <Form.Label>Conference End Time: <span className="red">*</span></Form.Label>
                    <Form.Control required type="time" name="confEndTime" placeholder="17:00" value={conference.confEndTime} className="confEndTime" onChange={handleInputChange} />
                  </Col>
                </Form.Group>
              </Row>

              <Row>
                <Form.Group controlId="formConfType">
                  <Form.Label>Live or Virtual? <span className="red">*</span></Form.Label>
                  <Form.Check type="radio" id="confLive" name="confType" label="Live" value="Live" checked={conference.confType === "Live"} onChange={handleInputChange} />
                  <Form.Check type="radio" id="confVirtual" name="confType" label="Virtual" value="Virtual" checked={conference.confType === "Virtual"} onChange={handleInputChange} />
                </Form.Group>
              </Row>

              {(conference.confType === "Live") &&
                <div>
                  <Row>
                    <Form.Group controlId="formConfLocLive">
                      <Form.Label>Venue: <span className="red">*</span></Form.Label>
                      <Form.Control required type="input" name="confLocName" placeholder="Enter venue name" value={conference.confLocName} className="confLoc" onChange={handleInputChange} />
                      <Form.Control required type="input" name="confLoc" placeholder="Enter venue address" value={conference.confLoc} className="confLoc" onChange={handleInputChange} />
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group controlId="formConfLocUrl">
                      <Form.Label>Venue Website:</Form.Label>
                      <Form.Control type="input" name="confLocUrl" placeholder="Enter URL of venue's website" value={conference.confLocUrl} className="confLocUrl" onChange={handleInputChange} />
                    </Form.Group>
                  </Row>
                </div>
              }

              {(conference.confType === "Virtual") &&
                <div>
                  <Row>
                    <Form.Group controlId="formConfLocVir">
                      <Form.Label>Message or link text: <span className="red">*</span></Form.Label>
                      <Form.Control required type="input" name="confLoc" placeholder="Enter link text or advisory that URL will be emailed to attendees at a future date" value={conference.confLoc} className="confLoc" onChange={handleInputChange} />
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Label>Conference URL:</Form.Label><br />
                    <Form.Control required type="input" name="confLocUrl" placeholder="Enter URL or leave blank if URL will be emailed to attendees at a future date" value={conference.confLocUrl} className="confLocUrl" onChange={handleInputChange} />
                  </Row>
                </div>
              }

              <Row>
                <Col sm={6}>
                  <Form.Group controlId="formRegDeadline">
                    <Form.Label>Registration deadline:</Form.Label>
                    <Form.Text className="subtitle" muted>If attendees may register through the entire conference, please enter the conference's end date. <span className="red">*</span></Form.Text>
                    <Form.Control required type="date" name="confRegDeadline" placeholder="2021/01/01" value={conference.confRegDeadline} className="confRegDeadline" onChange={handleInputChange} />
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
                      <Form.Control type="input" name="confAttendCap" placeholder="50" onChange={handleInputChange}></Form.Control>
                    </Form.Group>
                  </Col>}
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
                      <Form.Control type="input" name="confFeeAmt" placeholder="300" onChange={handleInputChange}></Form.Control>
                    </Form.Group>
                  </Col>}
              </Row>

              <Row>
                <Col sm={4}>
                  <Form.Group controlId="formEarlybirdConfirm">
                    <Form.Label>Will there be Earlybird Registration? <span className="red">*</span></Form.Label>
                    <Form.Check type="radio" id="earlybirdYes" name="confEarlybirdConfirm" label="Yes" value="yes" checked={conference.confEarlybirdConfirm === "yes"} onChange={handleInputChange} />
                    <Form.Check type="radio" id="earlybirdNo" name="confEarlybirdConfirm" label="No" value="no" checked={conference.confEarlybirdConfirm === "no"} onChange={handleInputChange} />
                  </Form.Group>
                </Col>

                {(conference.confEarlybirdConfirm === "yes") &&
                  <div>
                    <Col sm={4}>
                      <Form.Group controlId="formEarlybirdDeadline">
                        <Form.Label>Earlybird registration deadline:</Form.Label>
                        <Form.Control required type="date" name="confEarlybirdDeadline" placeholder="2021/01/01" value={conference.confEarlybirdDeadline} className="confEarlybirdDeadline" onChange={handleInputChange} />
                      </Form.Group>
                    </Col>

                    <Col sm={4}>
                      <Form.Group controlId="formEarlybirdFee">
                        <Form.Label>Earlybird registration fee amount:</Form.Label>
                        <Form.Text className="subtitle" muted>Please enter only numbers with no decimals or commas.</Form.Text>
                        <Form.Control type="input" name="confEarlybirdFee" placeholder="150" onChange={handleInputChange} />
                      </Form.Group>
                    </Col>
                  </div>}
              </Row>

              {(conference.confEarlybirdConfirm === "yes") &&
                <Row>
                  <Col sm={4}>
                    <Form.Group controlId="formEarlybirdSwagConfirm">
                      <Form.Label>Will there be additional incentives for earlybird registration?</Form.Label>
                      <Form.Check type="radio" id="earlybirdSwagYes" name="confEarlybirdSwagConfirm" label="Yes" value="yes" checked={conference.confEarlybirdSwagConfirm === "yes"} onChange={handleInputChange} />
                      <Form.Check type="radio" id="earlybirdSwagNo" name="confEarlybirdSwagConfirm" label="No" value="no" checked={conference.confEarlybirdSwagConfirm === "no"} onChange={handleInputChange} />
                    </Form.Group>
                  </Col>

                  <Col sm={4}>
                    <Form.Group controlId="formEarlybirdSwagType">
                      <Form.Label>What additional incentive(s) will you offer for earlybird registration?</Form.Label>
                      <Form.Control type="input" name="confEarlybirdSwagType" placeholder="T-shirts" onChange={handleInputChange} />
                    </Form.Group>
                  </Col>

                  <Col sm={4}>
                    <Form.Group controlId="formEarlybirdSizeConfirm">
                      <Form.Label>Do you need to know earlybirds' shirt size?</Form.Label>
                      <Form.Check type="radio" id="earlybirdSizeYes" name="confEarlybirdSizeConfirm" label="Yes" value="yes" checked={conference.confEarlybirdSizeConfirm === "yes"} onChange={handleInputChange} />
                      <Form.Check type="radio" id="earlybirdSizeNo" name="confEarlybirdSizeConfirm" label="No" value="no" checked={conference.confEarlybirdSizeConfirm === "no"} onChange={handleInputChange} />
                    </Form.Group>
                  </Col>
                </Row>}

              <Row>
                <Col sm={6}>
                  <Form.Group controlId="formConfAllergies">
                    <Form.Label>Do you need to ask attendees about allergies? <span className="red">*</span></Form.Label>
                    <Form.Control required as="select" name="confAllergies" onChange={handleInputChange}>
                      <option value="no" checked={conference.confAllergies === "no"}>No</option>
                      <option value="yes" checked={conference.confAllergies === "yes"}>Yes</option>
                    </Form.Control>
                    {(conference.confAllergies === "yes") &&
                      <Form.Text> Attendees will be asked about allergies on the registration form.</Form.Text>}
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col sm={6}>
                  <Form.Group controlId="formConfWaiver">
                    <Form.Label>Will a liability waiver be required? <span className="red">*</span></Form.Label>
                    <Form.Control required as="select" name="confWaiver" onChange={handleInputChange}>
                      <option value="no" checked={conference.confWaiver === "no"}>No</option>
                      <option value="yes" checked={conference.confWaiver === "yes"}>Yes</option>
                    </Form.Control>
                    {(conference.confWaiver === "yes") &&
                      <Form.Text>Attendees will be alerted on the registration form that they will be expected to sign a liability waiver upon checking in to the event.</Form.Text>}
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                {(confId !== "new_conference")
                  ? <Button data-toggle="popover" title="Update" className="button" onClick={handleFormUpdate} type="submit">Update Form</Button>
                  : <Button data-toggle="popover" title="Submit" className="button" onClick={handleFormSubmit} type="submit">Submit Form</Button>}
              </Row>

            </Form>
          </Container >
        )
      }
    </>
  )
}

export default ConferenceForm;