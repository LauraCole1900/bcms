import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Row, Col, Form, Card } from "react-bootstrap";
import { ConferenceCard, SessionCard, UserCard } from "../cards"
import { SessionAPI } from "../../utils/api";
import "./style.css";

const ConfDetails = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const [sessArray, setSessArray] = useState();
  const [searchBy, setSearchBy] = useState("allSess");
  const [search, setSearch] = useState("");
  const [pageReady, setPageReady] = useState(false);

  const urlArray = window.location.href.split("/")
  const confId = urlArray[urlArray.length - 1]

  useEffect(() => {
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
      case "presenter":
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
          </Row>
          <Col sm={4}>
            <Card.Body>
              <Form inline>
                <Row>
                  <Form.Group controlId="sessSearchBy">
                    <Form.Control as="select" name="searchBy" onChange={(e) => setSearchBy(e.target.value)}>
                      <option value="allSess">View All Sessions</option>
                      <option value="sessionName">Search by Session Name</option>
                      <option value="presenter">Search by Presenter</option>
                    </Form.Control>
                  </Form.Group>
                </Row>
                {(searchBy !== "allSess") &&
                  <Row>
                    <div id="sessPageSearch">
                      <Form.Control className="mr-lg-5 search-area" type="input" placeholder="Search sessions" value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                  </Row>}
              </Form>
            </Card.Body>
          </Col>
        </Container>
      }
    </>
  )

}

export default ConfDetails;