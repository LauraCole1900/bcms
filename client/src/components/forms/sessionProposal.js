import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Form, Card, Row, Col, Button, Image } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { ConferenceAPI, SessionAPI } from "../../utils/api";
import "./style.css";

const SessionProposal = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const [session, setSession] = useState();
  const [conference, setConference] = useState();
  const [errThrown, setErrThrown] = useState();
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

  const fetchConf = async (confid) => {
    switch (formType) {
      // Edit existing proposal
      case "edit_sess_proposal":
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
    setSession({ ...session, [e.target.name]: e.target.value })
  };

  // Handles click on "Update" button
  const handleFormUpdate = (e) => {
    e.preventDefault();
    console.log("Session update", urlId);
    // PUT call to update session document
    SessionAPI.updateSession({ ...session }, urlId)
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
  };

  // Handles click on "Submit" button
  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Session submit", session)
    // POST call to create session document
    SessionAPI.saveSession({ ...session, confId: urlId })
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
          <h1 className="authRemind">Please <Link className="login" onClick={() => loginWithRedirect()}>
            log in
          </Link> to access the session proposal form.</h1>
          <div className="authLogo"><Image fluid="true" className="loadLogo" src="/images/bristlecone-dark.png" alt="BCMS logo" /></div>
        </Row>}

        {isAuthenticated &&
        sessReady === true &&
        confReady === true &&
        <Container>
          <Form className="sessPropForm">

            <Card className="formCard">
              <Card.Title><h1>Presenter Information</h1></Card.Title>

              <Card.Body className="cardBody">
                <Row>
                  
                </Row>
              </Card.Body>
            </Card>

          </Form>
        </Container>}
    </>
  )
}

export default SessionProposal;