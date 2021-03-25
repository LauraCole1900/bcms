import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Card, Row, Col, Form } from "react-bootstrap";
import { ConferenceCard, UserCard } from "../cards";
import { ConferenceAPI } from "../../utils/api";
import "./style.css";

const AllConfs = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const [confArray, setConfArray] = useState([]);
  const [searchBy, setSearchBy] = useState("all");
  const [search, setSearch] = useState("");
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    // GET conferences
    ConferenceAPI.getConferences()
      .then(resp => {
        const confArr = resp.data;
        // Filter conferences by date, so only upcoming conferences render
        const filteredConf = confArr.filter(a => new Date(a.startDate) - new Date() >= 0);
        // Sort filtered conferences by date, earliest to latest
        const sortedConf = filteredConf.sort((a, b) => (a.startDate > b.startDate) ? 1 : -1);
        // Set conferences in state
        setConfArray(sortedConf);
        // Set pageReady to true for page render
        setPageReady(true);
      })
      .catch(err => console.log(err))
  }, [confArray])

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


  return (
    <>
      { pageReady === true && (
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
                ? <ConferenceCard conference={searchFilter(confArray)} />
                : <h3>We can't seem to find any conferences at this time. If you think this is an error, please contact us.</h3>}
            </Row>
          </Container>
        </div>
      )}
    </>
  )
}

export default AllConfs;