import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Container, Form, Card, Row, Col, Button } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { ConferenceAPI, SessionAPI } from "../../utils/api";
import "./style.css";

const SessionForm = () => {
  const { user, isAuthenticated } = useAuth0();
  const history = useHistory();
  const [session, setSession] = useState();
  const [conference, setConference] = useState();
  const [sessReady, setSessReady] = useState(false);
  const [confReady, setConfReady] = useState(false);

  // Grabs conference ID from URL for new sessions or session ID from URL for existing sessions
  // Uses URL to determine whether this is a new session or an existing session
  // If sessType === add_session, then urlId === confId
  // If sessType === edit_session, then urlId === sessId
  const urlArray = window.location.href.split("/")
  const urlId = urlArray[urlArray.length - 1]
  const sessType = urlArray[urlArray.length - 2]

  const fetchSess = async (sessid) => {
    // Edit existing session: GET session information
    return SessionAPI.getSessionById(sessid)
      .then(resp => {
        console.log("from sessForm getSessById", resp.data)
        const sessObj = resp.data[0]
        setSession(sessObj)
        return sessObj
      })
      .catch(err => {
        console.log(err)
        return false;
      })
  }

  const fetchConf = async (confid) => {
    switch (sessType) {
      // Edit existing session
      case "edit_session":
        // Call fetchSess()
        let sessObj = await fetchSess(confid)
        console.log({ sessObj });
        // Use response from fetchSess() to GET conference information
        await ConferenceAPI.getConferenceById(sessObj.confId)
          .then(resp => {
            console.log("from sessForm getConfById", resp.data)
            const confObj = resp.data[0]
            setConference(confObj)
            setSessReady(true);
            setConfReady(true);
          })
          .catch(err => console.log(err))
        break;
      // New session
      default:
        // Use ID in URL to GET conference information
        await ConferenceAPI.getConferenceById(confid)
          .then(resp => {
            console.log("from sessForm getConfById", resp.data)
            const confObj = resp.data[0]
            setConference(confObj)
            setConfReady(true);
          })
          .catch(err => console.log(err))
    }
  }

  useEffect(() => {
    switch (sessType) {
      // GET call to pre-populate the form if the URL indicates this is an existing session
      case "edit_session":
        fetchConf(urlId);
        break;
      // Puts conference ID in state as session.confId
      default:
        setSession({ ...session, confId: urlId })
        setSessReady(true);
        fetchConf(urlId);

    }
  }, [])

  // Handles input changes to form fields
  const handleInputChange = (e) => {
    setSession({ ...session, [e.target.name]: e.target.value })
  };

  // Handles click on "Update" button
  const handleFormUpdate = (e) => {
    e.preventDefault();
    console.log("Session update", urlId);
    // PUT call to update session document
    SessionAPI.updateSession({ ...session }, urlId)
      .then(history.push("/session_updated"))
      .catch(err => console.log(err))
  }

  // Handles click on "Submit" button
  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Session submit", session)
    // POST call to create session document
    SessionAPI.saveSession({ ...session, confId: urlId })
      .then(history.push("/session_added"))
      .catch(err => console.log(err));
  }


  return (
    <>
      {isAuthenticated &&
        sessReady === true &&
        confReady === true &&
        (user.email === conference.creatorEmail || conference.confAdmins.includes(user.email)) &&
        <Container>
          <Form className="sessForm">

            <Card className="formCard">
              <Card.Title><h1>Basic Information</h1></Card.Title>

              <Card.Body className="cardBody">
                <Row>
                  <Col sm={12}>
                    <Form.Group controlId="formSessName">
                      <Form.Label>Name of session: <span className="red">*</span></Form.Label>
                      <Form.Control required type="input" name="sessName" placeholder="Enter session name" value={session.sessName} className="formInput" onChange={handleInputChange} />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col sm={12}>
                    <Form.Group controlId="formSessDesc">
                      <Form.Label>Session description: <span className="red">*</span></Form.Label>
                      <Form.Control required as="textarea" rows={10} type="input" name="sessDesc" placeholder="Enter session description" value={session.sessDesc} className="formText" onChange={handleInputChange} />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Form.Group controlId="formSessWhen">
                    <Col sm={4}>
                      <Form.Label>Session date: <span className="red">*</span></Form.Label>
                      <Form.Control required type="date" min={conference.startDate} max={conference.endDate} name="sessDate" value={session.sessDate} className="formDate" onChange={handleInputChange} />
                    </Col>
                    <Col sm={4}>
                      <Form.Label>Session start time: <span className="red">*</span></Form.Label>
                      <Form.Control required type="time" name="sessStart" placeholder="09:00" value={session.sessStart} className="formTime" onChange={handleInputChange} />
                    </Col>
                    <Col sm={4}>
                      <Form.Label>Session end time: <span className="red">*</span></Form.Label>
                      <Form.Control required type="time" name="sessEnd" placeholder="10:00" value={session.sessEnd} className="formTime" onChange={handleInputChange} />
                    </Col>
                  </Form.Group>
                </Row>

                {conference.confType === "Live" &&
                  <Row>
                    <Form.Group controlId="formSessWhere">
                      <Col sm={12}>
                        <Form.Label>Session room or location: <span className="red">*</span></Form.Label>
                        <Form.Control required type="input" name="sessRoom" placeholder="Enter a room or location, or TBA or TBD if the room or location hasn't been assigned" value={session.sessRoom} className="formInput" onChange={handleInputChange} />
                      </Col>
                    </Form.Group>
                  </Row>}

                <Row>
                  <Col sm={12}>
                    <Form.Group controlId="formSessKeynote">
                      <Form.Label>Is this a keynote session? <span className="red">*</span></Form.Label>
                      <Form.Check type="radio" id="sessKeyYes" name="sessKeynote" label="Yes" value="yes" checked={session.sessKeynote === "yes"} onChange={handleInputChange} />
                      <Form.Check type="radio" id="sessKeyNo" name="sessKeynote" label="No" value="no" checked={session.sessKeynote === "no"} onChange={handleInputChange} />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card className="formCard">
              <Card.Title><h1>Presenter Information</h1></Card.Title>

              <Card.Body className="cardBody">
                <Form.Group controlId="formSessNumPres">
                  <Row>
                    <Col sm={3}>
                      <Form.Label>Number of presenters: <span className="red">*</span></Form.Label>
                      <Form.Control required type="number" min="1" max="15" name="sessNumPres" placeholder="Enter a number, 1-15" value={session.sessNumPres} className="formNum" onChange={handleInputChange} />
                    </Col>
                  </Row>
                </Form.Group>

                <Form.Group controlId="sessPresName">
                  <Row>
                    <Col sm={6}>
                      <Form.Label>Presenter's name: <span className="red">*</span></Form.Label>
                      <Form.Control required type="input" name="sessPresenter" placeholder="Enter presenter's name" value={session.sessPresenter} className="formInput" onChange={handleInputChange} />
                    </Col>
                    <Col sm={6}>
                      <Form.Label>Presenter's email: <span className="red">*</span></Form.Label>
                      <Form.Control required type="email" name="sessPresenterEmail" placeholder="name@email.com" value={session.sessPresenterEmail} className="formEmail" onChange={handleInputChange} />
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={12}>
                      <Form.Label>Presenter's organization: <span className="red">*</span></Form.Label>
                      <Form.Control required type="input" name="sessPresenterOrg" placeholder="Enter organization the presenter represents" value={session.sessPresenterOrg} className="formInput" onChange={handleInputChange} />
                    </Col>
                  </Row>
                </Form.Group>

                <Row>
                  <Col sm={12}>
                    <Form.Group controlId="sessPresBio">
                      <Form.Label>Presenter's bio:</Form.Label>
                      <Form.Control as="textarea" rows={5} type="input" name="sessPresenterBio" placeholder="Enter a short bio of the presenter" value={session.sessPresenterBio} className="formInput" onChange={handleInputChange} />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col sm={12}>
                    <Form.Group controlId="formPresPic">
                      <Form.Label>Upload presenter's picture:</Form.Label>
                      <Form.Control type="input" name="sessPresenterPic" placeholder="URL for presenter's picture" value={session.sessPresenterPic} className="formInput" onChange={handleInputChange} />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Row>
              {(sessType === "edit_session")
                ? <Button data-toggle="popover" title="Update" className="button" onClick={handleFormUpdate} type="submit">Update Form</Button>
                : <Button data-toggle="popover" title="Submit" className="button" onClick={handleFormSubmit} type="submit">Submit Form</Button>}
            </Row>

          </Form>
        </Container>}
    </>
  )

}

export default SessionForm;