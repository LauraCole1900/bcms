import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { firstBy } from "thenby";
import { Container, Row, Col, Form, Card, Button, ButtonGroup } from "react-bootstrap";
import { ConferenceCard, PresenterCard, SessionCard, UserCard } from "../cards"
import { ConferenceAPI, PresenterAPI, SessionAPI } from "../../utils/api";
import "./style.css";

const ConfDetails = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const location = useLocation();
  const [conference, setConference] = useState([]);
  const [sessArray, setSessArray] = useState([]);
  const [presArray, setPresArray] = useState([]);
  const [searchBy, setSearchBy] = useState("allPnS");
  const [search, setSearch] = useState("");
  const [confReady, setConfReady] = useState(false);
  const [sessReady, setSessReady] = useState(false);
  const [presReady, setPresReady] = useState(false);

  // Pull conference ID from URL
  const urlArray = window.location.href.split("/")
  const confId = urlArray[urlArray.length - 1]

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

  // ---------- Figure out how to render presenters only once, even when presenting multiple sessions!!!!! ----------
  // GETs sessions by confId
  const fetchSess = async (confId) => {
    await SessionAPI.getSessions(confId)
      .then(resp => {
        console.log("confDetailsPage getSessions", resp.data)
        const sessArr = resp.data.slice(0)
        // Sort sessions by date
        const sortedSess = sessArr.sort(
          firstBy("sessKeynote", "desc")
            .thenBy("sessDate")
            .thenBy("sessStart")
        );
        setSessArray(sortedSess);
      })
      .catch(err => {
        console.log(err)
        return false
      })

    setSessReady(true);
  }

  // GETs presenters by confId
  const fetchPres = async (confId) => {
    await PresenterAPI.getPresentersByConf(confId)
    .then(resp => {
      console.log("confDetailsPage getPresentersByConf", resp.data)
      const presArr = resp.data.slice(0)
      setPresArray(presArr)
    })
    .catch(err => {
      console.log(err)
      return false
    })

    setPresReady(true)
  }

  // Filter response data by user input
  const searchFilter = (data) => {
    switch (searchBy) {
      // Filter session names
      case "sessionName":
        return data.filter((session) => session.sessName.toLowerCase().indexOf(search.toLowerCase()) !== -1)
      // Filter presenter names
      case "presenterName":
        return data.filter((session) => session.sessPresenter.find(pres => pres.toLowerCase().includes(search.toLowerCase())))
      // Filter presenter organization
      case "presenterOrg":
        return data.filter((session) => session.sessPresenterOrg.find(presOrg => presOrg.toLowerCase().includes(search.toLowerCase())))
      // Return all response data
      default:
        return (sessArray)
    }
  }

  useEffect(() => {
    // GET conference by ID
    fetchConf(confId);
    // GET sessions by conference ID
    fetchSess(confId);
    // GET presenters by conferenceID
    fetchPres(confId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confId])


  return (
    <>
      {confReady === true &&
        sessReady === true &&
        presReady === true &&
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
                    <Form.Group controlId="sessSearchBy">
                      <Form.Control as="select" name="searchBy" onChange={(e) => setSearchBy(e.target.value)}>
                        <option value="allPnS">View All</option>
                        <option value="allPres">View Presenters</option>
                        <option value="allSess">View Sessions</option>
                        <option value="presenterName">Search by Presenter Name</option>
                        <option value="presenterOrg">Search by Presenter Organization</option>
                        <option value="sessionName">Search Sessions by Name</option>
                      </Form.Control>
                    </Form.Group>
                  </Row>
                  {(searchBy === "presenterName" || searchBy === "presenterOrg" || searchBy === "sessionName") &&
                    <Row>
                      <div id="sessPageSearch">
                        <Form.Control type="input" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
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
                </Link> to register.</h1>
            </Row>}

          <Row>
            <Col sm={12}>
              <ConferenceCard conference={conference} />
            </Col>
          </Row>

          <Row>
            <Col sm={2}>
              <ButtonGroup data-toggle="popover">
                <Link to={`/schedule/${confId}`} className={location.pathname === `/schedule/${confId}` ? "link active" : "link"}>
                  <Button title="View schedule" className="button">Schedule</Button>
                </Link>
                <Link to={`/venue/${confId}`} className={location.pathname === `/venue/${confId}` ? "link active" : "link"}>
                  <Button title="Venue information" className="button">Venue</Button>
                </Link>
                <Link to={`/exhibits/${confId}`} className={location.pathname === `/exhibits/${confId}` ? "link active" : "link"}>
                  <Button title="Exhibit information" className="button">Exhibits</Button>
                </Link>
                {conference[0].confSessProposalConfirm === "yes" &&
                  <Link to={`/propose_session/${confId}`} className={location.pathname === `/propose_session/${confId}` ? "link active" : "link"}>
                    <Button title="Session proposal form" className="button">Session proposal form</Button>
                  </Link>}
              </ButtonGroup>
            </Col>
            <Col sm={1}></Col>
            {isAuthenticated &&
              (user.email === conference[0].ownerEmail || conference[0].confAdmins.includes(user.email)) &&
              <>
                <Col sm={4}>
                  <ButtonGroup data-toggle="popover">
                    <Link to={`/attendees/${confId}`} className={location.pathname === `/attendees/${confId}` ? "link active" : "link"}>
                      <Button title="View conference attendees" className="button">Attendees</Button>
                    </Link>
                    <Link to={`/exhibitors/${confId}`} className={location.pathname === `/exhibitors/${confId}` ? "link active" : "link"}>
                      <Button title="View conference exhibitors" className="button">Exhibitors</Button>
                    </Link>
                    <Link to={`/presenters/${confId}`} className={location.pathname === `/presenters/${confId}` ? "link active" : "link"}>
                      <Button title="View conference presenters" className="button">Presenters</Button>
                    </Link>
                  </ButtonGroup>
                </Col>
                <Col sm={1}></Col>
                <Col sm={4}>
                  <ButtonGroup data-toggle="popover">
                    <Link to={`/edit_conference/${confId}`} className={location.pathname === `/edit_conference/${confId}` ? "link active" : "link"}>
                      <Button data-toggle="popover" title="Edit this conference" className="button">Edit Conference</Button>
                    </Link>
                    <Link to={`/edit_schedule/${confId}`} className={location.pathname === `/edit_schedule/${confId}` ? "link active" : "link"}>
                      <Button data-toggle="popover" title="Edit conference schedule" className="button">Edit Schedule</Button>
                    </Link>
                    <Link to={`/new_session/${confId}`} className={location.pathname === `/new_session/${confId}` ? "link active" : "link"}>
                      <Button data-toggle="popover" title="Add a session" className="button">Add Session</Button>
                    </Link>
                  </ButtonGroup>
                </Col>
              </>}
          </Row>

          <Row>
            {searchBy === "allPres" &&
              <Col sm={12}>
                <h1>Presenters</h1>
                {sessArray.length > 0
                  ? <PresenterCard presenter={searchFilter(presArray)} conference={conference} />
                  : <h3>We can't seem to find any presenters for this conference. If you think this is an error, please contact us.</h3>}
              </Col>}
            {(searchBy === "allSess" || searchBy === "sessionName") &&
              <Col sm={12}>
                <h1>Sessions</h1>
                {sessArray.length > 0
                  ? <SessionCard session={searchFilter(sessArray)} conference={conference} />
                  : <h3>We can't seem to find any sessions for this conference. If you think this is an error, please contact us.</h3>}
              </Col>}
            {(searchBy === "allPnS" || searchBy === "presenterName" || searchBy === "presenterOrg") &&
              <div>
                <Col sm={6}>
                  <h1>Presenters</h1>
                  {sessArray.length > 0
                    ? <PresenterCard presenter={searchFilter(presArray)} conference={conference} />
                    : <h3>We can't seem to find any presenters for this conference. If you think this is an error, please contact us.</h3>}
                </Col>
                <Col sm={6}>
                  <h1>Sessions</h1>
                  {sessArray.length > 0
                    ? <SessionCard session={searchFilter(sessArray)} conference={conference} />
                    : <h3>We can't seem to find any sessions for this conference. If you think this is an error, please contact us.</h3>}
                </Col>
              </div>}
          </Row>

        </Container >
      }
    </>
  )

}

export default ConfDetails;