import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import API from "../../utils/api";

const ConferenceForm = () => {
  const { user, isAuthenticated } = useAuth0();
  const history = useHistory();
  const [pageReady, setPageReady] = useState(false);
  const [conference, setConference] = useState({
    creatorEmail: "",
    confName: "Enter conference name",
    confOrg: "Enter name of organizing body",
    confDesc: "Enter conference description",
    startDate: "2021/01/01",
    endDate: "2021/01/01",
    confStartTime: "09:00",
    confEndTime: "17:00",
    confType: "live",
    confLoc: "Enter address or URL",
    confCapConfirm: false,
    confAttendCount: 0,
    confWaiver: false,
    confAttendees: [],
  });

  const urlArray = window.location.href.split("/")
  const confId = urlArray[urlArray.length - 1]

  // let [formObject, setFormObject] = useState({
  //   creatorEmail: "",
  //   confName: "Enter conference name",
  //   confOrg: "Enter name of organizing body",
  //   confDesc: "Enter conference description",
  //   startDate: "2021/01/01",
  //   endDate: "2021/01/01",
  //   confType: "live",
  //   confLoc: "Enter address or URL",
  //   confCapConfirm: false,
  //   confAttendCount: 0,
  //   confAttendees: [],
  // })

  useEffect(() => {
    if (confId !== "new_conference") {
      API.getConferenceById(confId).then(resp => {
        console.log("confById", resp.data);
        const confArr = resp.data;
        setConference(confArr[0]);
        setPageReady(true);
      })
    } else {
      setConference({ ...conference, creatorEmail: user.email, confAttendees: [user.email] })
    }
  }, []);

  const handleInputChange = (e) => {
    setConference({ ...conference, [e.target.name]: e.target.value, confAttendees: [] })
  };

  const handleFormUpdate = (e) => {
    e.preventDefault();
    console.log("Conference update", confId);
    API.updateConference({ ...conference }, confId)
      .then(history.push("/conference_updated"))
      .catch(err => console.log(err))
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Conference submit")
    API.createConference({ ...conference, creatorEmail: user.email })
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
                  <Form.Label>Name of conference *</Form.Label>
                  <Form.Control required type="input" name="confName" placeholder="Enter conference name" value={conference.confName} className="confName" onChange={handleInputChange} />
                </Form.Group>
              </Row>

              <Row>
                <Form.Group controlId="formConfOrg">
                  <Form.Label>Conference Organization *</Form.Label>
                  <Form.Control required type="input" name="confOrg" placeholder="Enter name of organizing body" value={conference.confOrg} className="confOrg" onChange={handleInputChange} />
                </Form.Group>
              </Row>

              <Row>
                <Form.Group controlId="formConfDesc">
                  <Form.Label>Conference Description *</Form.Label>
                  <Form.Control required as="textarea" rows={10} type="input" name="confDesc" placeholder="Enter conference description" value={conference.confDesc} className="confDesc" onChange={handleInputChange} />
                </Form.Group>
              </Row>

              <Row>
                <Form.Group controlId="formConfDate">
                  <Col>
                    <Form.Label>Conference Start Date *</Form.Label>
                    <Form.Control required type="date" name="startDate" placeholder="2021/01/01" value={conference.startDate} className="startDate" onChange={handleInputChange} />
                  </Col>
                  <Col>
                    <Form.Label>Conference End Date *</Form.Label>
                    <Form.Control required type="date" name="endDate" placeholder="2021/01/01" value={conference.endDate} className="endDate" onChange={handleInputChange} />
                  </Col>
                </Form.Group>
              </Row>

              <Row>
                <Form.Group controlId="formConfTimes">
                  <Col>
                    <Form.Label>Conference Start Time *</Form.Label>
                    <Form.Control required type="time" name="confStartTime" placeholder="09:00" value={conference.confStartTime} className="confStartTime" onChange={handleInputChange} />
                  </Col>
                  <Col>
                    <Form.Label>Conference End Time *</Form.Label>
                    <Form.Control required type="time" name="confEndTime" placeholder="17:00" value={conference.confEndTime} className="confEndTime" onChange={handleInputChange} />
                  </Col>
                </Form.Group>
              </Row>

              <Row>
                <Form.Group controlId="formConfType">
                  <Form.Label>Live or Virtual? *</Form.Label>
                  <Form.Check type="radio" id="confLive" name="confType" label="Live" value="live" checked={conference.confType === "live"} onChange={handleInputChange} />
                  <Form.Check type="radio" id="confVirtual" name="confType" label="virtual" value="virtual" checked={conference.confType === "virtual"} onChange={handleInputChange} />
                </Form.Group>
              </Row>

              <Row>
                <Form.Group controlId="formConfLoc">
                  <Form.Label>Conference Location *</Form.Label>
                  {(conference.confType === "live")
                    ? <Form.Control required type="input" name="confLoc" placeholder="Enter street address" value={conference.confLoc} className="confLoc" onChange={handleInputChange} />
                    : <Form.Control required type="input" name="confLoc" placeholder="Enter URL" value={conference.confLoc} className="confLoc" onChange={handleInputChange} />}
                </Form.Group>
              </Row>

              <Row>
                <Col>
                  <Form.Group controlId="formConfCapConfirm">
                    <Form.Label>Will there be a cap on the number of attendees? *</Form.Label>
                    <Form.Control required as="select" name="confCapConfirm" onChange={handleInputChange}>
                      <option value={false} checked={conference.confCapConfirm === false}>No</option>
                      <option value={true} checked={conference.confCapConfirm === true}>Yes</option>
                    </Form.Control>
                  </Form.Group>
                </Col>

                {(conference.confCapConfirm === true)
                  ? <Col>
                    <Form.Group controlId="formConfAttendCap">
                      <Form.Label>What is the maximum number of attendees?</Form.Label>
                      <Form.Text className="capSubtitle" muted>Please enter only numbers with no commas.</Form.Text>
                      <Form.Control type="input" name="confAttendCap" placeholder="50" onChange={handleInputChange}></Form.Control>
                    </Form.Group>
                  </Col>
                  : <Col></Col>}
              </Row>

              <Row>
                <Form.Group controlId="formConfWaiver">
                  <Form.Label>Will a liability waiver be required? *</Form.Label>
                  <Form.Control required as="select" name="confWaiver" onChange={handleInputChange}>
                    <option value={false} checked={conference.confWaiver === false}>No</option>
                    <option value={true} checked={conference.confWaiver === true}>Yes</option>
                  </Form.Control>
                </Form.Group>
              </Row>

              <Row>
                {(confId !== "new_conference")
                  ? <Button onClick={handleFormUpdate} type="submit">Update Form</Button>
                  : <Button onClick={handleFormSubmit} type="submit">Submit Form</Button>}
              </Row>

            </Form>
          </Container>
        )
      }
    </>
  )
}

export default ConferenceForm;