import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Card, Row, Col, Button, Image } from "react-bootstrap";
// import Moment from "react-moment";
import { AttendeeAPI, ConferenceAPI } from "../../utils/api";
import "./style.css";

function Conference({ conference }) {
  const { user, isAuthenticated } = useAuth0();
  const history = useHistory();
  const [cardAttendConf, setCardAttendConf] = useState([]);
  const [cardRender, setCardRender] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      AttendeeAPI.getConferencesAttending(user.email)
        .then(resp => {
          console.log("confCard getConfAttending resp.data", resp.data)
          const cardAttArr = resp.data
          console.log("from confCard cardAttArr", cardAttArr)
          const cardAttIds = cardAttArr.map(cardAttArr => cardAttArr.confId)
          console.log("from confCard cardAttIds", cardAttIds)
          setCardAttendConf(cardAttIds);
          console.log("from confCard cardAttendConf", cardAttendConf)
        })
        .catch(err => console.log(err));
    }
    setCardRender(true);
  }, [])

  function handleDelete(confId) {
    console.log("from confCard", confId)
    ConferenceAPI.deleteConference(confId)
      .then(history.push("/deleted"))
      .catch(err => console.log(err))
  };

  return (
    <>
      {(cardRender === true) &&
        conference.map(e => (
          <Card className="confCard" key={e._id}>
            <Card.Header className="confTitle">
              <Row>
                <Col sm={11}>
                  <h2>{e.confName}</h2>
                  <p className="org">Presented by {e.confOrg}</p>
                </Col>
                <Col sm={1}>
                  {isAuthenticated &&
                    (user.email === e.creatorEmail) &&
                    <Button data-toggle="popover" title="Delete this conference" className="deletebtn" onClick={() => handleDelete(e._id)}>
                      <Image fluid src="images/trash-can.png" className="delete" alt="Delete" />
                    </Button>}
                </Col>
              </Row>
            </Card.Header>
            <Card.Body className="cardBody">
              <Row>
                <Col sm={8}>
                  {(e.confWaiver === "yes") &&
                    <div className="alert">
                      <h5>A signed liability waiver will be required to participate in this event. It will be available at check-in to the event.</h5>
                    </div>}
                  <Card.Text>{e.confDesc}</Card.Text>
                </Col>
                <Col sm={4} className="vitals">
                  <Row><p>Dates: {e.startDate} - {e.endDate}</p></Row>
                  <Row><p>Times: {e.confStartTime} - {e.confEndTime}</p></Row>
                  <Row><p>Type: {e.confType}</p></Row>
                  <Row>
                    {(e.confType === "Live") &&
                      <p><a href={`https://www.google.com/maps/search/${e.confLoc.replace(" ", "+")}`} rel="noreferrer noopener" target="_blank">{e.confLoc}</a></p>}
                    {(e.confType === "Virtual") &&
                      (e.confLocUrl !== undefined) &&
                      <p><a href={e.confLocUrl} rel="noreferrer noopener" target="_blank">{e.confLoc}</a></p>}
                    {(e.confType === "Virtual") &&
                      (e.confLocUrl === undefined) &&
                      <p>{e.confLoc}</p>}
                  </Row>
                  {(e.confType === "Live") &&
                    (e.confLocUrl !== undefined) &&
                    <Row>
                      <p><a href={e.confLocUrl} rel="noreferrer noopener" target="_blank">{e.confLocName}</a></p>
                    </Row>}
                  <Row>
                    <Col sm={4}>
                      <Link to={{
                        state: { confInfo: conference },
                        pathname: `/details/${e._id}`
                      }}>
                        <Button data-toggle="popover" title="View conference details" className="button">View details</Button>
                      </Link>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                {isAuthenticated &&
                  user.email === e.creatorEmail &&
                  <div>
                    <Col sm={1}></Col>
                    <Col sm={1}>
                      <Link to={{
                        state: { confInfo: conference },
                        pathname: `/attendees/${e._id}`
                      }}>
                        <Button data-toggle="popover" title="View conference attendees" className="button">Attendees</Button>
                      </Link>
                    </Col>
                    <Col sm={1}>
                      <Link to={{
                        state: { confInfo: conference },
                        pathname: `/exhibitors/${e._id}`
                      }}>
                        <Button data-toggle="popover" title="View conference exhibitors" className="button">Exhibitors</Button>
                      </Link>
                    </Col>
                    <Col sm={1}>
                      <Link to={{
                        state: { confInfo: conference },
                        pathname: `/presenters/${e._id}`
                      }}>
                        <Button data-toggle="popover" title="View conference presenters" className="button">Presenters</Button>
                      </Link>
                    </Col>
                    <Col sm={1}></Col>
                    <Col sm={1}>
                      <Link to={{
                        state: { confInfo: conference },
                        pathname: `/edit_conference/${e._id}`
                      }}>
                        <Button data-toggle="popover" title="Edit this conference" className="button">Edit</Button>
                      </Link>
                    </Col>
                    <Col sm={1}>
                      <Link to={{
                        state: { confInfo: conference },
                        pathname: `/add_session/${e._id}`
                      }}>
                        <Button data-toggle="popover" title="Add a session" className="button">Add Session</Button>
                      </Link>
                    </Col>
                  </div>}

                {isAuthenticated &&
                  user.email !== e.creatorEmail &&
                  cardAttendConf.indexOf(e._id) >= 0 &&
                  <div>
                    <Col sm={4}></Col>
                    <Col sm={1}>
                      <Link to={{
                        state: { confInfo: conference },
                        pathname: `/unregister_confirm/${e._id}`
                      }}>
                        <Button data-toggle="popover" title="Unregister from this conference" className="button">Unregister</Button>
                      </Link>
                    </Col>
                    <Col sm={1}>
                      <Link to={{
                        state: { confInfo: conference },
                        pathname: `/register_edit/${e._id}`
                      }}>
                        <Button data-toggle="popover" title="Edit your registration information" className="button">Edit registration</Button>
                      </Link>
                    </Col>
                  </div>}

                {isAuthenticated &&
                  user.email !== e.creatorEmail &&
                  cardAttendConf.indexOf(e._id) < 0 &&
                  <div>
                    <Col sm={4}></Col>
                    <Col sm={4}>
                      <Link to={{
                        state: { confInfo: conference },
                        pathname: `/register_attend/${e._id}`
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