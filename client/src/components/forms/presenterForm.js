import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Form, Card, Row, Col, Button, Image } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { ConferenceAPI, PresenterAPI, SessionAPI } from "../../utils/api";
import { presValidate } from "../../utils/validation";
import { ErrorModal, SuccessModal } from "../modals";
import "./style.css";

const PresenterForm = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const [presenter, setPresenter] = useState({
    presGivenName: "",
    presFamilyName: "",
    presOrg: "",
    presBio: "",
    presEmail: "",
    presPhone: "",
    presWebsite: "",
    presPic: "",
  });
  const [conference, setConference] = useState();
  const [session, setSession] = useState();
  const [charRem, setCharRem] = useState(750);
  const [errThrown, setErrThrown] = useState();
  const [errors, setErrors] = useState({});
  const [presReady, setPresReady] = useState(false);
  const [confReady, setConfReady] = useState(false);

  // Grabs conference ID from URL for new presenters or presenter ID from URL for existing presenters
  // Uses URL to determine whether this is adding a session presenter or editing an existing presenter
  // If formType === presenter_info, then urlId === confId
  // If formType === edit_presenter_info, then urlId === sessId
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

  // GETs presenter info by presId
  const fetchPres = async (presid) => {
    // Edit existing presenter: GET presenter information
    return PresenterAPI.getPresenterById(presid)
      .then(resp => {
        console.log("from presForm getPresById", resp.data)
        const presObj = resp.data[0]
        setPresenter(presObj)
        return presObj
      })
      .catch(err => {
        console.log(err)
        return false;
      })
  }

  // GETs session info by sessId
  // How to GET sessId?
  const fetchOneSess = async (sessid) => {
    // Edit existing session: GET session information
    return SessionAPI.getSessionById(sessid)
      .then(resp => {
        console.log("from presForm getSessById", resp.data)
        const sessObj = resp.data[0]
        setSession(sessObj)
        return sessObj
      })
      .catch(err => {
        console.log(err)
        return false;
      })
  }

  // GETs all sessions by confId, then sorts by date and grabs the most recent one
  const fetchSessions = async (id) => {
    // GET all sessions by confId
    return SessionAPI.getSessions(id)
      .then(resp => {
        console.log("from presForm getSessions", resp.data)
        const sessArr = resp.data
        const latestSess = sessArr.reduce((r, a) => {
          return r.date > a.date ? r : a
        });
        return latestSess;
      })
  }

  // GETs conference info by confId
  const fetchConf = async (confid) => {
    switch (formType) {
      // Edit existing presenter
      case "edit_presenter_info":
        // Call fetchPres()
        let sessObj = await fetchOneSess(confid)
        console.log({ sessObj });
        // Use response from fetchOneSess() to GET conference information
        await ConferenceAPI.getConferenceById(sessObj.confId)
          .then(resp => {
            console.log("from presForm getConfById", resp.data)
            const confObj = resp.data[0]
            setConference(confObj)
            setConfReady(true);
          })
          .catch(err => console.log(err))
        break;
      // New session
      default:
        // Use ID in URL to GET conference information
        await ConferenceAPI.getConferenceById(confid)
          .then(resp => {
            console.log("from presForm getConfById", resp.data)
            const confObj = resp.data[0]
            setConference(confObj)
            setConfReady(true);
          })
          .catch(err => console.log(err))
    }
  }

  // Handles input changes to form fields
  const handleInputChange = (e) => {
    setPresenter({ ...presenter, [e.target.name]: e.target.value })
  };

  // Handles character limit and input changes for textarea
  const handleTextArea = (e) => {
    const charCount = e.target.value.length;
    const charLeft = 750 - charCount;
    setCharRem(charLeft);
    setSession({ ...presenter, [e.target.name]: e.target.value.slice(0, 750) })
  }

  // Handles click on "Check for existing" button
  const handleEmailCheck = (e) => {
    console.log("presForm handleEmailCheck", e.target.value)
    // GETs presenter document by email
    PresenterAPI.getPresenterByEmail(e.target.value, conference._id)
      .then(resp => {
        if (resp.length > 0) {
          console.log("from presForm handleEmailCheck", resp.data)
          const presObj = resp.data[0]
          setPresenter({ ...presenter, presObj })
          // PUT presenter document with confId added to confId[] and sessId added to sessId[]
          return true
        } else {
          return false
        }
      })
  }

  // Handles click on "Update" button
  const handleFormUpdate = (e) => {
    e.preventDefault();
    // Validates required inputs
    const validationErrors = presValidate([presenter, conference]);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      console.log("Presenter update", urlId);
      // PUT call to update presenter document
      PresenterAPI.updatePresenter({ ...presenter }, urlId)
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
    } else {
      console.log({ validationErrors });
    }
  };

  // Handles click on "Submit" button
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Validates required inputs
    const validationErrors = presValidate([presenter, conference]);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      console.log("Presenter submit", presenter)
      // POST call to create presenter document
      PresenterAPI.savePresenter({ ...presenter, confId: urlId })
        .then(res => {
          // If no errors thrown, push to Success page
          if (!res.err) {
            handleShowSuccess();
          }
        })
        // If yes errors thrown, push to Error page
        .catch(err => {
          console.log(err)
          setErrThrown(err.message);
          handleShowErr();
        });
    } else {
      console.log({ validationErrors });
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      switch (formType) {
        case "edit_presenter_info":
          // urlId === sessId
          fetchConf(urlId)
          break;
        default:
          fetchSessions(urlId)
      }
    }
  })



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
        (user.email === conference.ownerEmail || conference.confAdmins.includes(user.email)) &&
        <Container>
          <Form className="presForm">

            <Card className="formCard">
              <Card.Title><h1>Presenter Information</h1></Card.Title>

              <Card.Body className="cardBody">
                <Form.Group controlId="formNumPres">
                  <Row>
                    <Col sm={3}>
                      <Form.Label>Number of presenters: <span className="red">*</span></Form.Label>
                      <Form.Control required type="number" min="1" max="15" name="sessNumPres" placeholder="Enter a number, 1-15" value={session.sessNumPres} className="formNum" onChange={handleInputChange} />
                    </Col>
                  </Row>
                </Form.Group>

                <Form.Group controlId="formPresEmail">
                  <Row>
                    <Col sm={6}>
                      <Form.Label>Presenter's email: <span className="red">*</span></Form.Label>
                      <Form.Control required type="email" name="presEmail" placeholder="name@email.com" value={presenter.presEmail} className="formEmail" onChange={handleInputChange} />
                    </Col>
                    <Col sm={6}>
                      <Button data-toggle="popover" title="Check whether presenter already exists in database" className="button" onClick={handleEmailCheck} type="submit">Check for existing</Button>
                    </Col>
                  </Row>
                </Form.Group>

                <Form.Group controlId="formPresName">
                  <Row>
                    <Col sm={6}>
                      <Form.Label>Presenter's first name: <span className="red">*</span></Form.Label>
                      <Form.Control required type="input" name="presGivenName" placeholder="Enter presenter's name" value={presenter.presGivenName} className="formInput" onChange={handleInputChange} />
                    </Col>
                    <Col sm={6}>
                      <Form.Label>Presenter's last name: <span className="red">*</span></Form.Label>
                      <Form.Control required type="email" name="presFamilyName" placeholder="name@email.com" value={presenter.presFamilyName} className="formEmail" onChange={handleInputChange} />
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={12}>
                      <Form.Label>Presenter's organization: <span className="red">*</span></Form.Label>
                      <Form.Control required type="input" name="presOrg" placeholder="Enter organization the presenter represents" value={presenter.presOrg} className="formInput" onChange={handleInputChange} />
                    </Col>
                  </Row>
                </Form.Group>

                <Form.Group controlId="formPresContact">
                  <Row>
                    <Col sm={4}>
                      <Form.Label>Presenter's phone:</Form.Label>
                      <Form.Control type="input" name="presPhone" placeholder="(123)456-7890" value={presenter.presPhone} className="formInput" onChange={handleInputChange} />
                    </Col>
                    <Col sm={8}>
                      <Form.Label>Presenter's website URL:</Form.Label>
                      <Form.Control type="input" name="presWebsite" placeholder="http://www.website.com" value={presenter.presWebsite} className="formInput" onChange={handleInputChange} />
                    </Col>
                  </Row>
                </Form.Group>

                <Row>
                  <Col sm={12}>
                    <Form.Group controlId="formPresBio">
                      <Form.Label>Presenter's bio (min 10 characters, max 750 characters):</Form.Label>
                      <Form.Control as="textarea" rows={10} type="input" name="presBio" placeholder="Enter a short bio of the presenter" value={presenter.presBio} className="formInput" onChange={handleTextArea} />
                      <Form.Text muted>Characters remaining: {charRem}</Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col sm={12}>
                    <Form.Group controlId="formPresPic">
                      <Form.Label>Upload presenter's picture:</Form.Label>
                      <Form.Control type="input" name="presPic" placeholder="URL for presenter's picture" value={presenter.presPic} className="formInput" onChange={handleInputChange} />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Row>
              {(formType === "edit_presenter_info")
                ? <Button data-toggle="popover" title="Update" className="button" onClick={handleFormUpdate} type="submit">Update Form</Button>
                : <Button data-toggle="popover" title="Submit" className="button" onClick={handleFormSubmit} type="submit">Submit</Button>}
            </Row>

          </Form>

          <SuccessModal conference={conference} urlid={urlId} urltype={formType} show={showSuccess} hide={e => handleHideSuccess(e)} />

          <ErrorModal conference={conference} urlid={urlId} urltype={formType} errmsg={errThrown} show={showErr} hide={e => handleHideErr(e)} />

        </Container>}
    </>
  )
}

export default PresenterForm;