import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Row, Col, Image } from "react-bootstrap";
import { ConferenceCard, SessPropSummaryCard } from "../components/cards";
import { Sidenav } from "../components/navbar";
import { ConferenceAPI, PresenterAPI, SessionAPI } from "../utils/api";
import "./style.css";

const AllSessProps = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const [conference, setConference] = useState();
  const [presArray, setPresArray] = useState([]);
  const [sessArray, setSessArray] = useState([]);
  const [showSuccess, setShowSuccess] = useState(0);
  const [confReady, setConfReady] = useState(false);
  const [presReady, setPresReady] = useState(false);
  const [sessReady, setSessReady] = useState(false);

  // Pull conference ID from URL
  const urlArray = window.location.href.split("/")
  const confId = urlArray[urlArray.length - 1];
  const urlType = urlArray[urlArray.length - 2];

  const fetchConf = async (id) => {
    await ConferenceAPI.getConferenceById(id)
      .then(resp => {
        console.log("sessProposals fetchConf", resp.data)
        const confObj = resp.data.slice(0);
        setConference(confObj)
      })
      .catch(err => {
        console.log(err);
        return false
      })
    setConfReady(true)
  }

  const fetchPres = async (id) => {
    await PresenterAPI.getPresentersByConf(id)
      .then(resp => {
        console.log("sessProposals fetchPres", resp.data)
        const presArr = resp.data.slice(0);
        // Filter presenters by acceptance status
        const filteredPres = presArr.filter(pres => pres.presAccepted === "no")
        setPresArray(filteredPres)
      })
      .catch(err => {
        console.log(err);
        return false
      })
    setPresReady(true)
  }

  const fetchSess = async (id) => {
    await SessionAPI.getSessions(id)
      .then(resp => {
        console.log("sessProposals fetchSess", resp.data)
        const sessArr = resp.data.slice(0);
        // Filter sessions by acceptance status
        const filteredSess = sessArr.filter(sess => sess.sessAccepted === "no")
        setSessArray(filteredSess);
        console.log({ filteredSess });
      })
      .catch(err => {
        console.log(err);
        return false
      })
    setSessReady(true);
  }

  useEffect(() => {
    fetchConf(confId);
    fetchPres(confId);
    fetchSess(confId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
    <>
      {!isAuthenticated &&
        <Row>
          <h1 className="regRemind">Please <Link className="login" onClick={() => loginWithRedirect()}>log in</Link> to access session proposals.</h1>
          <div className="authLogo"><Image fluid="true" className="loadLogo" src="/images/bristlecone-dark.png" alt="BCMS logo" /></div>
        </Row>}

      {isAuthenticated &&
        confReady === true &&
        sessReady === true &&
        presReady === true &&
        <Container>

          <ConferenceCard conference={conference} showSuccess={showSuccess} setShowSuccess={setShowSuccess} />

          <Row>
            <Col sm={2} className="nomargin">
              <Sidenav conference={conference} showSuccess={showSuccess} setShowSuccess={setShowSuccess} />
            </Col>

            <Col sm={10}>
              <Row>
                <h1 className="center">Proposed Sessions for {conference[0].confName}</h1>
              </Row>

              <Row className="wrap">
                {sessArray.length > 0
                  ? <SessPropSummaryCard session={sessArray} conference={conference} presenter={presArray} urlType={urlType} showSuccess={showSuccess} setShowSuccess={setShowSuccess} />
                  : <h3>We can't seem to find any proposed sessions for this conference. If you think this is an error, please contact us.</h3>}
              </Row>
            </Col>

          </Row>

        </Container>}
    </>
  )

}

export default AllSessProps;