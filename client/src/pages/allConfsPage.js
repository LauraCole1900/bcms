import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Card, Row, Col, Form } from "react-bootstrap";
import { ConferenceCard, UserCard } from "../components/cards";
import { ConfirmModal, ErrorModal, SuccessModal } from "../components/modals";
import { AttendeeAPI, ConferenceAPI, ExhibitorAPI } from "../utils/api";
import { handleConfCancel, handleUnreg } from "../utils/functions";
import "./style.css";

const AllConfs = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const [conference, setConference] = useState();
  const [confArray, setConfArray] = useState([]);
  const [searchBy, setSearchBy] = useState("all");
  const [search, setSearch] = useState("");
  const [errThrown, setErrThrown] = useState();
  const [btnName, setBtnName] = useState();
  const [thisId, setThisId] = useState();
  const [thisName, setThisName] = useState();
  const [pageReady, setPageReady] = useState(false);

  // Determines which page user is on, specifically for use with URLs that include the conference ID
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

  // Filter conferences by user input
  const searchFilter = (data) => {
    switch (searchBy) {
      // Filter by conference name
      case "name":
        return data.filter((conference) => conference.confName.toLowerCase().indexOf(search.toLowerCase()) !== -1)
      // Filter by presenting organization
      case "org":
        return data.filter((conference) => conference.confOrg.toLowerCase().indexOf(search.toLowerCase()) !== -1)
      // Return all conferences
      default:
        return (confArray)
    }
  }

  useEffect(() => {
    // GET conferences
    ConferenceAPI.getConferences()
      .then(resp => {
        const confArr = resp.data;
        // Filter conferences by date, so only current & upcoming conferences render
        const filteredConf = confArr.filter(a => new Date(a.endDate) - new Date() >= 0);
        // Sort filtered conferences by date, earliest to latest
        const sortedConf = filteredConf.sort((a, b) => (a.startDate > b.startDate) ? 1 : -1);
        // Set conferences in state
        setConfArray(sortedConf);
        // Set pageReady to true for page render
        setPageReady(true);
      })
      .catch(err => console.log(err))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSuccess])


  return (
    <>
      {pageReady === true && (
        <div className="mt-4">
          <Container>
            <Row>
              <Col sm={8}>
                {isAuthenticated &&
                  <UserCard />}
              </Col>
              <Col sm={4}>
                <Card.Body>
                  <Form inline>
                    <Row>
                      <Form.Group controlId="confSearchBy">
                        <Form.Control as="select" name="searchBy" onChange={(e) => setSearchBy(e.target.value)}>
                          <option value="all">View All Conferences</option>
                          <option value="name">Search by Conference Name</option>
                          <option value="org">Search by Organization</option>
                        </Form.Control>
                      </Form.Group>
                    </Row>
                    {(searchBy !== "all") &&
                      <Row>
                        <div id="confPageSearch">
                          <Form.Control type="input" placeholder="Search conferences" value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                      </Row>}
                  </Form>
                </Card.Body>
              </Col>
            </Row>

            {!isAuthenticated &&
              <Row>
                <h1 className="regRemind">Please <Link to={window.location.origin} className="login" onClick={() => loginWithRedirect()}>
                  log in
                </Link> to register for any conference.</h1>
              </Row>}

            <Row>
              {confArray.length > 0
                ? <ConferenceCard conference={searchFilter(confArray)} setConference={setConference} setBtnName={setBtnName} setShowConfirm={setShowConfirm} setThisId={setThisId} setThisName={setThisName} />
                : <h3>We can't seem to find any upcoming conferences. If you think this is an error, please contact us.</h3>}
            </Row>

            {/* Information I need to lift:
            Button name
            Conference object
            Card object if different (session, etc.)
            */}

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

          </Container>
        </div>
      )}
    </>
  )
}

export default AllConfs;