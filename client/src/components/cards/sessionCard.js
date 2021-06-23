import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Card, Row, Col, Button, Image } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import Moment from "react-moment";
import { PresenterAPI, SessionAPI } from "../../utils/api";
import { ConfirmModal, ErrorModal, SuccessModal } from "../modals";
import "./style.css";

const SessionCard = (props) => {
  const { user, isAuthenticated } = useAuth0();
  const location = useLocation();
  const [errThrown, setErrThrown] = useState();
  const [btnName, setBtnName] = useState("");
  const [thisId, setThisId] = useState();
  const [thisName, setThisName] = useState();
  const presEmailArr = props.session.sessPresEmails;
  let nameArr = [];
  let orgArr = [];

  // Determines which page user is on, specifically for use with URLs that include the conference ID
  const urlArray = window.location.href.split("/")
  const urlId = urlArray[urlArray.length - 1]
  const urlType = urlArray[urlArray.length - 2]

  // Modal variables
  const [showConfirm, setShowConfirm] = useState(0);
  const [showErr, setShowErr] = useState(0);

  // Sets boolean to show or hide relevant modal
  const handleShowConfirm = (e) => {
    const { dataset, name } = e.target;
    console.log(name, dataset.sessid, dataset.sessname);
    setShowConfirm(dataset.sessid);
    setBtnName(name);
    setThisId(dataset.sessid);
    setThisName(dataset.sessname);
  }
  const handleHideConfirm = () => setShowConfirm(0);
  const handleShowSuccess = () => props.setShowSuccess(thisId);
  const handleHideSuccess = () => {
    props.setShowSuccess(0);
    props.change();
  }
  const handleShowErr = () => setShowErr(thisId);
  const handleHideErr = () => {
    setShowErr(0);
    props.change();
  }

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

  // Handles click on "Yes, delete" button on Confirm modal
  const handleSessDelete = (sessId) => {
    console.log("from sessCard handleSessDelete", sessId)
    handleHideConfirm();
    // Deletes sessId from each presenters' sessId[]
    const thesePres = props.presenter.filter(pres => pres.presSessionIds.includes(sessId))
    const presSessions = thesePres.map(pres => pres.presSessionIds.filter(id => id !== sessId))
    console.log("from sessCard handleSessDelete presSessions", presSessions);
    thesePres.forEach(pres => {
      if (presSessions[0].length > 0) {
        PresenterAPI.updatePresenterByEmail({ ...pres, presSessionIds: presSessions[0] }, pres.presEmail, pres.confId)
      } else {
        PresenterAPI.deletePresenterByEmail(pres.presEmail, pres.confId)
      }
    })
    // Deletes session from DB
    SessionAPI.deleteSession(sessId)
      .then(resp => {
        // If no errors thrown, show Success modal
        if (!resp.err) {
          handleShowSuccess();
        }
      })
      .catch(err => {
        console.log(err)
        setErrThrown(err.message);
        handleShowErr();
      })
  };

  // Filters props.presenter by sessId, then maps through the result to pull out presenter names
  const fetchPresNames = (sessId) => {
    const thesePres = props.presenter.filter(pres => pres.presSessionIds.includes(sessId))
    const presName = thesePres.map(pres => pres.presGivenName + " " + pres.presFamilyName)
    nameArr = [presName.join(", ")]
    return nameArr;
  }

  // Filters props.presenter by sessId, then maps through the result to put out presenter organizations
  const fetchPresOrgs = (sessId) => {
    const thesePres = props.presenter.filter(pres => pres.presSessionIds.includes(sessId))
    const presOrg = thesePres.map(pres => pres.presOrg)
    orgArr = [...new Set(presOrg)]
    return orgArr;
  }


  return (
    <>
      {props.session.map(sess => (
        <Card className="infoCard" key={sess._id}>
          {sess.sessKeynote === "yes" &&
            <Card.Header className="cardTitleKeynote">
              <Row>
                <Col sm={2}>
                  <h3>&nbsp;Keynote:</h3>
                </Col>
                <Col sm={9}>
                  <h2 className="title">{sess.sessName}</h2>
                  <p>{fetchPresNames(sess._id)}</p>
                  <p>{fetchPresOrgs(sess._id)}</p>
                </Col>
                <Col sm={1}>
                  {isAuthenticated &&
                    urlType !== "schedule" &&
                    (user.email === props.conference[0].ownerEmail || props.conference[0].confAdmins.includes(user.email)) &&
                    <Button data-toggle="popover" title="Delete this session" className="deletebtn" data-sessid={sess._id} data-sessname={sess.name} name="sessDelete" onClick={(e) => handleShowConfirm(e)}>
                      <Image fluid="true" src="/images/trash-can.png" className="delete" alt="Delete session" data-sessid={sess._id} data-sessname={sess.name} name="sessDelete" />
                    </Button>}
                  {urlType === "schedule" &&
                    <Button data-toggle="popover" title="Close" className="button closeBtn" onClick={props.hide}>
                      <Image fluid="true" src="/images/close-icon-2.png" className="button close" alt="Close" />
                    </Button>}
                </Col>
              </Row>
            </Card.Header>}
          {sess.sessPanel === "yes" &&
            <Card.Header className="cardTitle">
              <Row>
                <Col sm={2}>
                  <h3>&nbsp;Panel:</h3>
                </Col>
                <Col sm={9}>
                  <h2 className="title">{sess.sessName}</h2>
                  <p>{fetchPresNames(sess._id)}</p>
                  <p>{fetchPresOrgs(sess._id)}</p>
                </Col>
                <Col sm={1}>
                  {isAuthenticated &&
                    urlType !== "schedule" &&
                    (user.email === props.conference[0].ownerEmail || props.conference[0].confAdmins.includes(user.email)) &&
                    <Button data-toggle="popover" title="Delete this session" className="deletebtn" data-sessid={sess._id} data-sessname={sess.name} name="sessDelete" onClick={(e) => handleShowConfirm(e)}>
                      <Image fluid="true" src="/images/trash-can.png" className="delete" alt="Delete session" data-sessid={sess._id} data-sessname={sess.name} name="sessDelete" />
                    </Button>}
                  {urlType === "schedule" &&
                    <Button data-toggle="popover" title="Close" className="button closeBtn" onClick={props.hide}>
                      <Image fluid="true" src="/images/close-icon-2.png" className="button close" alt="Close" />
                    </Button>}
                </Col>
              </Row>
            </Card.Header>}
          {sess.sessKeynote === "no" && sess.sessPanel === "no" &&
            <Card.Header className="cardTitle">
              <Row>
                <Col sm={11}>
                  <h2 className="title">{sess.sessName}</h2>
                  <p>{fetchPresNames(sess._id)}</p>
                  <p>{fetchPresOrgs(sess._id)}</p>
                </Col>
                <Col sm={1}>
                  {isAuthenticated &&
                    urlType !== "schedule" &&
                    (user.email === props.conference[0].ownerEmail || props.conference[0].confAdmins.includes(user.email)) &&
                    <Button data-toggle="popover" title="Delete this session" className="deletebtn" data-sessid={sess._id} data-sessname={sess.name} name="sessDelete" onClick={(e) => handleShowConfirm(e)}>
                      <Image fluid="true" src="/images/trash-can.png" className="delete" alt="Delete session" data-sessid={sess._id} data-sessname={sess.name} name="sessDelete" />
                    </Button>}
                  {urlType === "schedule" &&
                    <Button data-toggle="popover" title="Close" className="button closeBtn" onClick={props.hide}>
                      <Image fluid="true" src="/images/close-icon-2.png" className="button close" alt="Close" />
                    </Button>}
                </Col>
              </Row>
            </Card.Header>}
          <Card.Body className="infoCardBody">
            <Row>
              <Col sm={8}>
                <Card.Text>{sess.sessDesc}</Card.Text>
              </Col>
              <Col sm={4}>
                <Row><p>Date: <Moment format="ddd, D MMM YYYY" withTitle>{sess.sessDate}</Moment></p></Row>
                <Row><p>Time: {parseTime(sess.sessStart)} - {parseTime(sess.sessEnd)}</p></Row>
                {props.conference[0].confType === "Live" &&
                  <Row><p>Location: {sess.sessRoom}</p></Row>}
              </Col>
            </Row>
            {isAuthenticated &&
              (user.email === props.conference[0].ownerEmail || props.conference[0].confAdmins.includes(user.email)) &&
              <Row>
                <Col sm={1}></Col>
                <Col sm={5}>
                  <Link to={`/edit_session/${sess._id}`} className={location.pathname === `/edit_session/${sess._id}` ? "link active" : "link"}>
                    <Button data-toggle="popover" title="Edit session" className="button">Edit Session</Button>
                  </Link>
                </Col>
              </Row>}
          </Card.Body>

          {urlType !== "schedule" &&
            <>
              <ConfirmModal btnname={btnName} confname={thisName} urlid={urlId} urltype={urlType} deletesess={() => handleSessDelete(thisId)} show={showConfirm === sess._id} hide={(e) => handleHideConfirm(e)} />

              <SuccessModal session={sess} confname={props.conference[0].confName} urlid={urlId} urltype={urlType} btnname={btnName} show={props.showSuccess === sess._id} hide={(e) => handleHideSuccess(e)} />

              <ErrorModal session={sess} urlid={urlId} urltype={urlType} errmsg={errThrown} btnname={btnName} show={showErr === sess._id} hide={(e) => handleHideErr(e)} />
            </>}

        </Card >
      ))}
    </>
  )
}

export default SessionCard;