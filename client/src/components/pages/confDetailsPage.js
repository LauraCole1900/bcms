import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Row, Col, Form, Card, Button } from "react-bootstrap";
import { ConferenceCard, PresenterCard, SessionCard, UserCard } from "../cards"
import { ConferenceAPI, SessionAPI } from "../../utils/api";
import "./style.css";

const ConfDetails = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const [conference, setConference] = useState({});
  const [sessArray, setSessArray] = useState([]);
  const [searchBy, setSearchBy] = useState("allPnS");
  const [search, setSearch] = useState("");
  const [pageReady, setPageReady] = useState(false);

  const urlArray = window.location.href.split("/")
  const confId = urlArray[urlArray.length - 1]

  useEffect(() => {
    ConferenceAPI.getConferenceById(confId)
    .then(resp => {
        setConference(resp.data)
      })
      .catch(err => console.log(err));

    SessionAPI.getSessions(confId)
      .then(resp => {
        const sessArr = resp.data;
        setSessArray(sessArr);
        setPageReady(true);
      })
      .catch(err => console.log(err))
  }, [])

  const searchFilter = (data) => {
    switch (searchBy) {
      case "sessionName":
        return data.filter((session) => session.sessName.toLowerCase().indexOf(search.toLowerCase()) !== -1)
      case "presenterName":
        return data.filter((session) => session.sessPresenter.toLowerCase().indexOf(search.toLowerCase()) !== -1)
      default:
        return (sessArray)
    }
  }


  return (
    <>
      {pageReady === true &&
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
                        <Form.Control className="mr-lg-5 search-area" type="input" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                      </div>
                    </Row>}
                </Form>
              </Card.Body>
            </Col>
          </Row>

          {!isAuthenticated &&
            <Row>
              <h1 className="regRemind">Please <Link className="login" onClick={() => loginWithRedirect()}>
                log in
                </Link> to register.</h1>
            </Row>}

          <Row>
            <Col sm={12}>
              <ConferenceCard conference={conference} />
            </Col>
          </Row>

          <Row>
            <Col sm={1}></Col>
            <Col sm={2}>
              <Link to={{
                state: { confInfo: conference },
                pathname: `/schedule/${confId}`
              }}>
                <Button data-toggle="popover" title="View schedule" className="button">Schedule</Button>
              </Link>
            </Col>
            <Col sm={1}></Col>
            {isAuthenticated &&
              (user.email === conference.creatorEmail || conference[0].confAdmins.includes(user.email)) &&
              <div>
                <Col sm={2}>
                  <Link to={{
                    state: { confInfo: conference },
                    pathname: `/edit_schedule/${confId}`
                  }}>
                    <Button data-toggle="popover" title="Edit schedule" className="button">Edit Schedule</Button>
                  </Link>
                </Col>
                <Col sm={1}></Col>
                <Col sm={2}>
                  <Link to={{
                    state: { confInfo: conference },
                    pathname: `/add_session/${confId}`
                  }}>
                    <Button data-toggle="popover" title="Add session" className="button">Add Session</Button>
                  </Link>
                </Col>
              </div>}
          </Row>

          <Row>
            {searchBy === "allPres" &&
              <Col sm={12}>
                <h1>Presenters</h1>
                {sessArray.length > 0
                  ? <PresenterCard session={searchFilter(sessArray)} />
                  : <h3>We can't seem to find any presenters for this conference. If you think this is an error, please contact us.</h3>}
              </Col>}
            {(searchBy === "allSess" || searchBy === "sessionName") &&
              <Col sm={12}>
                <h1>Sessions</h1>
                {sessArray.length > 0
                  ? <SessionCard session={searchFilter(sessArray)} />
                  : <h3>We can't seem to find any sessions for this conference. If you think this is an error, please contact us.</h3>}
              </Col>}
            {(searchBy === "allPnS" || searchBy === "presenterName" || searchBy === "presenterOrg") &&
              <div>
                <Col sm={6}>
                  <h1>Presenters</h1>
                  {sessArray.length > 0
                    ? <PresenterCard session={searchFilter(sessArray)} />
                    : <h3>We can't seem to find any presenters for this conference. If you think this is an error, please contact us.</h3>}
                </Col>
                <Col sm={6}>
                  <h1>Sessions</h1>
                  {sessArray.length > 0
                    ? <SessionCard session={searchFilter(sessArray)} />
                    : <h3>We can't seem to find any sessions for this conference. If you think this is an error, please contact us.</h3>}
                </Col>
              </div>}
          </Row>

        </Container>
      }
    </>
  )

}

export default ConfDetails;