import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Card, Row, Col, Form } from "react-bootstrap";
import { ConferenceCard, UserCard } from "../cards";
import { ConfirmModal, ErrorModal, SuccessModal } from "../modals";
import { AttendeeAPI, ConferenceAPI, ExhibitorAPI } from "../../utils/api";
import "./style.css";

const AllConfs = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const [confArray, setConfArray] = useState([]);
  const [searchBy, setSearchBy] = useState("all");
  const [search, setSearch] = useState("");
  const [errThrown, setErrThrown] = useState();
  const [btnName, setBtnName] = useState("");
  const [thisIdx, setThisIdx] = useState();
  const [thisId, setThisId] = useState();
  const [thisName, setThisName] = useState();
  const [changeToggle, setChangeToggle] = useState(false);
  const [pageReady, setPageReady] = useState(false);

  // Determines which page user is on, specifically for use with URLs that include the conference ID
  const urlArray = window.location.href.split("/")
  const urlId = urlArray[urlArray.length - 1]
  const urlType = urlArray[urlArray.length - 2]

  // Modal variables
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showErr, setShowErr] = useState(false);

  // Sets boolean to show or hide relevant modal
  const handleShowConfirm = (e) => {
    const { dataset, name } = e.target;
    console.log(name, dataset.confid, dataset.confname);
    setShowConfirm(dataset.confid);
    setBtnName(name);
    setThisId(dataset.confid);
    setThisIdx(dataset.idx);
    setThisName(dataset.confname);
  }
  const handleHideConfirm = () => setShowConfirm(0);
  const handleShowSuccess = () => setShowSuccess(thisId);
  const handleHideSuccess = () => {
    setShowSuccess(0);
    handleToggle();
  }
  const handleShowErr = () => setShowErr(thisId);
  const handleHideErr = () => {
    setShowErr(0);
    handleToggle();
  }

  // GETs registered attendees' emails
  const fetchAttendeeEmails = async (confId) => {
    console.log("from confCard fetchAttendees", confId)
    await AttendeeAPI.getAttendees(confId)
      .then(res => {
        // map through res.data and pull all emails into an array
        const attData = res.data
        let attEmails = attData.map(attData => attData.email)
        return attEmails
      })
      .catch(err => {
        console.log("from confCard fetAttEmails", err)
        setErrThrown(err.message);
        handleShowErr();
      })
  }
  
  // Handles click on "Yes, Cancel" button on ConfirmModal
  // Will need to have email functionality to email registered participants
  const handleConfCancel = async (confId) => {
    console.log("from confCard", confId)
    handleHideConfirm();
    let attEmailArr = await fetchAttendeeEmails(confId);
    // send-email functionality for registered attendees goes here

    ExhibitorAPI.getExhibitors(confId)
      .then(res => {
        if (!res.err) {
          console.log("from confCard getExhibitors", res.data)
        }
      })
      .catch(err => {
        console.log("from confCard getExhibitors", err);
        setErrThrown(err.message);
        handleShowErr();
      })

    ConferenceAPI.updateConference({ ...confArray[thisIdx], confCancel: "yes" }, confId)
      .then(res => {
        if (!res.err) {
          handleShowSuccess();
        }
      })
      .catch(err => {
        console.log("from confCard updateConf", err);
        setErrThrown(err.message);
        handleShowErr();
      });
  };

  // Handles click on "Yes, unregister attendee" button on ConfirmModal
  const handleAttUnreg = (confId, email) => {
    console.log("from confirm attUnreg", confId, email)
    handleHideConfirm();
    // DELETE call to delete attendee document
    AttendeeAPI.unregisterAttendee(confId, email)
      .then(res => {
        // If no errors thrown, show Success modal
        if (!res.err) {
          handleShowSuccess()
        }
      })
      // If yes errors thrown, show Error modal
      .catch(err => {
        console.log(err);
        setErrThrown(err.message);
        handleShowErr();
      });
  }

  // Handles click on "Yes, unregister exhibitor" button on ConfirmModal
  const handleExhUnreg = (confId, email) => {
    console.log("from confirm exhUnreg", confId, email)
    handleHideConfirm();
    // DELETE call to delete exhibitor document
    ExhibitorAPI.deleteExhibitor(confId, email)
      .then(res => {
        // If no errors thrown, show Success modal
        if (!res.err) {
          handleShowSuccess();
        }
      })
      // If yes errors thrown, show Error modal
      .catch(err => {
        console.log(err)
        setErrThrown(err.message);
        handleShowErr();
      });
  }

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
    // GET conferences
    ConferenceAPI.getConferences()
      .then(resp => {
        const confArr = resp.data;
        // Filter conferences by date, so only current & upcoming conferences render
        const filteredConf = confArr.filter(a => new Date(a.endDate) - new Date() >= 0);
        // Sort filtered conferences by date, earliest to latest
        const sortedConf = filteredConf.sort((a, b) => (a.startDate > b.startDate) ? 1 : -1);
        // Set conferences in state
        setConfArray(sortedConf);
        // Set pageReady to true for page render
        setPageReady(true);
      })
      .catch(err => console.log(err))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSuccess])


  return (
    <>
      {pageReady === true && (
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
                ? <ConferenceCard conference={searchFilter(confArray)} change={handleToggle} handleHideConfirm={handleHideConfirm} handleShowConfirm={handleShowConfirm} setErrThrown={setErrThrown} handleShowErr={handleShowErr} handleShowSuccess={handleShowSuccess} urlId={urlId} urlType={urlType} />
                : <h3>We can't seem to find any upcoming conferences. If you think this is an error, please contact us.</h3>}
            </Row>

            {/* Will need to add deletesess={() => handleSessDelete(sess._id)}? Or only from sessionCard? */}
            <ConfirmModal btnname={btnName} confname={thisName} urlid={urlId} cancelconf={() => handleConfCancel(thisId)} unregatt={() => handleAttUnreg(thisId, user.email)} unregexh={() => handleExhUnreg(thisId, user.email)} show={showConfirm === true} hide={(e) => handleHideConfirm(e)} />

            <SuccessModal conference={confArray[thisIdx]} confname={thisName} confid={thisId} urlid={urlId} urltype={urlType} btnname={btnName} show={showSuccess === true} hide={(e) => handleHideSuccess(e)} />

            <ErrorModal conference={confArray[thisIdx]} confName={thisName} confid={thisId} urlid={urlId} urltype={urlType} errmsg={errThrown} btnname={btnName} show={showErr === true} hide={(e) => handleHideErr(e)} />

          </Container>
        </div>
      )}
    </>
  )
}

export default AllConfs;