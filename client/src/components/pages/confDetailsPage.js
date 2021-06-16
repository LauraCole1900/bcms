import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { firstBy } from "thenby";
import { Container, Row, Col, Form, Card } from "react-bootstrap";
import { ConferenceCard, PresenterCard, SessionCard, UserCard } from "../cards";
import { Sidenav } from "../navbar";
import { ConferenceAPI, PresenterAPI, SessionAPI } from "../../utils/api";
import "./style.css";

const ConfDetails = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
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
        const sessArr = resp.data
        // Filter sessions by acceptance status
        const filteredSess = sessArr.filter(sess => sess.sessAccepted === "yes")
        // Sort sessions by date
        const sortedSess = filteredSess.sort(
          firstBy("sessKeynote", "desc")
            .thenBy("sessDate")
            .thenBy(Number("sessStart"))
        );
        console.log({ sortedSess })
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

  // Pull session IDs from presenter.presSessionIds[]
  const getSessIds = (pres) => {
    let idArr = [];
    pres.presSessionIds.map(id => idArr = [...idArr, id]);
    return idArr;
  }

  // Filter duplicate session IDs
  const filterSessIds = (idArr) => {
    const theseIds = idArr.filter(id => idArr.includes(id));
    const filteredIds = [...new Set(theseIds)];
    return filteredIds;
  }

  // Filter session array by session name
  const filterSessName = (arr) => {
    return arr.filter(session => session.sessName.toLowerCase().indexOf(search.toLowerCase()) !== -1);
  }

  // Filter presenter array by presenter's last name
  const filterName = (arr) => {
    return arr.filter(presenter => presenter.presFamilyName.toLowerCase().indexOf(search.toLowerCase()) !== -1);
  }

  // Filter presenter array by presenter's organization
  const filterOrg = (arr) => {
    return arr.filter(presenter => presenter.presOrg.toLowerCase().indexOf(search.toLowerCase()) !== -1);
  }

  // Filter session array by presenter information
  const filterSessByPres = (arr1, arr2) => {
    let sessIdArr = [];
    let presIdArr = [];
    let sessArr = [];
    arr1.forEach(presenter => {
      presIdArr = getSessIds(presenter);
      sessIdArr = sessIdArr.concat(presIdArr);
    });
    const sessPresIds = filterSessIds(sessIdArr);
    sessPresIds.forEach(id => {
      let session = arr2.filter(sess => (sess._id === id));
      sessArr = [...sessArr, session[0]]
    })
    return sessArr;
  }

  // Filter session array by user input
  const searchSess = (arr) => {
    switch (searchBy) {
      // Filter session names
      case "sessionName":
        return filterSessName(arr);
      // Return all response data
      default:
        return sessArray
    }
  }

  // Filter presenter array by user input
  const searchPres = (arr) => {
    switch (searchBy) {
      // Filter presenter names
      case "presenterName":
        return filterName(arr);
      // Filter presenter organization
      case "presenterOrg":
        return filterOrg(arr);
      // Return all response data
      default:
        return presArray
    }
  }

  // Filter session array by presenter name or presenter org
  const searchSessPres = (arr) => {
    let pres = [];
    switch (searchBy) {
      case "sessionPresenter":
        pres = filterName(presArray);
        let sessPresArr = filterSessByPres(pres, arr);
        return sessPresArr;
      case "sessionOrg":
        pres = filterOrg(presArray);
        let sessOrgArr = filterSessByPres(pres, arr);
        return sessOrgArr;
      default:
        return sessArray;
    }
  }

  // Triggers toggle to force page re-render on conference cancel or presenter/session delete
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
            <Col sm={2} className="nomargin">
              <Sidenav conference={conference} />
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