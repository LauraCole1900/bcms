import React, { useState, useEffect } from "react";
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
  const history = useHistory();
  const location = useLocation();
  const [presenter, setPresenter] = useState([]);
  const [conference, setConference] = useState();
  const [session, setSession] = useState();
  const [errThrown, setErrThrown] = useState();
  const [errors, setErrors] = useState([]);
  const [presReady, setPresReady] = useState(false);
  const [confReady, setConfReady] = useState(false);
  const [sessReady, setSessReady] = useState(false);
  let latestSess;
  let presObj;
  let presArr = [];

  // Grabs conference ID from URL for new presenters or presenter ID from URL for existing presenters
  // Uses URL to determine whether this is adding a session presenter or editing an existing presenter
  // If formType === new_session_pres, then urlId === confId
  // If formType === edit_presenter, then urlId === sessId
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
  // const fetchOneSess = async (sessId) => {
  //   // Edit existing session: GET session information
  //   return SessionAPI.getSessionById(sessId)
  //     .then(resp => {
  //       console.log("from presForm fetchOneSess", resp.data)
  //       latestSess = resp.data[0]
  //       setSession(latestSess);
  //       setSessReady(true);
  //       return latestSess;
  //     })
  //     .catch(err => {
  //       console.log(err)
  //       return false;
  //     })
  // }

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

  // GET conference information
  const fetchConf = async (id) => {
    switch (formType) {
      // Edit existing presenter
      // GETs conference info by presId
      case "edit_presenter":
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
      // New session
      default:
        // Use ID in URL to GET conference information
        await ConferenceAPI.getConferenceById(id)
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
  const handleInputChange = (data, dataset) => {
    const presData = data;
    const dataSet = dataset;
    console.log({ presData }, { dataSet });
    setPresenter(presData);
    console.log({ presenter });
  };

  // Sets textarea inputs in state
  const handleTextArea = (data, dataset) => {
    const presData = data;
    const dataSet = dataset;
    console.log({ presData }, { dataSet });
    setPresenter(presData);
    console.log({ presenter });
  }

  // Handles click on "Update" button
  const handleFormUpdate = (e) => {
    e.preventDefault();
    // Validates required inputs
    const validationErrors = presValidate(presenter[0]);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
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
    } else {
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
      const idx = presenter.indexOf(pres)
      console.log(idx);
      // Validates required inputs
      validationErrors = presValidate(pres);
      errors[idx] = validationErrors;
      const noErrors = Object.keys(validationErrors).length === 0;
      setErrors([ ...errors ], errors);
      if (noErrors) {
        // PUT call to update presenter document
        PresenterAPI.updatePresenterByEmail({ ...pres }, pres.presEmail, pres.confId)
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
      } else {
        console.log({ validationErrors });
        console.log({ errors });
      }
    })
    // .then(resp => {
    // If no errors thrown, push to Success page
    if (!valid && Object.keys(validationErrors).length === 0) {
      handleShowSuccess();
    } else if (!valid && Object.keys(validationErrors).length > 0) {
      return false;
    }
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
        case "edit_presenter":
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
              {(formType === "edit_presenter" || formType === "admin_edit_pres")
                ? <Button data-toggle="popover" title="Update" className="button" onClick={handleFormUpdate} type="submit">Update Form</Button>
                : <Button data-toggle="popover" title="Submit" className="button" onClick={handleFormSubmit} type="submit">Submit Form</Button>}
            </Col>
            <Col sm={2}>
              <Button data-toggle="popover" title="Go Back" className="button" onClick={() => history.goBack()} type="submit">Go Back</Button>
            </Col>
          </Row>
          {Object.keys(errors).length !== 0 &&
            <Row>
              <Col sm={12}>
                <div className="error"><p>The nanobots have detected an error or omission in one or more required fields. Please review this form.</p></div>
              </Col>
            </Row>}

          <PresenterFormCard presenter={presenter} session={session} conference={conference} errors={errors} handleChange={handleInputChange} handleText={handleTextArea} />

          {Object.keys(errors).length !== 0 &&
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

          <SuccessModal conference={conference} confname={conference.confName} urlid={urlId} urltype={formType} show={showSuccess} hide={e => handleHideSuccess(e)} />

          <ErrorModal conference={conference} confname={conference.confName} urlid={urlId} urltype={formType} errmsg={errThrown} show={showErr} hide={e => handleHideErr(e)} />

        </Container>}
    </>
  )
}

export default PresenterForm;