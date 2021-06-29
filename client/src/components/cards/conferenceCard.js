import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Card, Row, Col, Button, Image } from "react-bootstrap";
import Moment from "react-moment";
import { ConfirmModal, ErrorModal, SuccessModal } from "../modals";
import { AttendeeAPI, ConferenceAPI, ExhibitorAPI } from "../../utils/api";
import "./style.css";

// Figure out how to add the keynote speaker???

const ConferenceCard = (props) => {
  const { user, isAuthenticated } = useAuth0();
  const location = useLocation();
  const [cardAttendConf, setCardAttendConf] = useState([]);
  const [cardExhibitConf, setCardExhibitConf] = useState([]);
  const [errThrown, setErrThrown] = useState();
  const [btnName, setBtnName] = useState();
  const [thisId, setThisId] = useState();
  const [thisName, setThisName] = useState();
  const [cardRender, setCardRender] = useState(false);

  // Determines which page user is on, specifically for use with URLs that include the conference ID
  const urlArray = window.location.href.split("/")
  const confId = urlArray[urlArray.length - 1]
  const urlType = urlArray[urlArray.length - 2]

  // Modal variables
  const [showConfirm, setShowConfirm] = useState(0);
  const [showErr, setShowErr] = useState(0);

  // Sets boolean to show or hide relevant modal
  const handleShowConfirm = (e) => {
    const { dataset, name } = e.target;
    console.log(name, dataset.confid, dataset.confname);
    setBtnName(name);
    setThisId(dataset.confid);
    setThisName(dataset.confname);
    setShowConfirm(dataset.confid && name);
  }
  const handleHideConfirm = () => setShowConfirm(0);
  const handleShowSuccess = () => props.setShowSuccess(thisId && btnName);
  const handleHideSuccess = () => props.setShowSuccess(0);
  const handleShowErr = () => setShowErr(thisId && btnName);
  const handleHideErr = () => setShowErr(0);
  
  // Parses time to 12-hour
  const parseTime = (time) => {
    const timeArr = time.split(":");
    let hours = timeArr[0];
    let minutes = timeArr[1];
    const ampm = hours >= 12 ? "pm" : "am"
    hours = hours % 12;
    hours = hours ? hours : 12
    minutes = minutes < 10 ? "0" + minutes.slice(-1) : minutes;
    const timeStr = `${hours}:${minutes}${ampm}`
    return timeStr
  };

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

    ConferenceAPI.updateConference({ ...props.conference, confCancel: "yes" }, confId)
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
          handleShowSuccess();
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
    setCardRender(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {cardRender === true &&
        props.conference.map((conf, idx) => (
          <Card className="infoCard" key={conf._id}>
            <Card.Header className="cardTitle">
              <Row>
                <Col sm={11}>
                  <h2 className="title">{conf.confName}</h2>
                  <p className="org">Presented by {conf.confOrg}</p>
                </Col>
                <Col sm={1}>
                  {isAuthenticated &&
                    (user.email === conf.ownerEmail) &&
                    <Button data-toggle="popover" title="Cancel this conference" className="deletebtn" data-confid={conf._id} data-confname={conf.confName} data-idx={idx} name="confCancel" onClick={(e) => handleShowConfirm(e)}>
                      <Image fluid="true" src="/images/cancel-event.png" className="delete" alt="Cancel event" data-confid={conf._id} data-confname={conf.confName} data-idx={idx} name="confCancel" />
                    </Button>}
                </Col>
              </Row>
            </Card.Header>
            <Card.Body className="infoCardBody">
              <Row>
                <Col sm={7}>
                  {(conf.confWaiver === "yes") &&
                    <div className="alert">
                      <h5>A signed liability waiver will be required to participate in this event. It will be available at check-in to the event.</h5>
                    </div>}
                  <Card.Text>{conf.confDesc}</Card.Text>
                </Col>
                <Col sm={5} className="vitals">
                  {conf.confCancel === "no" &&
                    <div>
                      {conf.numDays === 1
                        ? <div><Row><p>When: <Moment format="ddd, D MMM YYYY" withTitle>{conf.startDate}</Moment> @{parseTime(conf.confStartTime)} - {parseTime(conf.confEndTime)}</p></Row></div>
                        : <div><Row><p>When: <Moment format="ddd, D MMM YYYY" withTitle>{conf.startDate}</Moment> @{parseTime(conf.confStartTime)} - <Moment format="ddd, D MMM YYYY" withTitle>{conf.endDate}</Moment> @{parseTime(conf.confEndTime)}</p></Row></div>}
                      <Row><p>Type: {conf.confType}</p></Row>
                      <Row>
                        {(conf.confType === "Live") &&
                          <p><a href={`https://www.google.com/maps/search/${conf.confLoc.replace(" ", "+")}`} rel="noreferrer noopener" target="_blank">{conf.confLoc}</a></p>}
                        {(conf.confType === "Virtual") &&
                          (conf.confLocUrl !== undefined) &&
                          <p><a href={conf.confLocUrl} rel="noreferrer noopener" target="_blank">{conf.confLoc}</a></p>}
                        {(conf.confType === "Virtual") &&
                          (conf.confLocUrl === undefined) &&
                          <p>{conf.confLoc}</p>}
                      </Row>
                      {(conf.confType === "Live") &&
                        (conf.confLocUrl !== undefined) &&
                        <Row>
                          <p><a href={conf.confLocUrl} rel="noreferrer noopener" target="_blank">{conf.confLocName}</a></p>
                        </Row>}
                      <Row>
                        <Col>
                          {conf.confType === "Live"
                            ? (conf.confRegDeadline === conf.endDate
                              ? <p>Registration available at the door.</p>
                              : <p>Register by <Moment format="ddd, D MMM YYYY" withTitle>{conf.confRegDeadline}</Moment></p>)
                            : <p>Register by <Moment format="ddd, D MMM YYYY" withTitle>{conf.confRegDeadline}</Moment></p>}
                          {(conf.confFee === "yes")
                            ? (conf.confEarlyRegConfirm === "yes"
                              ? <p>Registration fee: ${conf.confEarlyRegFee}.00 before <Moment format="ddd, D MMM YYYY" withTitle>{conf.confEarlyRegDeadline}</Moment>; increases to ${conf.confFeeAmt}.00 after</p>
                              : <p>Registration fee: ${conf.confFeeAmt}.00</p>)
                            : <p>Registration is free!</p>}
                          {conf.confEarlyRegSwagConfirm === "yes" &&
                            <p>Register by <Moment format="ddd, D MMM YYYY" withTitle>{conf.confEarlyRegDeadline}</Moment> to also receive {conf.confEarlyRegSwagType}</p>}
                        </Col>
                      </Row>
                    </div>}

                  {conf.confCancel === "yes" &&
                    <div>
                      <h3 className="cancel">This event has been cancelled.</h3>
                    </div>}

                  {(confId === "bristleconecms.com" || confId === "conferences" || confId === "profile") &&
                    <Row>
                      <Col sm={4}>
                        <Link to={`/details/${conf._id}`} className={location.pathname === `/details/${conf._id}` ? "link active" : "link"}>
                          <Button data-toggle="popover" title="View conference details" className="button">View details</Button>
                        </Link>
                      </Col>
                    </Row>}
                </Col>
              </Row>

              <Row>
                {isAuthenticated &&
                  conf.confType === "Live" &&
                  conf.confCancel === "no" &&
                  urlType !== "details" && urlType !== "schedule" && urlType !== "exhibits" &&
                  cardExhibitConf.indexOf(conf._id) >= 0 &&
                  <div>
                    <Col sm={1}></Col>
                    <Col sm={2}>
                      <Button data-toggle="popover" title="Unregister exhibit from this conference" className="button" data-confid={conf._id} data-confname={conf.confName} name="unregExh" onClick={(e) => handleShowConfirm(e)}>Unregister Exhibit</Button>
                    </Col>
                    <Col sm={2}>
                      <Link to={`/edit_exhibit/${conf._id}`} className={location.pathname === `/edit_exhibit/${conf._id}` ? "link active" : "link"}>
                        <Button data-toggle="popover" title="Edit your exhibitor registration" className="button">Edit exhibitor registration</Button>
                      </Link>
                    </Col>
                  </div>}

                {isAuthenticated &&
                  user.email !== conf.ownerEmail &&
                  conf.confCancel === "no" &&
                  urlType !== "details" && urlType !== "schedule" && urlType !== "exhibits" &&
                  cardAttendConf.indexOf(conf._id) >= 0 &&
                  <div>
                    {conf.confType === "Live"
                      ? <Col sm={2}></Col>
                      : <Col sm={7}></Col>}
                    <Col sm={2}>
                      <Button data-toggle="popover" title="Unregister attendee from this conference" className="button" data-confid={conf._id} data-confname={conf.confName} name="unregAtt" onClick={(e) => handleShowConfirm(e)}>Unregister Attendee</Button>
                    </Col>
                    <Col sm={2}>
                      <Link to={`/register_edit/${conf._id}`} className={location.pathname === `/register_edit/${conf._id}` ? "link active" : "link"}>
                        <Button data-toggle="popover" title="Edit your attendee registration" className="button">Edit attendee registration</Button>
                      </Link>
                    </Col>
                  </div>}

                {isAuthenticated &&
                  user.email !== conf.ownerEmail &&
                  conf.confType === "Live" &&
                  conf.confCancel === "no" &&
                  urlType !== "details" && urlType !== "schedule" && urlType !== "exhibits" &&
                  cardExhibitConf.indexOf(conf._id) < 0 &&
                  <div>
                    <Col sm={1}></Col>
                    <Col sm={2}>
                      <Link to={`/register_exhibit/${conf._id}`} className={location.pathname === `/register_exhibit/${conf._id}` ? "link active" : "link"}>
                        <Button data-toggle="popover" title="Register to exhibit at this conference" className="button">Register as Exhibitor</Button>
                      </Link>
                    </Col>
                  </div>}

                {isAuthenticated &&
                  user.email !== conf.ownerEmail &&
                  conf.confCancel === "no" &&
                  urlType !== "details" && urlType !== "schedule" && urlType !== "exhibits" &&
                  cardAttendConf.indexOf(conf._id) < 0 &&
                  <div>
                    {conf.confType === "Live"
                      ? (cardExhibitConf.indexOf(conf._id) < 0
                        ? <Col sm={4}></Col>
                        : <Col sm={2}></Col>)
                      : <Col sm={7}></Col>}
                    <Col sm={3}>
                      <Link to={`/register_attend/${conf._id}`} className={location.pathname === `/register_attend/${conf._id}` ? "link active" : "link"}>
                        <Button data-toggle="popover" title="Register for this conference" className="button">Register as Attendee</Button>
                      </Link>
                    </Col>
                    <Col sm={1}></Col>
                  </div>}

              </Row>
            </Card.Body>

            {/* Will need to add deletesess={() => handleSessDelete(sess._id)}? Or only from sessionCard? */}
            <ConfirmModal btnname={btnName} confname={thisName} urlid={confId} cancelconf={() => handleConfCancel(thisId)} unregatt={() => handleAttUnreg(thisId, user.email)} unregexh={() => handleExhUnreg(thisId, user.email)} show={showConfirm === (conf._id && btnName)} hide={(e) => handleHideConfirm(e)} />

            <SuccessModal conference={conf} confname={thisName} confid={conf._id} urlid={confId} urltype={urlType} btnname={btnName} show={props.showSuccess === (conf._id && btnName)} hide={(e) => handleHideSuccess(e)} />

            <ErrorModal conference={conf} urlid={confId} urltype={urlType} errmsg={errThrown} btnname={btnName} show={showErr === (conf._id && btnName)} hide={(e) => handleHideErr(e)} />

          </Card>

        ))
      }
    </>
  )

}

export default ConferenceCard;