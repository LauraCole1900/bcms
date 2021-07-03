import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { firstBy } from "thenby";
import { Container, Row, Col, Form, Card } from "react-bootstrap";
import { ConferenceCard, PresenterCard, SessionCard, UserCard } from "../components/cards";
import { Sidenav } from "../components/navbar";
import { ConfirmModal, ErrorModal, SuccessModal } from "../components/modals";
import { AttendeeAPI, ExhibitorAPI, ConferenceAPI, PresenterAPI, SessionAPI } from "../utils/api";
import { handleConfCancel, handleDeleteById, handleFetchOne, handleUnreg } from "../utils/functions";
import "./style.css";

const ConfDetails = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const [conference, setConference] = useState([]);
  const [sessArray, setSessArray] = useState([]);
  const [presArray, setPresArray] = useState([]);
  const [searchBy, setSearchBy] = useState("allPnS");
  const [search, setSearch] = useState("");
  const [errThrown, setErrThrown] = useState();
  const [btnName, setBtnName] = useState();
  const [thisId, setThisId] = useState();
  const [thisName, setThisName] = useState();
  const [confReady, setConfReady] = useState(false);
  const [sessReady, setSessReady] = useState(false);
  const [presReady, setPresReady] = useState(false);

  // Determines which page user is on, specifically for use with URLs that include the conference ID
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

  // Parses time strings for sorting
  const timeToSort = (time) => {
    const timeArr = time.split(":");
    const hh = timeArr[0];
    if (hh.length === 1) {
      const hhh = `0${hh}`;
      const newTime = `${hhh}:${timeArr[1]}`
      return newTime;
    } else {
      const newTime = `${hh}:${timeArr[1]}`
      return newTime;
    }
  }

  // GETs sessions by confId
  const fetchSess = async (confId) => {
    await SessionAPI.getSessions(confId)
      .then(resp => {
        console.log("confDetailsPage getSessions", resp.data)
        const sessArr = resp.data
        // Filter sessions by acceptance status
        const filteredSess = sessArr.filter(sess => sess.sessAccepted === "yes")
        // Sort sessions by room, then start time, then date, then keynote
        const roomSort = filteredSess.sort((a, b) => (a.sessRoom < b.sessRoom) ? 1 : -1);
        const timeSort = roomSort.sort((a, b) => (timeToSort(a.sessStart) > timeToSort(b.sessStart)) ? 1 : -1);
        const dateSort = timeSort.sort((a, b) => (a.sessDate < b.sessDate) ? 1 : -1);
        const keySort = dateSort.sort((a, b) => (a.sessKeynote < b.sessKeynote) ? 1 : -1);
        setSessArray(keySort);
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

  // Handles click on "yes, delete" button on Confirm modal from Session card
  const handleSessDelete = (sessId) => {
    console.log("from handleSessDelete", sessId)
    handleHideConfirm();
    // Filters presenters by those whose sessId[] includes sessId
    const thesePres = presArray.filter((pres) => pres.presSessionIds.includes(sessId))
    thesePres.forEach((pres) => {
      // Deletes sessId from each presenters' sessId[]
      const presSessions = pres.presSessionIds.filter(id => id !== sessId)
      console.log("from handleSessDelete presSessions", presSessions);
      presSessions[0]
        ? PresenterAPI.updatePresenterByEmail({ ...pres, presSessionIds: presSessions[0] }, pres.presEmail, pres.confId)
        : PresenterAPI.deletePresenterByEmail(pres.presEmail, pres.confId)
    })
    // Deletes session from DB
    handleDeleteById(SessionAPI.deleteSession, sessId, handleShowSuccess, setErrThrown, handleShowErr);
  };

  // Handles click on "yes, deactivate" button on Confirm modal from Presenter card
  const handlePresInactive = (presId) => {
    console.log("from handlePresInactive", presId)
    handleHideConfirm();
    // Filters presArray to find specific presenter document
    const thisPres = presArray.filter(pres => pres._id === presId)
    // Filters sessions by those whose presEmail[] includes thisPres.presEmail
    const theseSess = sessArray.filter(sess => sess.sessPresEmails.includes(thisPres.presEmail))
    console.log("from handlePresInactive theseSess", theseSess)
    theseSess.forEach((sess) => {
      const sessPresenters = sess.sessPresEmails.filter(email => email !== thisPres.presEmail)
      console.log("from handlePresInactive sessPresenters", sessPresenters)
      sessPresenters[0]
        ? SessionAPI.updateSession({ ...sess, sessPresEmails: sessPresenters[0] }, sess._id)
        : SessionAPI.deleteSession(sess._id)
    })
    // Marks presenter "inactive" in DB
    PresenterAPI.updatePresenterById({ ...thisPres, presActive: "no" }, presId)
    .then((resp) => {
      if (resp.status !== 422) {
        handleShowSuccess();
      }
    })
    .catch((err) => {
      console.log("from handleUpdateById", err);
      setErrThrown(err.message);
      handleShowErr();
    });
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

  useEffect(() => {
    console.log({ showSuccess })
    // GET conference by ID
    handleFetchOne(ConferenceAPI.getConferenceById, urlId, setConference);
    // GET sessions by conference ID
    fetchSess(urlId);
    // GET presenters by conferenceID
    fetchPres(urlId);

    setConfReady(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSuccess])


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
              <ConferenceCard conference={conference} setConference={setConference} setBtnName={setBtnName} setShowConfirm={setShowConfirm} setThisId={setThisId} setThisName={setThisName} />
            </Col>
          </Row>

          <Row>
            <Col sm={2} className="nomargin">
              <Sidenav conference={conference} showSuccess={showSuccess} setShowSuccess={setShowSuccess} />
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
                      ? <PresenterCard presenter={searchPres(presArray)} conference={conference} setConference={setConference} setBtnName={setBtnName} setShowConfirm={setShowConfirm} setThisId={setThisId} setThisName={setThisName} />
                      : <h3>We can't seem to find any presenters for this conference. If you think this is an error, please contact us.</h3>}
                  </Col>}
                {(searchBy === "allSess" || searchBy === "sessionName") &&
                  <Col sm={12}>
                    <h1>Sessions</h1>
                    {sessArray.length > 0
                      ? <SessionCard session={searchSess(sessArray)} presenter={presArray} setConference={setConference} setBtnName={setBtnName} setShowConfirm={setShowConfirm} setThisId={setThisId} setThisName={setThisName} />
                      : <h3>We can't seem to find any sessions for this conference. If you think this is an error, please contact us.</h3>}
                  </Col>}
                {(searchBy === "sessionPresenter" || searchBy === "sessionOrg") &&
                  <Col sm={12}>
                    <h1>Sessions</h1>
                    {sessArray.length > 0
                      ? <SessionCard session={searchSessPres(sessArray)} presenter={presArray} conference={conference} setConference={setConference} setBtnName={setBtnName} setShowConfirm={setShowConfirm} setThisId={setThisId} setThisName={setThisName} />
                      : <h3>We can't seem to find any conferences associated with this presenter or organization. If you think this is an error, please contact us.</h3>}
                  </Col>}
                {searchBy === "allPnS" &&
                  <div>
                    <Col sm={6}>
                      <h1>Presenters</h1>
                      {presArray.length > 0
                        ? <PresenterCard presenter={searchPres(presArray)} conference={conference} setConference={setConference} setBtnName={setBtnName} setShowConfirm={setShowConfirm} setThisId={setThisId} setThisName={setThisName} />
                        : <h3>We can't seem to find any presenters for this conference. If you think this is an error, please contact us.</h3>}
                    </Col>
                    <Col sm={6}>
                      <h1>Sessions</h1>
                      {sessArray.length > 0
                        ? <SessionCard session={searchSess(sessArray)} presenter={presArray} conference={conference} setConference={setConference} setBtnName={setBtnName} setShowConfirm={setShowConfirm} setThisId={setThisId} setThisName={setThisName} />
                        : <h3>We can't seem to find any sessions for this conference. If you think this is an error, please contact us.</h3>}
                    </Col>
                  </div>}
              </Row>
            </Col>
          </Row>

          {/* Information I need to lift:
            Button name
            Conference object
            Card object if different (session, etc.)
            */}

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
            cancelpres={() => handlePresInactive(
              thisId
            )}
            deletesess={() => handleSessDelete(
              thisId
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
              setErrThrown,
              handleShowErr
            )}
            show={showConfirm === true}
            hide={() => handleHideConfirm()}
          />

          <SuccessModal
            conference={conference}
            confname={thisName}
            confid={urlId}
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

}

export default ConfDetails;