import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Card, Row, Col, Form } from "react-bootstrap";
import { ConferenceCard, UserCard, ExhibitorCard } from "../components/cards";
import { ConfirmModal, ErrorModal, SuccessModal } from "../components/modals";
import { Sidenav } from "../components/navbar";
import { AttendeeAPI, ConferenceAPI, ExhibitorAPI } from "../utils/api";
import { handleConfCancel, handleDeleteById, handleFetchOne, handleUnreg } from "../utils/functions";
import "./style.css";

const ConfExhibits = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const [conference, setConference] = useState([]);
  const [exhArray, setExhArray] = useState([]);
  const [searchBy, setSearchBy] = useState("allExh");
  const [search, setSearch] = useState("");
  const [errThrown, setErrThrown] = useState();
  const [btnName, setBtnName] = useState();
  const [thisId, setThisId] = useState();
  const [thisName, setThisName] = useState();
  const [confReady, setConfReady] = useState(false);
  const [exhReady, setExhReady] = useState(false);

  // Pull conference ID from URL
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

  // GETs conference by confId
  const fetchConf = async (confId) => {
    await ConferenceAPI.getConferenceById(confId)
      .then(resp => {
        console.log("confDetailsPage getConfsById", resp.data)
        const confObj = resp.data.slice(0)
        setConference(confObj)
      })
      .catch(err => {
        console.log(err)
        return false
      })

    setConfReady(true);
  }

  // GETs exhibitors by confId
  const fetchExh = async (confId) => {
    await ExhibitorAPI.getExhibitors(confId)
      .then(resp => {
        console.log("confExhibitors getExhibitors", resp.data)
        const exhArr = resp.data.slice(0)
        setExhArray(exhArr);
      })
      .catch(err => {
        console.log(err)
        return false
      })

    setExhReady(true);
  }

  // Filter response data by user input
  const searchFilter = (data) => {
    switch (searchBy) {
      // Filter by exhibitor company
      case "exhComp":
        return data.filter((exhibitor) => exhibitor.exhCompany.toLowerCase().indexOf(search.toLowerCase()) !== -1)
      // Return all response data
      default:
        return (exhArray)
    }
  }

  useEffect(() => {
    // GET conference by ID
    fetchConf(urlId);
    // GET exhibitors by conference ID
    fetchExh(urlId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlId])


  return (
    <>
      {confReady === true &&
        exhReady === true &&
        <Container>

          {!isAuthenticated &&
            <Row>
              <h1 className="regRemind">Please <Link to={window.location.origin} className="login" onClick={() => loginWithRedirect()}>log in</Link> to register for this conference.</h1>
            </Row>}

          <Row>
            {isAuthenticated
              ? <Col sm={4}>
                <UserCard />
              </Col>
              : <Col sm={2}></Col>}

            <Col sm={8}>
              <ConferenceCard conference={conference} setConference={setConference} setBtnName={setBtnName} setShowConfirm={setShowConfirm} setThisId={setThisId} setThisName={setThisName} />
            </Col>
          </Row>

          <Row>
            <Col sm={2} className="nomargin">
              <Sidenav conference={conference} showSuccess={showSuccess} setShowSuccess={setShowSuccess} />
            </Col>

            <Col sm={10}>
              <Row>
                <Col sm={4}>
                  <h1>Exhibit Hall</h1>
                </Col>
              </Row>

              <Row></Row>

              <Row>
                <Col sm={4}>
                  <h1>Exhibitors</h1>
                </Col>
                <Col sm={4}></Col>
                <Col sm={4}>
                  <Card.Body>
                    <Form inline>
                      <Row>
                        <Form.Group controlId="exhSearchBy">
                          <Form.Control as="select" name="searchBy" onChange={(e) => setSearchBy(e.target.value)}>
                            <option value="allExh">View All</option>
                            <option value="exhComp">Search by Company, Organization, or School Name</option>
                          </Form.Control>
                        </Form.Group>
                      </Row>
                      {searchBy === "exhComp" &&
                        <Row>
                          <div id="exhPageSearch">
                            <Form.Control type="input" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                          </div>
                        </Row>}
                    </Form>
                  </Card.Body>
                </Col>
              </Row>
              <Row className="wrap">
                {searchBy === "exhComp" &&
                  <>
                    {exhArray.length > 0
                      ? <ExhibitorCard exhibitor={searchFilter(exhArray)} conference={conference} showSuccess={showSuccess} setShowSuccess={setShowSuccess} />
                      : <h3>We can't seem to find any exhibitors for this conference based on your search criteria. If you think this is an error, please contact us.</h3>}
                  </>}
                {searchBy === "allExh" &&
                  <>
                    {exhArray.length > 0
                      ? <ExhibitorCard exhibitor={searchFilter(exhArray)} conference={conference} showSuccess={showSuccess} setShowSuccess={setShowSuccess} />
                      : <h3>We can't seem to find any exhibitors for this conference. If you think this is an error, please contact us.</h3>}
                  </>}
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

        </Container >
      }
    </>
  )

};

export default ConfExhibits;