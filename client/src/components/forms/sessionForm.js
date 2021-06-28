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
    sessPropContName: "",
    sessPropContEmail: "",
    sessPropContPhone: "",
    sessDesc: "",
    sessDate: "",
    sessStart: "",
    sessEnd: "",
    sessKeynote: "",
    sessPanel: "",
    sessRoom: "",
    sessEquipConfirm: "",
    sessEquipProvide: "",
    sessEquip: "",
    sessAccepted: ""
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
  let emails = [];

  // Grabs conference ID from URL for new sessions or session ID from URL for existing sessions
  // Uses URL to determine whether this is a new session or an existing session
  // If formType === add_session or propose_session, then urlId === confId
  // If formType === edit_session or edit_propose_session, then urlId === sessId
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

  // Extracts presenter emails from array of presenter objects to array of emails
  const extractPresEmails = (pres) => {
    pres.forEach(onePres => {
      emails = [...emails, onePres.presEmail]
      if (emails.length === pres.length) {
        console.log({ emails });
      }
    })
    return emails;
  }

  // Update presenter document to remove current sessId
  const updatePresSessions = async (pres, email, confId, sessId) => {
    // If there is only one session in presSessionIds, delete presenter
    if (pres.presSessionIds.length === 1) {
      await PresenterAPI.deletePresenterByEmail(email, confId)
        .then(resp => {
          console.log("comparePres deletePres", resp);
        })
        .catch(err => {
          console.log(err)
          setErrThrown(err.message);
          handleShowErr();
        })
    } else {
      // Create array of session IDs that excludes the current sessId
      const newSessIds = pres.presSessionIds.filter(id => id !== sessId)
      // Update presenter document with new sessId[]
      await PresenterAPI.updatePresenterByEmail({ ...pres, presSessionIds: newSessIds }, email, confId)
        .then(resp => {
          console.log("comparePres updatePres", resp)
        })
        .catch(err => {
          console.log(err)
          setErrThrown(err.message);
          handleShowErr();
        })
    }
  }

  const comparePres = async (confId, sessId) => {
    // GET presenters for this conference
    PresenterAPI.getPresentersByConf(confId)
      .then(resp => {
        let presArr = resp.data;
        // Filter presenters by those whose presSessionIds includes this sessId
        const filteredPres = presArr.filter(pres => pres.presSessionIds.includes(sessId));
        if (filteredPres.length === session.sessPresEmails.length) {
          return false;
        } else {
          // Create array of presenter emails
          let presEmails = extractPresEmails(filteredPres);
          // Filter out those that also exist in sessPresEmails[]
          const filteredEmails = presEmails.filter(email => session.sessPresEmails.indexOf(email) === -1)
          // For each remaining email, reattach to the corresponding presenter document
          filteredEmails.forEach(email => {
            const thisPres = filteredPres.filter(pres => pres.presEmail === email)
            // If presSessionsIds.length === 1, delete pres
            updatePresSessions(thisPres[0], email, confId, sessId)
          })
        }
      })
    console.log("pres compared");
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
        return await PresenterAPI.updatePresenterByEmail({ ...pres, presSessionIds: [...pres.presSessionIds, sessId] }, email, confId)
          .then(resp => {
            console.log("updatePresenter", resp)
            return resp;
          })
          .catch(err => {
            console.log(err)
            setErrThrown(err.message);
            handleShowErr();
          })
      }
    } else {
      // If presenter doesn't exist, create new presenter document
      return PresenterAPI.savePresenter({ ...presenter, confId: session.confId, presEmail: email, presKeynote: session.sessKeynote, presSessionIds: [sessId], presAccepted: "yes" })
        .then(resp => {
          console.log("savePresenter", resp);
          return resp;
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
      // Edit existing session or proposal
      case "edit_session" || "edit_propose_session":
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
      // New session or proposal
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
  const handleFormUpdate = async (e) => {
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
      // Pull sessPresEmails into array
      const emailArr = session.sessPresEmails
      // For each sessPresEmail, trim whitespace, then create or update presenter document
      emailArr.forEach(email => {
        const trimmedEmail = email.trim()
        handlePres(trimmedEmail, session.confId, urlId, session)
          .then(resp => {
            // Wait until the presenter document(s) has/have been created/updated before running comparePres()
            if (resp) {
            }
            comparePres(conference._id, urlId)
          })
          .catch(err => console.log(err));
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
    const validationErrors = sessValidate([session, conference, formType]);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      console.log("Session submit", session)
      // POST call to create session document
      await SessionAPI.saveSession({ ...session, confId: urlId, sessAccepted: "yes" })
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
            console.log(resp);
            if (!resp.err) {
              // If no errors thrown, push to Presenters form (new session) or Supplemental Materials form (propose session)
              if (formType === "new_session") {
                history.push(`/new_session_pres/${sessId}`, { params: [session] })
              } else if (formType === "propose_session") {
                history.push(`/propose_session_supp/${sessId}`)
              }
            }
          })
          .catch(err => {
            console.log(err);
            setErrThrown(err.message);
            handleShowErr();
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
          <h1 className="regRemind">Please <Link to={window.location.origin} className="login" onClick={() => loginWithRedirect()}>log in</Link> to add or edit a session.</h1>
          <div className="authLogo"><Image fluid="true" className="loadLogo" src="/images/bristlecone-dark.png" alt="BCMS logo" /></div>
        </Row>}

      {isAuthenticated &&
        sessReady === true &&
        confReady === true &&
        (user.email === conference.ownerEmail || conference.confAdmins.includes(user.email)) &&
        <Container>
          <Form className="sessForm">

            <Row>
              <Col sm={2}>
                {(formType === "edit_session")
                  ? <Button data-toggle="popover" title="Update" className="button" onClick={handleFormUpdate} type="submit">Update Form</Button>
                  : <Button data-toggle="popover" title="Next Page" className="button" onClick={handleFormSubmit} type="submit">Next Page</Button>}
              </Col>
            </Row>
            {Object.keys(errors).length !== 0 &&
              <Row>
                <Col sm={12}>
                  <div className="error"><p>The nanobots have detected an error or omission in one or more required fields. Please review this form.</p></div>
                </Col>
              </Row>}

            {(formType === "propose_session" || formType === "edit_propose_session") &&
              <Card className="formCard">
                <Card.Title><h1>Contact Information</h1></Card.Title>

                <Card.Body className="cardBody">
                  <Form.Group controlId="formSessPropContactInfo">
                    <Row>
                      <Col sm={6}>
                        <Form.Label>Contact person's name: <span className="red">*</span></Form.Label>
                        {errors.sessPropContName &&
                          <div className="error"><p>{errors.sessPropContName}</p></div>}
                        <Form.Control type="input" name="sessPropContName" placeholder="Martha Jones" value={session.sessPropContName} className="formInput" onChange={handleInputChange} />
                      </Col>
                      <Col sm={6}>
                        <Form.Label>Contact person's email: <span className="red">*</span></Form.Label>
                        {errors.sessPropContEmail &&
                          <div className="error"><p>{errors.sessPropContEmail}</p></div>}
                        <Form.Control type="email" name="sessPropContEmail" placeholder="name@email.com" value={session.sessPropContEmail} className="formEmail" onChange={handleInputChange} />
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={6}>
                        <Form.Label>Contact person's phone: <span className="red">*</span></Form.Label>
                        {errors.sessPropContPhone &&
                          <div className="error"><p>{errors.sessPropContPhone}</p></div>}
                        <Form.Control type="input" name="sessPropContPhone" placeholder="(123)456-7890" value={session.sessPropContPhone} className="formInput" onChange={handleInputChange} />
                      </Col>
                    </Row>
                  </Form.Group>
                </Card.Body>
              </Card>}

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
                      <Form.Label>Session date:</Form.Label>
                      <Form.Control required type="date" min={conference.startDate} max={conference.endDate} name="sessDate" value={session.sessDate} className="formDate" onChange={handleInputChange} />
                    </Col>
                    <Col sm={4}>
                      <Form.Label>Session start time:</Form.Label>
                      <Form.Control required type="time" name="sessStart" placeholder="09:00" value={session.sessStart} className="formTime" onChange={handleInputChange} />
                    </Col>
                    <Col sm={4}>
                      <Form.Label>Session end time:</Form.Label>
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

                <Form.Group controlId="formSessEquip">
                  <Row>
                    <Col sm={4}>
                      <Form.Label>Will participants be using any special equipment? <span className="red">*</span></Form.Label>
                      {errors.sessEquipConfirm &&
                        <div className="error"><p>{errors.sessEquipConfirm}</p></div>}
                      <Form.Check type="radio" id="sessEquipConfirmYes" name="sessEquipConfirm" label="Yes" value="yes" checked={session.sessEquipConfirm === "yes"} onChange={handleInputChange} />
                      <Form.Check type="radio" id="sessEquipConfirmNo" name="sessEquipConfirm" label="No" value="no" checked={session.sessEquipConfirm === "no"} onChange={handleInputChange} />
                    </Col>
                    {session.sessEquipConfirm === "yes" &&
                      <>
                        <Col sm={4}>
                          <Form.Label>Will the equipment be provided to the participants? <span className="red">*</span></Form.Label>
                          {errors.sessEquipProvide &&
                            <div className="error"><p>{errors.sessEquipProvide}</p></div>}
                          <Form.Check type="radio" id="sessEquipProvideYes" name="sessEquipProvide" label="Yes" value="yes" checked={session.sessEquipProvide === "yes"} onChange={handleInputChange} />
                          <Form.Check type="radio" id="sessEquipProvideNo" name="sessEquipConfirm" label="No" value="no" checked={session.sessEquipConfirm === "no"} onChange={handleInputChange} />
                        </Col>
                        <Col sm={4}>
                          <Form.Label>Please list any special equipment participants will be using: <span className="red">*</span></Form.Label><br />
                          <Form.Text className="subtext" muted>Please separate items with commas.</Form.Text>
                          {errors.sessEquip &&
                            <div className="error"><p>{errors.sessEquip}</p></div>}
                          <Form.Control required type="input" name="sessEquip" placeholder="book titles, musical instruments, kobudo gear, etc. Please be specific" value={session.sessEquip} className="formInput" onChange={handleInputChange} />
                        </Col>
                      </>}
                  </Row>
                </Form.Group>

                <Form.Group controlId="formSessPres">
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

            {Object.keys(errors).length !== 0 &&
              <Row>
                <Col sm={12}>
                  <div className="error"><p>The nanobots have detected an error or omission in one or more required fields. Please review this form.</p></div>
                </Col>
              </Row>}
            <Row>
              <Col sm={2}>
                {(formType === "edit_session")
                  ? <Button data-toggle="popover" title="Update" className="button" onClick={handleFormUpdate} type="submit">Update Form</Button>
                  : <Button data-toggle="popover" title="Next Page" className="button" onClick={handleFormSubmit} type="submit">Next Page</Button>}
              </Col>
            </Row>

          </Form>

          <SuccessModal conference={conference} confname={conference.confName} confid={urlId} urltype={formType} show={showSuccess} hide={e => handleHideSuccess(e)} />

          <ErrorModal conference={conference} confname={conference.confName} confid={urlId} urltype={formType} errmsg={errThrown} show={showErr} hide={e => handleHideErr(e)} />

        </Container>}
    </>
  )

}

export default SessionForm;