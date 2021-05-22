import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Row, Col, Card, Image } from "react-bootstrap";
import { ConferenceCard, SessionCard } from "../cards";
import { ConferenceAPI, SessionAPI } from "../../utils/api";
import "./style.css";

const AllSessProps = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const [conference, setConference] = useState();
  const [sessArray, setSessArray] = useState([]);
  const [confReady, setConfReady] = useState(false);
  const [sessReady, setSessReady] = useState(false);

  // Pull conference ID from URL
  const urlArray = window.location.href.split("/")
  const confId = urlArray[urlArray.length - 1]

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

  const fetchSess = async (id) => {
    await SessionAPI.getSessions(id)
      .then(resp => {
        console.log("sessProposals fetchSess", resp.data)
        const sessArr = resp.data.slice(0);
        // Filter sessions by acceptance status
        const filteredSess = sessArr.filter(sess => sess.sessAccepted === "no")
        setSessArray(filteredSess)
      })
      .catch(err => {
        console.log(err);
        return false
      })
    setSessReady(true)
  }

  useEffect(() => {
    fetchConf(confId);
    fetchSess(confId);

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

          <Row>
            <Col sm={12}>
              <h1>Proposed Sessions for {conference.confName}</h1>
            </Col>
          </Row>

          <Row>
            {sessArray.length > 0
              ? <SessionCard session={sessArray} conference={conference} />
              : <h3>We can't seem to find any proposed sessions for this conference. If you think this is an error, please contact us.</h3>}
          </Row>

        </Container>}
    </>
  )

}

export default AllSessProps;