import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Row, Col } from "react-bootstrap";
import { ConferenceCard, UserCard } from "../cards";
import { Sidenav } from "../navbar";
import { ConferenceAPI, SessionAPI } from "../../utils/api";
import "./style.css";

const Venue = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const [conference, setConference] = useState();
  const [showSuccess, setShowSuccess] = useState(0);
  const [confReady, setConfReady] = useState(false);

  // Grabs conference ID from URL
  const urlArray = window.location.href.split("/")
  const urlId = urlArray[urlArray.length - 1]
  const urlType = urlArray[urlArray.length - 2]

  const fetchConf = async (id) => {
    return ConferenceAPI.getConferenceById(id)
      .then(resp => {
        console.log("from confSched fetchConf", resp.data)
        const confObj = resp.data;
        setConference(confObj)
        setConfReady(true);
        return confObj;
      })
      .catch(err => {
        console.log(err)
        return false
      })
  }

  useEffect(() => {
    fetchConf(urlId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSuccess])


  return (
    <>
      {confReady === true &&
        <Container>
          <Row>

            {!isAuthenticated &&
              <Row>
                <h1 className="regRemind">Please <Link to={window.location.origin} className="login" onClick={() => loginWithRedirect()}>log in</Link> to register for this conference.</h1>
              </Row>}

            {isAuthenticated
              ? <Col sm={4}>
                <UserCard />
              </Col>
              : <Col sm={2}></Col>}

            <Col sm={8}>
              <ConferenceCard conference={conference} showSuccess={showSuccess} setShowSuccess={setShowSuccess} />
            </Col>
          </Row>

          <Row>
            <Col sm={2} className="nomargin">
              <Sidenav conference={conference} showSuccess={showSuccess} setShowSuccess={setShowSuccess} />
            </Col>

            <Col sm={10}>
              <Row>
                <h1 className="center">Map of Conference Venue</h1>
              </Row>

              <Row></Row>

              <Row>
                <h1 className="center">Map of Exhibitor Hall</h1>
              </Row>
            </Col>

          </Row>
        </Container>}
    </>
  )

}

export default Venue;