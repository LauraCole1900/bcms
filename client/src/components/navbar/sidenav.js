import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Nav, Row } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { ConfirmModal, ErrorModal, SuccessModal } from "../modals";
import { AttendeeAPI, ExhibitorAPI } from "../../utils/api";
import "./style.css";

const Sidenav = (props) => {
  const { user, isAuthenticated } = useAuth0();
  const location = useLocation();
  const [cardAttendConf, setCardAttendConf] = useState([]);
  const [cardExhibitConf, setCardExhibitConf] = useState([]);
  const [errThrown, setErrThrown] = useState();
  const [btnName, setBtnName] = useState("");
  const [thisId, setThisId] = useState();
  const [thisName, setThisName] = useState();
  const [pageReady, setPageReady] = useState(false);

  // Pull conference ID from URL
  const urlArray = window.location.href.split("/");
  const confId = urlArray[urlArray.length - 1];
  const urlType = urlArray[urlArray.length - 2];

  // Modal variables
  const [showConfirm, setShowConfirm] = useState(0);
  const [showSuccess, setShowSuccess] = useState(0);
  const [showErr, setShowErr] = useState(0);

  // Sets boolean to show or hide relevant modal
  const handleShowConfirm = (e) => {
    const { dataset, name } = e.target;
    console.log(name, dataset.confid, dataset.confname);
    setShowConfirm(dataset.confid);
    setBtnName(name);
    setThisId(dataset.confid);
    setThisName(dataset.confname);
  }
  const handleHideConfirm = () => setShowConfirm(0);
  const handleShowSuccess = () => setShowSuccess(thisId);
  const handleHideSuccess = () => {
    setShowSuccess(0);
    props.change();
  }
  const handleShowErr = () => setShowErr(thisId);
  const handleHideErr = () => {
    setShowErr(0);
    props.change();
  }

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

  useEffect(() => {
    if (isAuthenticated) {
      // Retrieves conferences user is registered to attend to determine whether register or unregister button should render
      AttendeeAPI.getConferencesAttending(user.email)
        .then(resp => {
          const cardAttArr = resp.data
          const cardAttIds = cardAttArr.map(cardAttArr => cardAttArr.confId)
          setCardAttendConf(cardAttIds);
        })
        .catch(err => console.log(err));

      // Retrieves conferences user is registered to exhibit at to determine whether exhibit register or unregister button should render
      ExhibitorAPI.getConferencesExhibiting(user.email)
        .then(resp => {
          console.log("from confCard getConfExh", resp.data)
          const cardExhArr = resp.data
          const cardExhIds = cardExhArr.map(cardExhArr => cardExhArr.confId)
          setCardExhibitConf(cardExhIds);
        })
    }
    setPageReady(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {pageReady === true &&
        <Nav fluid="true" className="center outline flex-column" expand="md">
          <Row><h3 className="textTight">Navigation</h3></Row>
          {urlType !== "details" &&
            <Row>
              <Link to={`/details/${confId}`} className={location.pathname === `/details/${confId}` ? "link active" : "link"}>
                <Button data-toggle="popover" title="View details" className="sideButton">Details</Button>
              </Link>
            </Row>}
          {urlType !== "schedule" &&
            <Row>
              <Link to={`/schedule/${confId}`} className={location.pathname === `/schedule/${confId}` ? "link active" : "link"}>
                <Button data-toggle="popover" title="View schedule" className="sideButton">Schedule</Button>
              </Link>
            </Row>}
          {urlType !== "venue" &&
            <Row>
              <Link to={`/venue/${confId}`} className={location.pathname === `/venue/${confId}` ? "link active" : "link"}>
                <Button data-toggle="popover" title="Venue information" className="sideButton">Venue</Button>
              </Link>
            </Row>}
          {urlType !== "exhibits" &&
            <Row>
              <Link to={`/exhibits/${confId}`} className={location.pathname === `/exhibits/${confId}` ? "link active" : "link"}>
                <Button data-toggle="popover" title="Exhibit information" className="sideButton">Exhibits</Button>
              </Link>
            </Row>}
          {isAuthenticated &&
            user.email !== props.conference[0].ownerEmail &&
            props.conference[0].confCancel === "no" &&
            cardAttendConf.indexOf(confId) < 0 &&
            <Row>
              <Link to={`/register_attend/${confId}`} className={location.pathname === `/register_attend/${confId}` ? "link active" : "link"}>
                <Button data-toggle="popover" title="Register for this conference" className="sideButton">Register as Attendee</Button>
              </Link>
            </Row>}
          {isAuthenticated &&
            user.email !== props.conference[0].ownerEmail &&
            props.conference[0].confCancel === "no" &&
            cardAttendConf.indexOf(confId) >= 0 &&
            <Row>
              <Button data-toggle="popover" title="Unregister attendee from this conference" className="sideButton" data-confid={confId} data-confname={props.conference[0].confName} name="unregAtt" onClick={(e) => handleShowConfirm(e)}>Unregister Attendee</Button>
            </Row>}
          {isAuthenticated &&
            user.email !== props.conference[0].ownerEmail &&
            props.conference[0].confCancel === "no" &&
            cardAttendConf.indexOf(confId) >= 0 &&
            <Row>
              <Link to={`/register_edit/${confId}`} className={location.pathname === `/register_edit/${confId}` ? "link active" : "link"}>
                <Button data-toggle="popover" title="Edit your attendee registration" className="sideButton">Edit attendee registration</Button>
              </Link>
            </Row>}
          {isAuthenticated &&
            user.email !== props.conference[0].ownerEmail &&
            props.conference[0].confType === "Live" &&
            props.conference[0].confCancel === "no" &&
            cardExhibitConf.indexOf(props.conference[0]._id) < 0 &&
            <Row>
              <Link to={`/register_exhibit/${props.conference[0]._id}`} className={location.pathname === `/register_exhibit/${props.conference[0]._id}` ? "link active" : "link"}>
                <Button data-toggle="popover" title="Register to exhibit at this conference" className="sideButton">Register as Exhibitor</Button>
              </Link>
            </Row>}
          {isAuthenticated &&
            props.conference[0].confType === "Live" &&
            props.conference[0].confCancel === "no" &&
            cardExhibitConf.indexOf(props.conference[0]._id) >= 0 &&
            <Row>
              <Button data-toggle="popover" title="Unregister exhibit from this conference" className="sideButton" data-confid={props.conference[0]._id} data-confname={props.conference[0].confName} name="unregExh" onClick={(e) => handleShowConfirm(e)}>Unregister Exhibit</Button>
            </Row>}
          {isAuthenticated &&
            props.conference[0].confType === "Live" &&
            props.conference[0].confCancel === "no" &&
            cardExhibitConf.indexOf(props.conference[0]._id) >= 0 &&
            <Row>
              <Link to={`/edit_exhibit/${props.conference[0]._id}`} className={location.pathname === `/edit_exhibit/${props.conference[0]._id}` ? "link active" : "link"}>
                <Button data-toggle="popover" title="Edit your exhibitor registration" className="sideButton">Edit exhibitor registration</Button>
              </Link>
            </Row>}
          {isAuthenticated &&
            props.conference[0].confSessProposalConfirm === "yes" &&
            <Row>
              <Link to={`/propose_session/${confId}`} className={location.pathname === `/propose_session/${confId}` ? "link active" : "link"}>
                <Button data-toggle="popover" title="Session proposal form" className="sideButton">Session proposal form</Button>
              </Link>
            </Row>}
          {isAuthenticated &&
            (user.email === props.conference[0].ownerEmail || props.conference[0].confSessProposalCommittee.includes(user.email)) &&
            <>
              {urlType !== "session_proposals" &&
                <Row>
                  <Link to={`/session_proposals/${confId}`} className={location.pathname === `/session_proposal/${confId}` ? "link active" : "link"}>
                    <Button data-toggle="popover" title="View Session Proposals" className="committeeButton">View Session Proposals</Button>
                  </Link>
                </Row>}
              {urlType !== "committee" &&
                <Row>
                  <Link to={`/committee/${confId}`} className={location.pathname === `/committee/${confId}` ? "link active" : "link"}>
                    <Button data-toggle="popover" title="Set proposal review committee" className="committeeButton">Proposal Review Committee</Button>
                  </Link>
                </Row>}
            </>}
          {isAuthenticated &&
            (user.email === props.conference[0].ownerEmail || props.conference[0].confAdmins.includes(user.email)) &&
            <>
              {urlType !== "attendees" &&
                <Row>
                  <Link to={`/attendees/${confId}`} className={location.pathname === `/attendees/${confId}` ? "link active" : "link"}>
                    <Button data-toggle="popover" title="View conference attendees" className="adminButton">View Attendees</Button>
                  </Link>
                </Row>}
              {urlType !== "exhibitors" &&
                <Row>
                  <Link to={`/exhibitors/${confId}`} className={location.pathname === `/exhibitors/${confId}` ? "link active" : "link"}>
                    <Button data-toggle="popover" title="View conference exhibitors" className="adminButton">View Exhibitors</Button>
                  </Link>
                </Row>}
              {urlType !== "presenters" &&
                <Row>
                  <Link to={`/presenters/${confId}`} className={location.pathname === `/presenters/${confId}` ? "link active" : "link"}>
                    <Button data-toggle="popover" title="View conference presenters" className="adminButton">View Presenters</Button>
                  </Link>
                </Row>}
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
                <Link to={`/admin_register_att/${confId}`} className={location.pathname === `/admin_register_att/${confId}` ? "link active" : "link"}>
                  <Button data-toggle="popover" title="Add attendee" className="adminButton">Add Attendee</Button>
                </Link>
              </Row>
              <Row>
                <Link to={`/admin_register_exh/${confId}`} className={location.pathname === `/admin_register_exh/${confId}` ? "link active" : "link"}>
                  <Button data-toggle="popover" title="Add exhibit" className="adminButton">Add Exhibit</Button>
                </Link>
              </Row>
              <Row>
                <Link to={`/new_session/${confId}`} className={location.pathname === `/new_session/${confId}` ? "link active" : "link"}>
                  <Button data-toggle="popover" title="Add a session" className="adminButton">Add Session</Button>
                </Link>
              </Row>
              <Row>
                <p className="whitespace">New presenters may only be added by adding a new session or editing an existing session.</p>
              </Row>
            </>}

          {/* Will need to add deletesess={() => handleSessDelete(sess._id)}? Or only from sessionCard? */}
          <ConfirmModal btnname={btnName} confname={thisName} urlid={confId} unregatt={() => handleAttUnreg(thisId, user.email)} unregexh={() => handleExhUnreg(thisId, user.email)} show={showConfirm === props.conference[0]._id} hide={(e) => handleHideConfirm(e)} />

          <SuccessModal conference={props.conference} confname={thisName} urlid={confId} urltype={urlType} btnname={btnName} show={showSuccess === props.conference[0]._id} hide={(e) => handleHideSuccess(e)} />

          <ErrorModal conference={props.conference} urlid={confId} urltype={urlType} errmsg={errThrown} btnname={btnName} show={showErr === props.conference[0]._id} hide={(e) => handleHideErr(e)} />

        </Nav>
      }
    </>
  )
}

export default Sidenav;