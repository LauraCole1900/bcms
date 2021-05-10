import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Container, Form, Card, Row, Col, Button, Image } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { ConferenceAPI, PresenterAPI, SessionAPI } from "../../utils/api";
import { sessValidate } from "../../utils/validation";
import { ErrorModal, SuccessModal } from "../modals";
import "./style.css";

// store presEmail[] in session document
// cross-ref by presEmail.includes and confId?
// then, GET session document(s) by confId and sessPresEmail.includes
// Compare to presSessId.includes[] and eliminate those that match 
// PUT presenter document with new session._id in presSessionIds[]

const SessionForm = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const history = useHistory();
  const [session, setSession] = useState({
    sessName: "",
    sessPresEmails: [],
    sessPresNames: [],
    sessPresOrgs: [],
    sessDesc: "",
    sessDate: "",
    sessStart: "",
    sessEnd: "",
    sessKeynote: "",
    sessPanel: "",
    sessRoom: ""
  });
  let presenter = {
    presGivenName: "",
    presFamilyName: "",
    presOrg: "",
    presBio: "",
    presPhone: "",
    presWebsite: "",
    presPic: "",
    presSessionIds: []
  };
  const [conference, setConference] = useState();
  const [charRem, setCharRem] = useState(750);
  const [errThrown, setErrThrown] = useState();
  const [errors, setErrors] = useState({});
  const [sessReady, setSessReady] = useState(false);
  const [confReady, setConfReady] = useState(false);

  // Grabs conference ID from URL for new sessions or session ID from URL for existing sessions
  // Uses URL to determine whether this is a new session or an existing session
  // If formType === add_session, then urlId === confId
  // If formType === edit_session, then urlId === sessId
  const urlArray = window.location.href.split("/")
  const urlId = urlArray[urlArray.length - 1]
  const formType = urlArray[urlArray.length - 2]

  // Modal variables
  const [showSuccess, setShowSuccess] = useState(false);
  const [showErr, setShowErr] = useState(false);

  // Sets boolean to show or hide relevant modal
  const handleShowSuccess = () => setShowSuccess(true);
  const handleHideSuccess = () => setShowSuccess(false);
  const handleShowErr = () => setShowErr(true);
  const handleHideErr = () => setShowErr(false);

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

  const fetchPresByEmail = async (email, id) => {
    // GET presenter information
    return PresenterAPI.getPresenterByEmail(email, id)
      .then(resp => {
        console.log("from sessForm fetchPresByEmail", resp.data)
        const presObj = resp.data;
        console.log({ presObj });
        // setPresenter(presObj);
        return presObj
      })
      .catch(err => {
        console.log(err)
        return false;
      })
  }

  const handlePres = async (email, confId, sessId, session) => {
    // Check whether presenter already exists for that conference
    let pres = await fetchPresByEmail(email, confId);
    if (pres) {
      // If presenter exists, check whether sessId is already in presSessionIds[]
      if (pres.presSessionIds.includes(sessId)) {
        return false
      } else {
        // If presenter exists without sessId, add new session ID to presSessionIds[]
        PresenterAPI.updatePresenterByEmail({ ...pres, presSessionIds: [...pres.presSessionIds, sessId] }, email, confId)
          .then(resp => {
            console.log("updatePresenter", resp)
          })
          .catch(err => {
            console.log(err)
            setErrThrown(err.message);
            handleShowErr();
          })
      }
    } else {
      // If presenter doesn't exist, create new presenter document
      PresenterAPI.savePresenter({ ...presenter, confId: session.confId, presEmail: email, presKeynote: session.sessKeynote, presSessionIds: [sessId] })
        .then(resp => {
          console.log("savePresenter", resp);
        })
        .catch(err => {
          console.log(err);
          setErrThrown(err.message);
          handleShowErr();
        })
    }
  }

  const fetchConf = async (confid) => {
    switch (formType) {
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

  // Handles input changes to form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSession({ ...session, [name]: value })
    if (name === "sessPresEmails") {
      // Splits input to sessPresEmail field at commas to create an array
      let emails = value.split(",")
      setSession({ ...session, sessPresEmails: emails })
    }
  };

  // Handles character limit and input changes for textarea
  const handleTextArea = (e) => {
    const { name, value } = e.target;
    const charCount = value.length;
    const charLeft = 750 - charCount;
    setCharRem(charLeft);
    setSession({ ...session, [name]: value.slice(0, 750) })
  }

  // Handles click on "Update" button
  const handleFormUpdate = (e) => {
    e.preventDefault();
    // Validates required inputs
    const validationErrors = sessValidate([session, conference]);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      console.log("Session update", urlId);
      // PUT call to update session document
      SessionAPI.updateSession({ ...session }, urlId)
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
      const emailArr = session.sessPresEmails
      console.log(emailArr);
      emailArr.forEach(email => {
        const trimmedEmail = email.trim()
        handlePres(trimmedEmail, session.confId, urlId, session);
      })
    } else {
      console.log({ validationErrors });
    }
  };

  // Handles click on "Submit" button
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    let sessId;
    // Validates required inputs
    const validationErrors = sessValidate([session, conference]);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      console.log("Session submit", session)
      // POST call to create session document
      await SessionAPI.saveSession({ ...session, confId: urlId })
        .then(resp => {
          console.log(resp);
          sessId = resp.data._id;
          console.log({ sessId });
          return sessId;
        })
        .catch(err => {
          console.log(err)
          setErrThrown(err.message);
          handleShowErr();
        })
      const emailArr = session.sessPresEmails
      emailArr.forEach(email => {
        const trimmedEmail = email.trim()
        handlePres(trimmedEmail, session.confId, sessId, session)
          .then(resp => {
            // If no errors thrown, push to Presenters form
            history.push(`/new_session_2/${urlId}`, { params: [session] })
          })
      });
    } else {
      console.log({ validationErrors });
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      switch (formType) {
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
        sessReady === true &&
        confReady === true &&
        (user.email === conference.ownerEmail || conference.confAdmins.includes(user.email)) &&
        <Container>
          <Form className="sessForm">

            <Row>
              {(formType === "edit_session")
                ? <Button data-toggle="popover" title="Update" className="button" onClick={handleFormUpdate} type="submit">Update Form</Button>
                : <Button data-toggle="popover" title="Next Page" className="button" onClick={handleFormSubmit} type="submit">Next Page</Button>}
            </Row>

            <Card className="formCard">
              <Card.Title><h1>Basic Information</h1></Card.Title>

              <Card.Body className="cardBody">
                <Row>
                  <Col sm={12}>
                    <Form.Group controlId="formSessName">
                      <Form.Label>Name of session: <span className="red">*</span></Form.Label>
                      {errors.sessName &&
                        <div className="error"><p>{errors.sessName}</p></div>}
                      <Form.Control required type="input" name="sessName" placeholder="Enter session name" value={session.sessName} className="formInput" onChange={handleInputChange} />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col sm={12}>
                    <Form.Group controlId="formSessDesc">
                      <Form.Label>Session description (min 10 characters, max 750 characters): <span className="red">*</span></Form.Label>
                      {errors.sessDesc &&
                        <div className="error"><p>{errors.sessDesc}</p></div>}
                      <Form.Control required as="textarea" rows={10} type="input" name="sessDesc" placeholder="Enter session description" value={session.sessDesc} className="formText" onChange={handleTextArea} />
                      <Form.Text muted>Characters remaining: {charRem}</Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Form.Group controlId="formSessWhen">
                    <Col sm={4}>
                      <Form.Label>Session date: <span className="red">*</span></Form.Label>
                      {errors.sessDate &&
                        <div className="error"><p>{errors.sessDate}</p></div>}
                      <Form.Control required type="date" min={conference.startDate} max={conference.endDate} name="sessDate" value={session.sessDate} className="formDate" onChange={handleInputChange} />
                    </Col>
                    <Col sm={4}>
                      <Form.Label>Session start time: <span className="red">*</span></Form.Label>
                      {errors.sessStart &&
                        <div className="error"><p>{errors.sessStart}</p></div>}
                      <Form.Control required type="time" name="sessStart" placeholder="09:00" value={session.sessStart} className="formTime" onChange={handleInputChange} />
                    </Col>
                    <Col sm={4}>
                      <Form.Label>Session end time: <span className="red">*</span></Form.Label>
                      {errors.sessEnd &&
                        <div className="error"><p>{errors.sessEnd}</p></div>}
                      <Form.Control required type="time" name="sessEnd" placeholder="10:00" min={session.sessStart} value={session.sessEnd} className="formTime" onChange={handleInputChange} />
                    </Col>
                  </Form.Group>
                </Row>

                {conference.confType === "Live" &&
                  <Row>
                    <Form.Group controlId="formSessWhere">
                      <Col sm={12}>
                        <Form.Label>Session room or location: <span className="red">*</span></Form.Label>
                        {errors.sessRoom &&
                          <div className="error"><p>{errors.sessRoom}</p></div>}
                        <Form.Control required type="input" name="sessRoom" placeholder="Enter a room or location, or TBA or TBD if the room or location hasn't been assigned" value={session.sessRoom} className="formInput" onChange={handleInputChange} />
                      </Col>
                    </Form.Group>
                  </Row>}

                <Row>
                  <Col sm={6}>
                    <Form.Group controlId="formSessPanel">
                      <Form.Label>Is this a panel discussion? <span className="red">*</span></Form.Label>
                      {errors.sessPanel &&
                        <div className="error"><p>{errors.sessPanel}</p></div>}
                      <Form.Check type="radio" id="sessPanelYes" name="sessPanel" label="Yes" value="yes" checked={session.sessPanel === "yes"} onChange={handleInputChange} />
                      <Form.Check type="radio" id="sessPanelNo" name="sessPanel" label="No" value="no" checked={session.sessPanel === "no"} onChange={handleInputChange} />
                    </Form.Group>
                  </Col>
                  {conference.confKeynote === "yes" &&
                    <Col sm={6}>
                      <Form.Group controlId="formSessKeynote">
                        <Form.Label>Is this a keynote session? <span className="red">*</span></Form.Label>
                        {errors.sessKeynote &&
                          <div className="error"><p>{errors.sessKeynote}</p></div>}
                        <Form.Check type="radio" id="sessKeyYes" name="sessKeynote" label="Yes" value="yes" checked={session.sessKeynote === "yes"} onChange={handleInputChange} />
                        <Form.Check type="radio" id="sessKeyNo" name="sessKeynote" label="No" value="no" checked={session.sessKeynote === "no"} onChange={handleInputChange} />
                      </Form.Group>
                    </Col>}
                </Row>

                <Form.Group controlId="formSessNumPres">
                  <Row>
                    <Col sm={12}>
                      <Form.Label>Presenter emails: <span className="red">*</span></Form.Label><br />
                      <Form.Text className="subtext" muted>Please separate emails with commas.</Form.Text>
                      {errors.sessPresEmails &&
                        <div className="error"><p>{errors.sessPresEmails}</p></div>}
                      <Form.Control required type="email" name="sessPresEmails" placeholder="name@email.com" value={session.sessPresEmails} className="formEmail" onChange={handleInputChange} />
                    </Col>
                  </Row>
                </Form.Group>

              </Card.Body>
            </Card>

            <Row>
              {errors &&
                <div className="error"><p>The gremlins have detected an error or omission in one or more required fields. Please review this form.</p></div>}
            </Row>
            <Row>
              {(formType === "edit_session")
                ? <Button data-toggle="popover" title="Update" className="button" onClick={handleFormUpdate} type="submit">Update Form</Button>
                : <Button data-toggle="popover" title="Next Page" className="button" onClick={handleFormSubmit} type="submit">Next Page</Button>}
            </Row>

          </Form>

          <SuccessModal conference={conference} confname={conference.confName} urlid={urlId} urltype={formType} show={showSuccess} hide={e => handleHideSuccess(e)} />

          <ErrorModal conference={conference} confname={conference.confName} urlid={urlId} urltype={formType} errmsg={errThrown} show={showErr} hide={e => handleHideErr(e)} />

        </Container>}
    </>
  )

}

export default SessionForm;