import React, { useEffect, useState } from "react";
import { useHistory, useLocation, Link } from "react-router-dom";
import { Card, Row, Col, Button, Image } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import Moment from "react-moment";
import { ConferenceAPI, PresenterAPI, SessionAPI } from "../../utils/api";
import { ConfirmModal, ErrorModal, SuccessModal } from "../modals";
import "./style.css";

const SessionCard = (props) => {
  const { user, isAuthenticated } = useAuth0();
  const history = useHistory();
  const location = useLocation();
  const [cardRender, setCardRender] = useState(false);
  const [confReady, setConfReady] = useState(false);
  const [conference, setConference] = useState();
  const [presenters, setPresenters] = useState();
  const [presNames, setPresNames] = useState([]);
  const [presOrgs, setPresOrgs] = useState([]);
  const [errThrown, setErrThrown] = useState();
  const [btnName, setBtnName] = useState("");
  const [thisId, setThisId] = useState();
  const [thisName, setThisName] = useState();
  const presEmailArr = props.session.sessPresEmails;
  let presObj = [];
  let names = [];

  // Determines which page user is on, specifically for use with URLs that include the conference ID
  const urlArray = window.location.href.split("/")
  const urlId = urlArray[urlArray.length - 1]
  const urlType = urlArray[urlArray.length - 2]

  // Modal variables
  const [showConfirm, setShowConfirm] = useState(0);
  const [showSuccess, setShowSuccess] = useState(0);
  const [showErr, setShowErr] = useState(0);

  // Sets boolean to show or hide relevant modal
  const handleShowConfirm = (e) => {
    console.log(e.target.name, e.target.dataset.sessid, e.target.dataset.sessname);
    setShowConfirm(e.target.dataset.sessid);
    setBtnName(e.target.name);
    setThisId(e.target.dataset.sessid);
    setThisName(e.target.dataset.sessname);
  }
  const handleHideConfirm = () => setShowConfirm(0);
  const handleShowSuccess = () => setShowSuccess(thisId);
  const handleHideSuccess = () => setShowSuccess(0);
  const handleShowErr = () => setShowErr(thisId);
  const handleHideErr = () => setShowErr(0);

  // Handles click on "Yes, delete" button on Confirm modal
  const handleSessDelete = (sessId) => {
    console.log("from sessCard handleSessDelete", sessId)
    handleHideConfirm();
    // ==================== Will need to delete sessId from each presenters' sessId[] ====================
    SessionAPI.deleteSession(sessId)
      .then(res => {
        // If no errors thrown, show Success modal
        if (!res.err) {
          handleShowSuccess();
        }
      })
      .catch(err => {
        console.log(err)
        setErrThrown(err.message);
        handleShowErr();
      })
  };

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

  // GETs Presenter by email
  // Maps through session.sessPresEmails[]
  // For each, GETs presenter document with matching email and confId
  // Maps through presenter document to get presenter.presGivenName + presenter.presFamilyName
  // Throws that into array
  // Renders array to card
  const fetchPres = async (arr, id) => {
    await arr.forEach(email => {
      PresenterAPI.getPresenterByEmail(email, id)
        .then(resp => {
          presObj = [...presObj, resp.data]
          if (presObj.length === arr.length) {
            names = presObj.map(presObj => presObj.presGivenName + " " + presObj.presFamilyName)
            console.log({ names })
            setPresNames(names)
          }
        })
    })
  }

  useEffect(() => {
    if (props.session.length > 0) {
      fetchConf(urlId);
      setCardRender(true)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.session])


  return (
    <>
      { cardRender === true &&
        confReady === true &&
        props.session.map(sess => (
          <Card className="infoCard" key={sess._id}>
            {sess.sessKeynote === "yes" &&
              <Card.Header className="cardTitleKeynote">
                <Row>
                  <Col sm={2}>
                    <h3>&nbsp;Keynote:</h3>
                  </Col>
                  <Col sm={9}>
                    <h2>{sess.sessName}</h2>
                    <p>{sess.sessPresNames.join(", ")}</p>
                    <p>{sess.sessPresOrgs.join(", ")}</p>
                  </Col>
                  <Col sm={1}>
                    {isAuthenticated &&
                      (user.email === props.conference[0].ownerEmail || props.conference[0].confAdmins.includes(user.email)) &&
                      <Button data-toggle="popover" title="Delete this session" className="deletebtn" data-sessid={sess._id} data-sessname={sess.name} name="sessDelete" onClick={(e) => handleShowConfirm(e)}>
                        <Image fluid="true" src="/images/trash-can.png" className="delete" alt="Delete session" data-sessid={sess._id} data-sessname={sess.name} name="sessDelete" />
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
                    <h2>{sess.sessName}</h2>
                    <p>{sess.sessPresNames.join(", ")}</p>
                    <p>{sess.sessPresOrgs.join(", ")}</p>
                  </Col>
                  <Col sm={1}>
                    {isAuthenticated &&
                      (user.email === props.conference[0].ownerEmail || props.conference[0].confAdmins.includes(user.email)) &&
                      <Button data-toggle="popover" title="Delete this session" className="deletebtn" data-sessid={sess._id} data-sessname={sess.name} name="sessDelete" onClick={(e) => handleShowConfirm(e)}>
                        <Image fluid="true" src="/images/trash-can.png" className="delete" alt="Delete session" data-sessid={sess._id} data-sessname={sess.name} name="sessDelete" />
                      </Button>}
                  </Col>
                </Row>
              </Card.Header>}
            {sess.sessKeynote === "no" && sess.sessPanel === "no" &&
              <Card.Header className="cardTitle">
                <Row>
                  <Col sm={11}>
                    <h2>{sess.sessName}</h2>
                    <p>{sess.sessPresNames.join(", ")}</p>
                    <p>{sess.sessPresOrgs.join(", ")}</p>
                  </Col>
                  <Col sm={1}>
                    {isAuthenticated &&
                      (user.email === props.conference[0].ownerEmail || props.conference[0].confAdmins.includes(user.email)) &&
                      <Button data-toggle="popover" title="Delete this session" className="deletebtn" data-sessid={sess._id} data-sessname={sess.name} name="sessDelete" onClick={(e) => handleShowConfirm(e)}>
                        <Image fluid="true" src="/images/trash-can.png" className="delete" alt="Delete session" data-sessid={sess._id} data-sessname={sess.name} name="sessDelete" />
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
                  <Row><p>Time: {sess.sessStart} - {sess.sessEnd}</p></Row>
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

            <ConfirmModal btnname={btnName} confname={thisName} urlid={urlId} urltype={urlType} deletesess={() => handleSessDelete(thisId)} show={showConfirm === sess._id} hide={(e) => handleHideConfirm(e)} />

            <SuccessModal session={sess} confname={conference.confName} urlid={urlId} urltype={urlType} btnname={btnName} show={showSuccess === sess._id} hide={(e) => handleHideSuccess(e)} />

            <ErrorModal session={sess} urlid={urlId} urltype={urlType} errmsg={errThrown} btnname={btnName} show={showErr === sess._id} hide={(e) => handleHideErr(e)} />

          </Card >
        ))}
    </>
  )
}

export default SessionCard;