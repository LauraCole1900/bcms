import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Card, Row, Col, Form, Button, ButtonGroup } from "react-bootstrap";
import { ConferenceCard, UserCard, ExhibitorCard } from "../cards";
import { ConferenceAPI, ExhibitorAPI } from "../../utils/api";
import "./style.css";

const ConfExhibits = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const location = useLocation();
  const [conference, setConference] = useState([]);
  const [exhArray, setExhArray] = useState([]);
  const [searchBy, setSearchBy] = useState("allExh");
  const [search, setSearch] = useState("");
  const [confReady, setConfReady] = useState(false);
  const [exhReady, setExhReady] = useState(false);

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
    fetchConf(confId);
    // GET exhibitors by conference ID
    fetchExh(confId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confId])


  return (
    <>
      {confReady === true &&
        exhReady === true &&
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

          {!isAuthenticated &&
            <Row>
              <h1 className="regRemind">Please <Link to={window.location.origin} className="login" onClick={() => loginWithRedirect()}>
                log in
                </Link> to register for this conference.</h1>
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
            {searchBy === "exhComp" &&
              <Col sm={12}>
                <h1>Exhibitors</h1>
                {exhArray.length > 0
                  ? <ExhibitorCard exhibitor={searchFilter(exhArray)} conference={conference} />
                  : <h3>We can't seem to find any exhibitors for this conference based on your search criteria. If you think this is an error, please contact us.</h3>}
              </Col>}
            {searchBy === "allExh" &&
              <div>
                <Col sm={12}>
                  <h1>Exhibitors</h1>
                  {exhArray.length > 0
                    ? <ExhibitorCard exhibitor={searchFilter(exhArray)} conference={conference} />
                    : <h3>We can't seem to find any exhibitors for this conference. If you think this is an error, please contact us.</h3>}
                </Col>
              </div>}
          </Row>

        </Container >
      }
    </>
  )

};

export default ConfExhibits;