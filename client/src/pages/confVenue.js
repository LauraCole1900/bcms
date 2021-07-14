import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Row, Col } from "react-bootstrap";
import { ConferenceCard, UserCard } from "../components/cards";
import { Sidenav } from "../components/navbar";
import { ConfirmModal, ErrorModal, SuccessModal } from "../components/modals";
import { AttendeeAPI, ConferenceAPI, ExhibitorAPI } from "../utils/api";
import { handleConfCancel, handleDeleteById, handleFetchOne, handleUnreg } from "../utils/functions";
import "./style.css";

const Venue = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const [conference, setConference] = useState();
  const [errThrown, setErrThrown] = useState();
  const [btnName, setBtnName] = useState();
  const [thisId, setThisId] = useState();
  const [thisName, setThisName] = useState();
  const [confReady, setConfReady] = useState(false);

  // Grabs conference ID from URL
  const urlArray = window.location.href.split("/")
  const urlId = urlArray[urlArray.length - 1]
  const urlType = urlArray[urlArray.length - 2]

  // Modal variables
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showErr, setShowErr] = useState(false);

  // Sets boolean to show or hide relevant modal
  const handleHideConfirm = () => setShowConfirm(false);
  const handleShowSuccess = () => setShowSuccess(true);
  const handleHideSuccess = () => setShowSuccess(false);
  const handleShowErr = () => setShowErr(true);
  const handleHideErr = () => setShowErr(false);

  useEffect(() => {
    handleFetchOne(ConferenceAPI.getConferenceById, urlId, setConference)
      .then(resp => {
        setConfReady(true);
      })

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
              <ConferenceCard
                conference={conference}
                setConference={setConference}
                setBtnName={setBtnName}
                setShowConfirm={setShowConfirm}
                setThisId={setThisId}
                setThisName={setThisName}
              />
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

          <ConfirmModal
            btnname={btnName}
            confname={thisName}
            urlid={urlId}
            cancelconf={() => handleConfCancel(
              AttendeeAPI.getAttendees,
              ExhibitorAPI.getExhibitors,
              thisId,
              conference,
              handleHideConfirm,
              handleShowSuccess,
              setErrThrown,
              handleShowErr
            )}
            unregatt={() => handleUnreg(
              AttendeeAPI.unregisterAttendee,
              thisId,
              user.email,
              handleHideConfirm,
              handleShowSuccess,
              setErrThrown,
              handleShowErr
            )}
            unregexh={() => handleUnreg(
              ExhibitorAPI.deleteExhibitor,
              thisId,
              user.email,
              handleHideConfirm,
              handleShowSuccess,
              setErrThrown,
              handleShowErr
            )}
            show={showConfirm === true}
            hide={() => handleHideConfirm()}
          />

          <SuccessModal
            conference={conference}
            confname={thisName}
            confid={thisId}
            urlid={urlId}
            urltype={urlType}
            btnname={btnName}
            show={showSuccess === true}
            hide={() => handleHideSuccess()}
          />

          <ErrorModal
            conference={conference}
            urlid={urlId}
            urltype={urlType}
            errmsg={errThrown}
            btnname={btnName}
            show={showErr === true}
            hide={() => handleHideErr()}
          />

        </Container>}
    </>
  )

}

export default Venue;