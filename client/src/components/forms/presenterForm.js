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
  const [presenter, setPresenter] = useState([]);
  const [conference, setConference] = useState();
  const [session, setSession] = useState();
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
        presArr = [...presArr, resp.data]
        console.log({ presArr })
        if (presArr.length === latestSess.sessPresEmails.length) {
          setPresenter(presArr)
          setPresReady(true);
          return presArr
        }
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

  // Sets inputs to form fields in state
  const handleInputChange = (data) => {
    const presData = data;
    console.log({ presData });
    console.log(typeof presData);
    setPresenter(presData);
    console.log({ presenter });
  };

  // Sets textarea inputs in state
  const handleTextArea = (data) => {
    const presData = data;
    console.log({ presData });
    setPresenter(presData);
    console.log({ presenter });
  }

  // Handles click on "Update" button
  const handleFormUpdate = (e) => {
    e.preventDefault();
    // Validates required inputs
    const validationErrors = presValidate(presenter);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      console.log("Presenter update", presenter);
      // PUT call to update presenter document
      PresenterAPI.updatePresenter({ ...presenter }, urlId)
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
    } else {
      console.log({ validationErrors });
    }
  };

  // Handles click on "Submit" button
  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Presenter submit", presenter)
    presenter.forEach(pres => {
      console.log("Presenter submit", presenter)
      // Validates required inputs
      const validationErrors = presValidate(pres);
      const noErrors = Object.keys(validationErrors).length === 0;
      setErrors(validationErrors);
      if (noErrors) {
        // PUT call to update presenter document
        PresenterAPI.updatePresenter({ ...pres }, pres._id)
          .then(resp => {
            // If no errors thrown, push to Success page
            if (!resp.err) {
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
    });
  }

  const handlePageLoad = async (id) => {
    await fetchConf(id);
    await fetchSessions(id)
      .then(sess => {
        sess.sessPresEmails.map(email => fetchPresByEmail(email, id))
        console.log("from presForm pageLoad", presenter)
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
              {(formType === "edit_presenter_info" || formType === "admin_edit_pres")
                ? <Button data-toggle="popover" title="Update" className="button" onClick={handleFormUpdate} type="submit">Update Form</Button>
                : <Button data-toggle="popover" title="Submit" className="button" onClick={handleFormSubmit} type="submit">Submit Form</Button>}
            </Col>
            <Col sm={2}>
              <Button data-toggle="popover" title="Go Back" className="button" onClick={() => history.goBack()} type="submit">Go Back</Button>
            </Col>
          </Row>

          <PresenterFormCard presenter={presenter} session={session} conference={conference} errors={errors} handleChange={handleInputChange} handleText={handleTextArea} />

          <Row>
            <Col sm={2}>
              {(formType === "edit_presenter_info" || formType === "admin_edit_pres")
                ? <Button data-toggle="popover" title="Update" className="button" onClick={handleFormUpdate} type="submit">Update Form</Button>
                : <Button data-toggle="popover" title="Submit" className="button" onClick={handleFormSubmit} type="submit">Submit Form</Button>}
            </Col>
            <Col sm={2}>
              <Button data-toggle="popover" title="Go Back" className="button" onClick={() => history.goBack()} type="submit">Go Back</Button>
            </Col>
          </Row>

          <SuccessModal conference={conference} confname={conference.confName} urlid={urlId} urltype={formType} show={showSuccess} hide={e => handleHideSuccess(e)} />

          <ErrorModal conference={conference} confname={conference.confName} urlid={urlId} urltype={formType} errmsg={errThrown} show={showErr} hide={e => handleHideErr(e)} />

        </Container>}
    </>
  )
}

export default PresenterForm;