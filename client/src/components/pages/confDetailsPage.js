import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { firstBy } from "thenby";
import { Container, Row, Col, Form, Card, Button } from "react-bootstrap";
import { ConferenceCard, PresenterCard, SessionCard, UserCard } from "../cards"
import { ConferenceAPI, PresenterAPI, SessionAPI } from "../../utils/api";
import "./style.css";

const ConfDetails = () => {
  
  // TO DO
  // Filter sessions by presenter name
  // Filter sessions by organization
  
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const location = useLocation();
  const [conference, setConference] = useState([]);
  const [sessArray, setSessArray] = useState([]);
  const [presArray, setPresArray] = useState([]);
  const [searchBy, setSearchBy] = useState("allPnS");
  const [search, setSearch] = useState("");
  const [changeToggle, setChangeToggle] = useState(false);
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

  // GETs sessions by confId
  const fetchSess = async (confId) => {
    await SessionAPI.getSessions(confId)
      .then(resp => {
        console.log("confDetailsPage getSessions", resp.data)
        const sessArr = resp.data.slice(0)
        // Filter sessions by acceptance status
        const filteredSess = sessArr.filter(sess => sess.sessAccepted === "yes")
        // Sort sessions by date
        const sortedSess = filteredSess.sort(
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
        // Filter presenters by acceptance status
        const filteredPres = presArr.filter(pres => pres.presAccepted === "yes")
        // Sort presenters by last name
        const sortedPres = filteredPres.sort(
          firstBy("presKeynote", "desc")
            .thenBy("presFamilyName")
            .thenBy("presGivenName")
        );
        setPresArray(sortedPres);
      })
      .catch(err => {
        console.log(err)
        return false
      })

    setPresReady(true)
  }

  // Filter session data by user input
  const searchSess = (data) => {
    switch (searchBy) {
      // Filter session names
      case "sessionName":
        return data.filter((session) => session.sessName.toLowerCase().indexOf(search.toLowerCase()) !== -1)
      // Return all response data
      default:
        return sessArray
    }
  }

  // Filter presenter data by user input
  const searchPres = (data) => {
    switch (searchBy) {
      // Filter presenter names
      case "presenterName":
        return data.filter((presenter) => presenter.presFamilyName.toLowerCase().indexOf(search.toLowerCase()) !== -1)
      // Filter presenter organization
      case "presenterOrg":
        return data.filter((presenter) => presenter.presOrg.toLowerCase().indexOf(search.toLowerCase()) !== -1)
      // Return all response data
      default:
        return presArray
    }
  }

  // Filter sessions by presenter name or presenter org
  const searchSessPres = (data) => {
    switch (searchBy) {
      case "sessionPresenter":
        let sessArr = [];
        const pres = searchPres(data);
        pres?.presSessionIds?.forEach(id => {
          let session = sessArray.map(sess => sess._id === id)
          sessArr = [...sessArr, session]
          if (sessArr.length === pres.presSessionIds.length) {
            setSessArray(sessArr);
          }
        })
        break;
      case "sessionOrg":
        break;
      default:
        return sessArray;
    }
  }

  const handleToggle = () => {
    switch (changeToggle) {
      case true:
        setChangeToggle(false);
        break;
      default:
        setChangeToggle(true);
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
  }, [changeToggle, confId])


  return (
    <>
      {confReady === true &&
        sessReady === true &&
        presReady === true &&
        <Container>

          {!isAuthenticated &&
            <Row>
              <h1 className="regRemind">Please <Link to={window.location.origin} className="login" onClick={() => loginWithRedirect()}>log in</Link> to register.</h1>
            </Row>}

          <Row>
            {isAuthenticated
              ? <Col sm={4}>
                <UserCard />
              </Col>
              : <Col sm={2}></Col>}

            <Col sm={8}>
              <ConferenceCard conference={conference} change={handleToggle} />
            </Col>
          </Row>

          <Row>
            <Col sm={2} className="center outline">
              <Row><h3 className="textTight">Navigation</h3></Row>
              <Row>
                <Link to={`/schedule/${confId}`} className={location.pathname === `/schedule/${confId}` ? "link active" : "link"}>
                  <Button data-toggle="popover" title="View schedule" className="sideButton">Schedule</Button>
                </Link>
              </Row>
              <Row>
                <Link to={`/venue/${confId}`} className={location.pathname === `/venue/${confId}` ? "link active" : "link"}>
                  <Button data-toggle="popover" title="Venue information" className="sideButton">Venue</Button>
                </Link>
              </Row>
              <Row>
                <Link to={`/exhibits/${confId}`} className={location.pathname === `/exhibits/${confId}` ? "link active" : "link"}>
                  <Button data-toggle="popover" title="Exhibit information" className="sideButton">Exhibits</Button>
                </Link>
              </Row>
              {conference.confSessProposalConfirm === "yes" &&
                <Row>
                  <Link to={`/propose_session/${confId}`} className={location.pathname === `/propose_session/${confId}` ? "link active" : "link"}>
                    <Button data-toggle="popover" title="Session proposal form" className="sideButton">Session proposal form</Button>
                  </Link>
                </Row>}
              {isAuthenticated && conference[0].confSessProposalCommittee.includes(user.email) &&
                <Row>
                  <Link to={`/session_proposals/${confId}`} className={location.pathname === `/session_proposal/${confId}` ? "link active" : "link"}>
                    <Button data-toggle="popover" title="View Session Proposals" className="committeeButton">View Session Proposals</Button>
                  </Link>
                </Row>}
              {isAuthenticated &&
                (user.email === conference[0].ownerEmail || conference[0].confAdmins.includes(user.email)) &&
                <>
                  <Row>
                    <Link to={`/attendees/${confId}`} className={location.pathname === `/attendees/${confId}` ? "link active" : "link"}>
                      <Button data-toggle="popover" title="View conference attendees" className="adminButton">View Attendees</Button>
                    </Link>
                  </Row>
                  <Row>
                    <Link to={`/exhibitors/${confId}`} className={location.pathname === `/exhibitors/${confId}` ? "link active" : "link"}>
                      <Button data-toggle="popover" title="View conference exhibitors" className="adminButton">View Exhibitors</Button>
                    </Link>
                  </Row>
                  <Row>
                    <Link to={`/presenters/${confId}`} className={location.pathname === `/presenters/${confId}` ? "link active" : "link"}>
                      <Button data-toggle="popover" title="View conference presenters" className="adminButton">View Presenters</Button>
                    </Link>
                  </Row>
                  <Row>
                    <Link to={`/edit_conference/${confId}`} className={location.pathname === `/edit_conference/${confId}` ? "link active" : "link"}>
                      <Button data-toggle="popover" title="Edit this conference" className="adminButton">Edit Conference</Button>
                    </Link>
                  </Row>
                  <Row>
                    <Link to={`/edit_schedule/${confId}`} className={location.pathname === `/edit_schedule/${confId}` ? "link active" : "link"}>
                      <Button data-toggle="popover" title="Edit conference schedule" className="adminButton">Edit Schedule</Button>
                    </Link>
                  </Row>
                  <Row>
                    <Link to={`/new_session/${confId}`} className={location.pathname === `/new_session/${confId}` ? "link active" : "link"}>
                      <Button data-toggle="popover" title="Add a session" className="adminButton">Add Session</Button>
                    </Link>
                  </Row>
                  <Row>
                    <Link to={`/admin_register_att/${confId}`} className={location.pathname === `/admin_register_att/${confId}` ? "link active" : "link"}>
                      <Button data-toggle="popover" title="Add attendee" className="adminButton">Add Attendee</Button>
                    </Link>
                  </Row>
                  <Row>
                    <Link to={`/admin_register_exh/${confId}`} className={location.pathname === `/admin_register_exh/${confId}` ? "link active" : "link"}>
                      <Button data-toggle="popover" title="Add attendee" className="adminButton">Add Exhibit</Button>
                    </Link>
                  </Row>
                </>}
            </Col>

            <Col sm={10}>
              <Row>
                <Col sm={3} className="formPad">
                  <Card.Body>
                    <Form inline>
                      <Row>
                        <Form.Group controlId="sessSearchBy">
                          <Form.Control as="select" name="searchBy" onChange={(e) => setSearchBy(e.target.value)}>
                            <option value="allPnS">View All</option>
                            <option value="allPres">View Presenters</option>
                            <option value="allSess">View Sessions</option>
                            <option value="presenterName">Search by Presenter's Last Name</option>
                            <option value="presenterOrg">Search by Presenter Organization</option>
                            <option value="sessionName">Search Sessions by Name</option>
                            <option value="sessionPresenter">Search Sessions by Presenter's Last Name</option>
                            <option value="sessionOrg">Search Sessions by Organization</option>
                          </Form.Control>
                        </Form.Group>
                      </Row>
                      {(searchBy === "presenterName" || searchBy === "presenterOrg" || searchBy === "sessionName" || searchBy === "sessionPresenter" || searchBy === "sessionOrg") &&
                        <Row>
                          <div id="sessPageSearch">
                            <Form.Control type="input" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                          </div>
                        </Row>}
                    </Form>
                  </Card.Body>
                </Col>
              </Row>

              <Row>
                {(searchBy === "allPres" || searchBy === "presenterName" || searchBy === "presenterOrg") &&
                  <Col sm={12}>
                    <h1>Presenters</h1>
                    {presArray.length > 0
                      ? <PresenterCard presenter={searchPres(presArray)} conference={conference} change={handleToggle} />
                      : <h3>We can't seem to find any presenters for this conference. If you think this is an error, please contact us.</h3>}
                  </Col>}
                {(searchBy === "allSess" || searchBy === "sessionName") &&
                  <Col sm={12}>
                    <h1>Sessions</h1>
                    {sessArray.length > 0
                      ? <SessionCard session={searchSess(sessArray)} presenter={presArray} conference={conference} change={handleToggle} />
                      : <h3>We can't seem to find any sessions for this conference. If you think this is an error, please contact us.</h3>}
                  </Col>}
                {(searchBy === "sessionPresenter" || searchBy === "sessionOrg") &&
                  <Col sm={12}>
                    <h1>Sessions</h1>
                    {sessArray.length > 0
                      ? <SessionCard session={searchSessPres(sessArray)} presenter={presArray} conference={conference} change={handleToggle} />
                      : <h3>We can't seem to find any conferences associated with this presenter or organization. If you think this is an error, please contact us.</h3>}

                  </Col>}
                {searchBy === "allPnS" &&
                  <div>
                    <Col sm={6}>
                      <h1>Presenters</h1>
                      {presArray.length > 0
                        ? <PresenterCard presenter={searchPres(presArray)} conference={conference} change={handleToggle} />
                        : <h3>We can't seem to find any presenters for this conference. If you think this is an error, please contact us.</h3>}
                    </Col>
                    <Col sm={6}>
                      <h1>Sessions</h1>
                      {sessArray.length > 0
                        ? <SessionCard session={searchSess(sessArray)} presenter={presArray} conference={conference} change={handleToggle} />
                        : <h3>We can't seem to find any sessions for this conference. If you think this is an error, please contact us.</h3>}
                    </Col>
                  </div>}
              </Row>
            </Col>
          </Row>

        </Container >
      }
    </>
  )

}

export default ConfDetails;