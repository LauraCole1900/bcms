import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Card, Row, Col, Form } from "react-bootstrap";
import Conference from "../conferenceCard";
import UserCard from "../userCard";
import { ConferenceAPI } from "../../utils/api";
import "./style.css";

const AllConfs = () => {
  const { user } = useAuth0();
  const [confArray, setConfArray] = useState([]);
  const [searchBy, setSearchBy] = useState("");
  const [search, setSearch] = useState("");
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    ConferenceAPI.getConferences().then(resp => {
      const confArr = resp.data;
      const filteredConf = confArr.filter(a => new Date(a.startDate) - new Date() > 0);
      const sortedConf = confArr.sort((a, b) => (a.startDate > b.startDate) ? 1 : -1);
      console.log("confArr", confArr);
      console.log("filteredConf", filteredConf);
      console.log("sortedConf", sortedConf);
      setConfArray(sortedConf);
      setPageReady(true);
    })
  }, [])

  const searchFilter = (data) => {
    if (searchBy === "") {
      return (confArray)
    } else if (searchBy === "name") {
      return data.filter((conference) => conference.confName.toLowerCase().indexOf(search) !== -1)
    } else if (searchBy === "org") {
      return data.filter((conference) => conference.confOrg.toLowerCase().indexOf(search) !== -1)
    }
  }


  return (
    <>
      { pageReady === true && (
        <div className="mt-4">
          <Container>
            <Row>
              <UserCard />
              <Card.Body>
                <Form inline>
                  <Row>
                    <Col>
                      <Form.Group controlId="confSearchBy">
                        <Form.Label>Search by:</Form.Label>
                        <Form.Control as="select" name="searchBy" onChange={(e) => setSearchBy(e.target.value)}>
                          {/* <option value="all">All Conferences</option> */}
                          <option value="name">Conference Name</option>
                          <option value="org">Organization</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>
                    <Col>
                      <div id="confPageSearch">
                        <Form.Control className="mr-lg-5 search-area" type="text" placeholder="Search for a conference" value={search} onChange={(e) => setSearch(e.target.value)} />
                      </div>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Row>

            <Row>
              <Conference conference={searchFilter(confArray)} />
            </Row>
          </Container>
        </div>
      )};
    </>
  )
}

export default AllConfs;