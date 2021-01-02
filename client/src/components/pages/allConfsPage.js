import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Card, Row, Col, Form } from "react-bootstrap";
import { ConferenceCard, UserCard } from "../cards";
import { ConferenceAPI } from "../../utils/api";
import "./style.css";

const AllConfs = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const [confArray, setConfArray] = useState([]);
  const [searchBy, setSearchBy] = useState("all");
  const [search, setSearch] = useState("");
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    ConferenceAPI.getConferences()
      .then(resp => {
        const confArr = resp.data;
        const filteredConf = confArr.filter(a => new Date(a.startDate) - new Date() >= 0);
        const sortedConf = filteredConf.sort((a, b) => (a.startDate > b.startDate) ? 1 : -1);
        console.log("confArr", confArr);
        console.log("filteredConf", filteredConf);
        console.log("sortedConf", sortedConf);
        setConfArray(sortedConf);
        setPageReady(true);
      })
      .catch(err => console.log(err))
  }, [])

  const searchFilter = (data) => {
    if (searchBy === "all") {
      return (confArray)
    } else if (searchBy === "name") {
      return data.filter((conference) => conference.confName.toLowerCase().indexOf(search.toLowerCase()) !== -1)
    } else if (searchBy === "org") {
      return data.filter((conference) => conference.confOrg.toLowerCase().indexOf(search.toLowerCase()) !== -1)
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
                          <Form.Control className="mr-lg-5 search-area" type="input" placeholder="Search conferences" value={search} onChange={(e) => setSearch(e.target.value)} />
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
                </Link> to register for any conference.</h1>
              </Row>}

            <Row>
              <ConferenceCard conference={searchFilter(confArray)} />
            </Row>
          </Container>
        </div>
      )};
    </>
  )
}

export default AllConfs;