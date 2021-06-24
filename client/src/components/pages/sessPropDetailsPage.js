import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Row, Col, Card, Image } from "react-bootstrap";
import { ConferenceAPI, PresenterAPI, SessionAPI } from "../../utils/api";
import { ConferenceCard } from "../cards";
import { Sidenav } from "../navbar";
import "./style.css"

const SessPropDetails = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const [conference, setConference] = useState();
  const [session, setSession] = useState();
  const [presArray, setPresArray] = useState();
  const [showSuccess, setShowSuccess] = useState(0);
  const [confReady, setConfReady] = useState(false);
  const [presReady, setPresReady] = useState(false);
  const [sessReady, setSessReady] = useState(false);

  // Pull session ID from URL
  const urlArray = window.location.href.split("/")
  const sessId = urlArray[urlArray.length - 1]
  const urlType = urlArray[urlArray.length - 2]

  const fetchConf = async (id) => {
    await ConferenceAPI.getConferenceById(id)
      .then(resp => {
        console.log("sessPropDetailsPage fetchConf", resp.data)
        const confObj = resp.data.slice(0)
        console.log({ confObj });
        setConference(confObj)
      })
      .catch(err => {
        console.log(err)
        return false
      })
    setConfReady(true)
  }

  const fetchPres = async (email, id) => {
    let presObj;
    return await PresenterAPI.getPresenterByEmail(email, id)
      .then(resp => {
        console.log("sessPropDetailsPage fetchPres", resp.data)
        presObj = resp.data
        console.log({ presObj })
        return presObj;
      })
      .catch(err => {
        console.log(err)
        return false
      })
  }

  const fetchSess = async (id) => {
    let sessObj;
    let presArr = [];
    await SessionAPI.getSessionById(id)
      .then(resp => {
        console.log("sessPropDetailsPage fetchSess", resp.data)
        sessObj = resp.data.slice(0)
        console.log({ sessObj });
        setSession(sessObj)
        return sessObj;
      })
      .catch(err => {
        console.log(err)
        return false
      })
    // GET conference by session.confId
    fetchConf(sessObj[0].confId)
    sessObj[0].sessPresEmails.forEach(email => {
      fetchPres(email, sessObj[0].confId)
      .then(resp => {
        console.log(resp.data)
        presArr = [...presArr, resp.data]
        console.log({ presArr })
        if (presArr.length === sessObj[0].sessPresEmails.length) {
          setPresArray(presArr);
          setPresReady(true);
        }
      })
      .catch(err => {
        console.log(err);
      })
    })
    setSessReady(true)
  }

  useEffect(() => {
    // GET session by ID
    fetchSess(sessId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSuccess])


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
        presReady === true &&
        confReady === true &&
        <Container>

          <ConferenceCard conference={conference} showSuccess={showSuccess} setShowSuccess={setShowSuccess} />

          <Row>
            <Col sm={2}>
              <Sidenav conference={conference} />
            </Col>

            <Col sm={10}>
              <Row>
                <h1 className="center">Details for {session[0].sessName} Proposal</h1>
                <h3>Presenters:
                  {presArray.map(pres => (
                    <p>{pres.presGivenName} {pres.presFamilyName}</p>
                  ))}
                </h3>
              </Row>


            </Col>
          </Row>

        </Container>}
    </>
  )

}

export default SessPropDetails;