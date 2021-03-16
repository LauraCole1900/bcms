import React, { useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Card, Row, Col, Button, Image } from "react-bootstrap";
import Moment from "react-moment";
import { AttendeeAPI, ConferenceAPI, ExhibitorAPI } from "../../utils/api";
import { ConfirmModal, ErrorModal, SuccessModal } from "../modals";
import "./style.css";

// Figure out how to add the keynote speaker???

const ConferenceCard = ({ conference }) => {
  const { user, isAuthenticated } = useAuth0();
  const history = useHistory();
  const location = useLocation();
  const [cardAttendConf, setCardAttendConf] = useState([]);
  const [cardExhibitConf, setCardExhibitConf] = useState([]);
  const [cardRender, setCardRender] = useState(false);

  // Determines which page user is on, specifically for use with URLs that include the conference ID
  const urlArray = window.location.href.split("/")
  const urlType = urlArray[urlArray.length - 2]

  // Handles click on delete button
  function handleDelete(confId) {
    console.log("from confCard", confId)
    ConferenceAPI.deleteConference(confId)
      .then(history.push("/deleted"))
      .catch(err => console.log(err))
  };

  useEffect(() => {
    if (isAuthenticated) {
      console.log(user.email)
      // Retrieves conferences user is registered for to determine whether register or unregister button should render
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
  }, [])

  return (
    <>
      {(cardRender === true) &&
        conference.map(conf => (
          <Card className="infoCard" key={conf._id}>
            <Card.Header className="cardTitle">
              <Row>
                <Col sm={11}>
                  <h2>{conf.confName}</h2>
                  <p className="org">Presented by {conf.confOrg}</p>
                </Col>
                <Col sm={1}>
                  {isAuthenticated &&
                    (user.email === conf.creatorEmail) &&
                    <Button data-toggle="popover" title="Delete this conference" className="deletebtn" id="confDelete" onClick={() => handleDelete(conf._id)}>
                      <Image fluid="true" src="/images/trash-can.png" className="delete" alt="Delete" />
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
                  {conf.numDays === 1
                    ? <div><Row><p>When: <Moment format="ddd, D MMM YYYY" withTitle>{conf.startDate}</Moment> @{conf.confStartTime} - {conf.confEndTime}</p></Row></div>
                    : <div><Row><p>When: <Moment format="ddd, D MMM YYYY" withTitle>{conf.startDate}</Moment> @{conf.confStartTime} - <Moment format="ddd, D MMM YYYY" withTitle>{conf.endDate}</Moment> @{conf.confEndTime}</p></Row></div>}
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
                  {urlType !== "details" &&
                    <Row>
                      <Col sm={4}>
                        <Link to={`/details/${conf._id}`} className={location.pathname === `/details/${conf._id}` ? "link active" : "link"}>
                          <Button data-toggle="popover" title="View conference details" className="button">View details</Button>
                        </Link>
                      </Col>
                    </Row>}
                </Col>
              </Row>
              {isAuthenticated &&
                (user.email === conf.creatorEmail || conf.confAdmins.includes(user.email)) &&
                <Row>
                  <Col sm={1}></Col>
                  <Col sm={1}>
                    <Link to={`/attendees/${conf._id}`} className={location.pathname === `/attendees/${conf._id}` ? "link active" : "link"}>
                      <Button data-toggle="popover" title="View conference attendees" className="button">Attendees</Button>
                    </Link>
                  </Col>
                  <Col sm={1}>
                    <Link to={`/exhibitors/${conf._id}`} className={location.pathname === `/exhibitors/${conf._id}` ? "link active" : "link"}>
                      <Button data-toggle="popover" title="View conference exhibitors" className="button">Exhibitors</Button>
                    </Link>
                  </Col>
                  <Col sm={1}>
                    <Link to={`/presenters/${conf._id}`} className={location.pathname === `/presenters/${conf._id}` ? "link active" : "link"}>
                      <Button data-toggle="popover" title="View conference presenters" className="button">Presenters</Button>
                    </Link>
                  </Col>
                  <Col sm={1}></Col>
                  <Col sm={2}>
                    <Link to={`/edit_conference/${conf._id}`} className={location.pathname === `/edit_conference/${conf._id}` ? "link active" : "link"}>
                      <Button data-toggle="popover" title="Edit this conference" className="button">Edit Conference</Button>
                    </Link>
                  </Col>
                  <Col sm={2}>
                    <Link to={`/edit_schedule/${conf._id}`} className={location.pathname === `/edit_schedule/${conf._id}`}>
                      <Button data-toggle="popover" title="Edit conference schedule" className="button">Edit Schedule</Button>
                    </Link>
                  </Col>
                  <Col sm={2}>
                    <Link to={`/new_session/${conf._id}`} className={location.pathname === `/new_session/${conf._id}`}>
                      <Button data-toggle="popover" title="Add a session" className="button">Add Session</Button>
                    </Link>
                  </Col>
                </Row>}

              <Row>
                {isAuthenticated &&
                  conf.confType === "Live" &&
                  cardExhibitConf.indexOf(conf._id) >= 0 &&
                  <div>
                    <Col sm={1}></Col>
                    <Col sm={2}>
                      <Link to={`/unregister_exhibit_confirm/${conf._id}`} className={location.pathname === `/unregister_exhibit_confirm/${conf._id}` ? "link active" : "link"}>
                        <Button data-toggle="popover" title="Unregister exhibit from this conference" className="button" id="unregExh">Unregister Exhibit</Button>
                      </Link>
                    </Col>
                    <Col sm={2}>
                      <Link to={`/edit_exhibit/${conf._id}`} className={location.pathname === `/edit_exhibit/${conf._id}` ? "link active" : "link"}>
                        <Button data-toggle="popover" title="Edit your exhibitor registration" className="button">Edit exhibitor registration</Button>
                      </Link>
                    </Col>
                  </div>}

                {isAuthenticated &&
                  user.email !== conf.creatorEmail &&
                  cardAttendConf.indexOf(conf._id) >= 0 &&
                  <div>
                    {conf.confType === "Live"
                      ? <Col sm={2}></Col>
                      : <Col sm={7}></Col>}
                    <Col sm={2}>
                      <Link to={`/unregister_confirm/${conf._id}`} className={location.pathname === `/unregister_confirm/${conf._id}` ? "link active" : "link"}>
                        <Button data-toggle="popover" title="Unregister attendee from this conference" className="button" id="unregAtt">Unregister Attendee</Button>
                      </Link>
                    </Col>
                    <Col sm={2}>
                      <Link to={`/register_edit/${conf._id}`} className={location.pathname === `/register_edit/${conf._id}` ? "link active" : "link"}>
                        <Button data-toggle="popover" title="Edit your attendee registration" className="button">Edit attendee registration</Button>
                      </Link>
                    </Col>
                  </div>}

                {isAuthenticated &&
                  user.email !== conf.creatorEmail &&
                  conf.confType === "Live" &&
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
                  user.email !== conf.creatorEmail &&
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
          </Card>
        ))
      }
    </>
  )

}

export default ConferenceCard;