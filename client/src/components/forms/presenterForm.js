import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Container, Row, Col, Button, Image } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { ConferenceAPI, PresenterAPI, SessionAPI } from "../../utils/api";
import { presValidate } from "../../utils/validation";
import { PresenterFormCard } from "../cards";
import { ErrorModal, SuccessModal } from "../modals";
import "./style.css";

const PresenterForm = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const emailRef = useRef();
  const history = useHistory();
  const location = useLocation();
  const [presenter, setPresenter] = useState({
    presGivenName: "",
    presFamilyName: "",
    presOrg: "",
    presBio: "",
    presEmail: "",
    presPhone: "",
    presWebsite: "",
    presPic: "",
    presSessionIds: []
  });
  const [conference, setConference] = useState();
  const [session, setSession] = useState();
  const [charRem, setCharRem] = useState(750);
  const [errThrown, setErrThrown] = useState();
  const [errors, setErrors] = useState({});
  const [presReady, setPresReady] = useState(false);
  const [confReady, setConfReady] = useState(false);
  const [sessReady, setSessReady] = useState(false);
  let latestSess;
  let presArr = [];

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

  // GETs presenter info by email and confId
  // No, I need to GET all presenters by sessId to map through them
  const fetchPresByEmail = async (email, id) => {
    // GET presenter information
    return PresenterAPI.getPresenterByEmail(email, id)
      .then(resp => {
        console.log("from presForm getPresByEmail", resp.data)
        const presObj = resp.data;
        console.log({ presObj })
        presArr = [...presArr, presObj]
        console.log({ presArr })
        if (presArr.length === latestSess.sessPresEmails.length) {
          setPresenter(presArr)
          // return presArr
        }
        setPresReady(true)
      })
      .catch(err => {
        console.log(err)
        return false;
      })
  }

  // GETs session info by sessId
  const fetchOneSess = async (sessid) => {
    // Edit existing session: GET session information
    return SessionAPI.getSessionById(sessid)
      .then(resp => {
        console.log("from presForm getSessById", resp.data)
        const sessObj = resp.data[0]
        setSession(sessObj)
        setSessReady(true);
      })
      .catch(err => {
        console.log(err)
        return false;
      })
  }

  // GETs all sessions by confId, then sorts by date and sets the most recent one in state
  const fetchSessions = async (id) => {
    // GET all sessions by confId
    return SessionAPI.getSessions(id)
      .then(resp => {
        console.log("from presForm getSessions", resp.data)
        const sessArr = resp.data
        latestSess = sessArr.reduce((r, a) => {
          return r.date > a.date ? r : a
        });
        console.log({ latestSess });
        setSession(latestSess);
        setSessReady(true);
        return latestSess;
      })
      .catch(err => {
        console.log(err);
        return false;
      })
  }

  // GETs conference info by confId
  const fetchConf = async (confid) => {
    switch (formType) {
      // Edit existing presenter
      case "edit_presenter_info":
        // Call fetchOneSess()
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
    setPresenter({ ...presenter, [e.target.name]: e.target.value.slice(0, 750) })
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
      const idx = session.sessPresEmails.indexOf(presenter.presEmail)
      console.log({ idx });
      console.log("Presenter submit", presenter)
      // POST call to create presenter document
      PresenterAPI.savePresenter({ ...presenter, confId: urlId, presEmail: emailRef.current.value, presSessionIds: [...presenter.presSessionIds, session._id] })
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

  const handlePageLoad = async (id) => {
    await fetchConf(id);
    await fetchSessions(id)
      .then(sess => {
        sess.sessPresEmails.map(email => fetchPresByEmail(email, id))
      })
  }

  useEffect(() => {
    if (isAuthenticated) {
      switch (formType) {
        case "edit_presenter_info":
          // urlId === sessId
          fetchConf(urlId);
          break;
        default:
          handlePageLoad(urlId);
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
        confReady === true &&
        sessReady === true &&
        presReady === true &&
        (user.email === conference.ownerEmail || conference.confAdmins.includes(user.email)) &&
        <Container>
          <Row>
            <Col sm={2}>
              <Button data-toggle="popover" title="Go Back" className="button" onClick={() => history.goBack()} type="submit">Go Back</Button>
            </Col>
            <Col sm={2}>
              {(formType === "edit_presenter_info" || formType === "admin_edit_pres")
                ? <Button data-toggle="popover" title="Update" className="button" onClick={handleFormUpdate} type="submit">Update Form</Button>
                : <Button data-toggle="popover" title="Update" className="button" onClick={handleFormSubmit} type="submit">Submit Form</Button>}
            </Col>
          </Row>

          <PresenterFormCard presenter={presenter} session={session} conference={conference} handleInputChange={handleInputChange} handleTextArea={handleTextArea} charRem={charRem} />

          <Row>
            <Col sm={2}>
              <Button data-toggle="popover" title="Go Back" className="button" onClick={() => history.goBack()} type="submit">Go Back</Button>
            </Col>
            <Col sm={2}>
              {(formType === "edit_presenter_info" || formType === "admin_edit_pres")
                ? <Button data-toggle="popover" title="Update" className="button" onClick={handleFormUpdate} type="submit">Update Form</Button>
                : <Button data-toggle="popover" title="Update" className="button" onClick={handleFormSubmit} type="submit">Submit Form</Button>}
            </Col>
          </Row>

          <SuccessModal conference={conference} confname={conference.confName} urlid={urlId} urltype={formType} show={showSuccess} hide={e => handleHideSuccess(e)} />

          <ErrorModal conference={conference} confname={conference.confName} urlid={urlId} urltype={formType} errmsg={errThrown} show={showErr} hide={e => handleHideErr(e)} />

        </Container>}
    </>
  )
}

export default PresenterForm;