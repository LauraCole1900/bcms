import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Container, Row, Col, Button, Image } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { ConferenceAPI, PresenterAPI, SessionAPI } from "../../utils/api";
import { presValidate } from "../../utils/validation";
import { PresenterFormCard } from "../cards";
import { ErrorModal, SuccessModal } from "../modals";
import "./style.css";

const PresenterForm = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const history = useHistory();
  const [presenter, setPresenter] = useState([]);
  const [conference, setConference] = useState();
  const [session, setSession] = useState();
  const [errThrown, setErrThrown] = useState();
  const [errors, setErrors] = useState([]);
  const [presReady, setPresReady] = useState(false);
  const [confReady, setConfReady] = useState(false);
  const [sessReady, setSessReady] = useState(false);
  let sess;
  let presObj;
  let sessObj;
  let presArr = [];
  let idx = 0;

  // Grabs conference ID from URL for new presenters or presenter ID from URL for existing presenters
  // Uses URL to determine whether this is adding a session presenter or editing an existing presenter
  // If formType === new_session_pres, then urlId === sessId
  // If formType === edit_presenter, then urlId === presId
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
  const fetchPres = async (presId) => {
    // Edit existing presenter: GET presenter information
    return PresenterAPI.getPresenterById(presId)
      .then(resp => {
        console.log("from presForm getPresById", resp.data)
        presObj = resp.data
        setPresenter([presObj])
        setPresReady(true);
        return presObj
      })
      .catch(err => {
        console.log(err)
        return false;
      })
  }

  // GETs presenter info by email and confId
  const fetchPresByEmail = async (email, id) => {
    // GET presenter information
    return PresenterAPI.getPresenterByEmail(email, id)
      .then(resp => {
        console.log("from presForm fetchPresByEmail", resp.data)
        presArr = [...presArr, resp.data]
        console.log({ presArr })
        if (presArr.length === sessObj.sessPresEmails.length) {
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
  const fetchSess = async (sessId) => {
    // Edit existing session: GET session information
    return SessionAPI.getSessionById(sessId)
      .then(resp => {
        console.log("from presForm fetchSess", resp.data)
        sessObj = resp.data[0];
        console.log({ sess });
        setSession(sess);
        setSessReady(true);
        return sessObj;
      })
      .catch(err => {
        console.log(err)
        return false;
      })
  }

  // GET conference information
  const fetchConf = async (id) => {
    switch (formType) {
      // Edit existing presenter
      // GETs conference info by presId
      case "edit_presenter":
      case "admin_edit_pres":
        // Call fetchPres()
        presObj = await fetchPres(id)
        // Use response from fetchPres() to GET conference information
        ConferenceAPI.getConferenceById(presObj.confId)
          .then(resp => {
            console.log("from presForm getConfById", resp.data)
            const confObj = resp.data[0]
            setConference(confObj)
            setConfReady(true);
            setSessReady(true);
          })
          .catch(err => console.log(err))
        break;
      // Presenter for new session
      default:
        // Call fetchSess()
        sessObj = await fetchSess(id);
        console.log(sessObj)
        // Use response from fetchSess() to GET conference information
        await ConferenceAPI.getConferenceById(sessObj.confId)
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
    setPresenter(presData);
  };

  // Sets textarea inputs in state
  const handleTextArea = (data) => {
    const presData = data;
    setPresenter(presData);
  }

  // Handles click on "Update" button
  const handleFormUpdate = (e) => {
    e.preventDefault();
    // Validates required inputs
    const validationErrors = presValidate(presenter[0]);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    switch (noErrors) {
      case true:
        console.log("Presenter update", presenter);
        // PUT call to update presenter document
        PresenterAPI.updatePresenterByEmail({ ...presenter[0] }, presenter[0].presEmail, presenter[0].confId)
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
        break;
      default:
        console.log({ validationErrors });
    }
  };

  // Handles click on "Submit" button
  const handleFormSubmit = (e) => {
    e.preventDefault();
    let validationErrors;
    let valid;
    presenter.forEach(pres => {
      console.log("Presenter submit forEach", presenter)
      idx = presenter.indexOf(pres)
      console.log({ idx });
      // Validates required inputs
      validationErrors = presValidate(pres);
      errors[idx] = validationErrors;
      const noErrors = Object.keys(validationErrors).length === 0;
      setErrors([...errors], errors);
      switch (noErrors) {
        case true:
          // PUT call to update presenter document
          PresenterAPI.updatePresenterByEmail({ ...pres, presAccepted: "yes" }, pres.presEmail, pres.confId)
            .then(resp => {
              if (!resp.err) {
                return false
              }
            })
            // If yes errors thrown, push to Error modal
            .catch(err => {
              console.log(err);
              valid = err;
              setErrThrown(err.message);
              handleShowErr();
              return valid;
            })
          break;
        default:
          console.log({ validationErrors });
          console.log({ errors });
      }
    })
    // If no errors thrown, push to Success page
    if (!valid) {
      const errorBool = errors.every(err => Object.keys(err).length === 0)
      switch (errorBool) {
        case true:
          handleShowSuccess();
          break;
        default:
          return false;
      }
    }
    return idx;
  }

  const handlePageLoad = async (id) => {
    await fetchSess(id)
      .then(sess => {
        sess.sessPresEmails.map(email => fetchPresByEmail(email, sess.confId))
        console.log("from presForm pageLoad", presenter)
      })
    await fetchConf(id);
  }

  useEffect(() => {
    if (isAuthenticated) {
      switch (formType) {
        case "edit_presenter":
        case "admin_edit_pres":
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
          <h1 className="regRemind">Please <Link to={window.location.origin} className="login" onClick={() => loginWithRedirect()}>log in</Link> to add or edit presenter information.</h1>
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
              {(formType === "edit_presenter" || formType === "admin_edit_pres")
                ? <Button data-toggle="popover" title="Update" className="button" onClick={handleFormUpdate} type="submit">Update Form</Button>
                : <Button data-toggle="popover" title="Submit" className="button" onClick={handleFormSubmit} type="submit">Submit Form</Button>}
            </Col>
            <Col sm={2}>
              <Button data-toggle="popover" title="Go Back" className="button" onClick={() => history.goBack()} type="submit">Go Back</Button>
            </Col>
          </Row>

          {Object.keys(errors).length > 0 && errors.every(err => err.length > 0) &&
            <Row>
              <Col sm={12}>
                <div className="error"><p>The nanobots have detected an error or omission in one or more required fields. Please review this form.</p></div>
              </Col>
            </Row>}

          <PresenterFormCard presenter={presenter} session={session} conference={conference} errors={errors} idx={idx} handleChange={handleInputChange} handleText={handleTextArea} />

          {Object.keys(errors).length > 0 && errors.every(err => err.length > 0) &&
            <Row>
              <Col sm={12}>
                <div className="error"><p>The nanobots have detected an error or omission in one or more required fields. Please review this form.</p></div>
              </Col>
            </Row>}
          <Row>
            <Col sm={2}>
              {(formType === "edit_presenter" || formType === "admin_edit_pres")
                ? <Button data-toggle="popover" title="Update" className="button" onClick={handleFormUpdate} type="submit">Update Form</Button>
                : <Button data-toggle="popover" title="Submit" className="button" onClick={handleFormSubmit} type="submit">Submit Form</Button>}
            </Col>
            <Col sm={2}>
              <Button data-toggle="popover" title="Go Back" className="button" onClick={() => history.goBack()} type="submit">Go Back</Button>
            </Col>
          </Row>

          <SuccessModal conference={conference} confname={conference.confName} confid={conference._id} urlid={urlId} urltype={formType} show={showSuccess} hide={e => handleHideSuccess(e)} />

          <ErrorModal conference={conference} confname={conference.confName} confid={conference._id} urlid={urlId} urltype={formType} errmsg={errThrown} show={showErr} hide={e => handleHideErr(e)} />

        </Container>}
    </>
  )
}

export default PresenterForm;