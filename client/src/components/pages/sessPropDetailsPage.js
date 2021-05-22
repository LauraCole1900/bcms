import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Row, Col, Card, Image } from "react-bootstrap";
import { ConferenceAPI, PresenterAPI, SessionAPI } from "../../utils/api";
import { ConferenceCard } from "../cards"
import "./style.css"

const SessPropDetails = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const [conference, setConference] = useState();
  const [session, setSession] = useState();
  const [confReady, setConfReady] = useState(false);
  const [sessReady, setSessReady] = useState(false);

  // Pull session ID from URL
  const urlArray = window.location.href.split("/")
  const sessId = urlArray[urlArray.length - 1]

  const fetchConf = async (id) => {
    await ConferenceAPI.getConferenceById(id)
    .then(resp => {
      console.log("sessPropDetailsPage fetchConf", resp.data)
      const confObj = resp.data.slice(0)
      setConference(confObj)
    })
    .catch(err => {
      console.log(err)
      return false
    })
    setConfReady(true)
  }

  const fetchSess = async (id) => {
    await SessionAPI.getSessionById(id)
    .then(resp => {
      console.log("sessPropDetailsPage fetchSess", resp.data)
      const sessObj = resp.data.slice(0)
      setSession(sessObj)
    })
    .catch(err => {
      console.log(err)
      return false
    })
    setSessReady(true)
  }

  useEffect(() => {
    // GET session by ID
    fetchSess(sessId);
    // GET conference by session.confId
    fetchConf(session.confId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
    <>
      {!isAuthenticated &&
        <Row>
          <h1 className="authRemind">Please <Link className="login" onClick={() => loginWithRedirect()}>
            log in
          </Link> to access session proposals.</h1>
          <div className="authLogo"><Image fluid="true" className="loadLogo" src="/images/bristlecone-dark.png" alt="BCMS logo" /></div>
        </Row>}

      {isAuthenticated &&
        sessReady === true &&
        confReady === true &&
        <Container>

          <ConferenceCard conference={conference} />

        </Container>}
    </>
  )

}

export default SessPropDetails;