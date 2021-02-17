import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Card, Row, Col, Button, Image } from "react-bootstrap";
import Moment from "react-moment";
import { AttendeeAPI, ConferenceAPI } from "../../utils/api";
import "./style.css";

function Conference({ conference }) {
  const { user, isAuthenticated } = useAuth0();
  const history = useHistory();
  const [cardAttendConf, setCardAttendConf] = useState([]);
  const [cardRender, setCardRender] = useState(false);

  function handleDelete(confId) {
    console.log("from confCard", confId)
    ConferenceAPI.deleteConference(confId)
      .then(history.push("/deleted"))
      .catch(err => console.log(err))
  };

  useEffect(() => {
    if (isAuthenticated) {
      console.log(user.email)
      AttendeeAPI.getConferencesAttending(user.email)
        .then(resp => {
          const cardAttArr = resp.data
          const cardAttIds = cardAttArr.map(cardAttArr => cardAttArr.confId)
          setCardAttendConf(cardAttIds);
        })
        .catch(err => console.log(err));
    }
    setCardRender(true);
  }, [])

  return (
    <>
      {(cardRender === true) &&
        conference.map(conf => (
          <Card className="confCard" key={conf._id}>
            <Card.Header className="confTitle">
              <Row>
                <Col sm={11}>
                  <h2>{conf.confName}</h2>
                  <p className="org">Presented by {conf.confOrg}</p>
                </Col>
                <Col sm={1}>
                  {isAuthenticated &&
                    (user.email === conf.creatorEmail) &&
                    <Button data-toggle="popover" title="Delete this conference" className="deletebtn" onClick={() => handleDelete(conf._id)}>
                      <Image fluid src="/images/trash-can.png" className="delete" alt="Delete" />
                    </Button>}
                </Col>
              </Row>
            </Card.Header>
            <Card.Body className="cardBody">
              <Row>
                <Col sm={8}>
                  {(conf.confWaiver === "yes") &&
                    <div className="alert">
                      <h5>A signed liability waiver will be required to participate in this event. It will be available at check-in to the event.</h5>
                    </div>}
                  <Card.Text>{conf.confDesc}</Card.Text>
                </Col>
                <Col sm={4} className="vitals">
                  {conf.numDays === 1
                    ? <div><Row><p>When: <Moment format="ddd, D MMM YYYY" withTitle>{conf.startDate}</Moment> @{conf.confStartTime} - {conf.confEndTime}</p></Row></div>
                    : <div><Row><p>When: <Moment format="ddd, D MMM YYYY" withTitle>{conf.startDate}</Moment> @{conf.confStartTime} - <Moment format="ddd, D MMM YYYY" withTitle>{conf.endDate}</Moment> @{conf.confEndTime}</p></Row></div>}
                  {/* <Row><p>Times: {conf.confStartTime} - {conf.confEndTime}</p></Row> */}
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
                  <Row>
                    <Col sm={4}>
                      <Link to={{
                        state: { confInfo: conference },
                        pathname: `/details/${conf._id}`
                      }}>
                        <Button data-toggle="popover" title="View conference details" className="button">View details</Button>
                      </Link>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                {isAuthenticated &&
                  (user.email === conf.creatorEmail || conf.confAdmins.includes(user.email)) &&
                  <div>
                    <Col sm={1}></Col>
                    <Col sm={1}>
                      <Link to={{
                        state: { confInfo: conference },
                        pathname: `/attendees/${conf._id}`
                      }}>
                        <Button data-toggle="popover" title="View conference attendees" className="button">Attendees</Button>
                      </Link>
                    </Col>
                    <Col sm={1}>
                      <Link to={{
                        state: { confInfo: conference },
                        pathname: `/exhibitors/${conf._id}`
                      }}>
                        <Button data-toggle="popover" title="View conference exhibitors" className="button">Exhibitors</Button>
                      </Link>
                    </Col>
                    <Col sm={1}>
                      <Link to={{
                        state: { confInfo: conference },
                        pathname: `/presenters/${conf._id}`
                      }}>
                        <Button data-toggle="popover" title="View conference presenters" className="button">Presenters</Button>
                      </Link>
                    </Col>
                    <Col sm={1}></Col>
                    <Col sm={1}>
                      <Link to={{
                        state: { confInfo: conference },
                        pathname: `/edit_conference/${conf._id}`
                      }}>
                        <Button data-toggle="popover" title="Edit this conference" className="button">Edit</Button>
                      </Link>
                    </Col>
                    <Col sm={1}>
                      <Link to={{
                        state: { confInfo: conference },
                        pathname: `/edit_schedule/${conf._id}`
                      }}>
                        <Button data-toggle="popover" title="Edit conference schedule" className="button">Edit Schedule</Button>
                      </Link>
                    </Col>
                  </div>}

                {isAuthenticated &&
                  user.email !== conf.creatorEmail &&
                  cardAttendConf.indexOf(conf._id) >= 0 &&
                  <div>
                    <Col sm={4}></Col>
                    <Col sm={1}>
                      <Link to={{
                        state: { confInfo: conference },
                        pathname: `/unregister_confirm/${conf._id}`
                      }}>
                        <Button data-toggle="popover" title="Unregister from this conference" className="button">Unregister</Button>
                      </Link>
                    </Col>
                    <Col sm={1}>
                      <Link to={{
                        state: { confInfo: conference },
                        pathname: `/register_edit/${conf._id}`
                      }}>
                        <Button data-toggle="popover" title="Edit your registration information" className="button">Edit registration</Button>
                      </Link>
                    </Col>
                  </div>}

                {isAuthenticated &&
                  user.email !== conf.creatorEmail &&
                  cardAttendConf.indexOf(conf._id) < 0 &&
                  <div>
                    <Col sm={4}></Col>
                    <Col sm={4}>
                      <Link to={{
                        state: { confInfo: conference },
                        pathname: `/register_attend/${conf._id}`
                      }}>
                        <Button data-toggle="popover" title="Register for this conference" className="button">Register</Button>
                      </Link>
                    </Col>
                  </div>}
              </Row>
            </Card.Body>
          </Card>
        ))
      }
    </>
  )

}

export default Conference;