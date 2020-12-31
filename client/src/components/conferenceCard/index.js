import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Card, Row, Col, Button, Image } from "react-bootstrap";
// import Moment from "react-moment";
import { ConferenceAPI } from "../../utils/api";
import "./style.css";

function Conference({ conference }) {
  const { user, isAuthenticated } = useAuth0();
  const history = useHistory();

  function handleRegister(confId) {
    const email = { email: user.email }
    ConferenceAPI.updateConferenceAttendees(confId, email).then(
      history.push(`/register_attend/${confId}`)
    )
  }

  function handleDelete(confId) {
    console.log("from confCard", confId)
    ConferenceAPI.deleteConference(confId).then(
      history.push("/deleted")
    )
  };

  return (
    <>
      {conference.map(e => (
        <Card className="confCard">
          <Card.Header className="confTitle">
            <Row>
              <Col sm={10}>
                <h2>{e.confName}</h2>
              </Col>
              <Col sm={2}>
                {isAuthenticated &&
                  (user.email === e.creatorEmail) &&
                  <Button data-toggle="popover" title="Delete this conference" onClick={() => handleDelete(e._id)}>
                    <Image fluid src="images/trash-can.png" className="delete" alt="Delete" />
                  </Button>}
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col sm={8}>
                <Card.Text>Presented by {e.confOrg}</Card.Text>
                <Card.Text>{e.confDesc}</Card.Text>
              </Col>
              <Col sm={4}>
                <Row><p>Dates: {e.startDate} - {e.endDate}</p></Row>
                <Row><p>Times: {e.confStartTime} - {e.confEndTime}</p></Row>
                <Row><p>{e.confType}</p></Row>
                <Row>
                  {(e.confType === "live")
                    ? <p><a href={`https://www.google.com/maps/search/${e.confLoc.replace(" ", "+")}`} rel="noreferrer noopener" target="_blank">{e.confLoc}</a></p>
                    : <p><a href={e.confLoc} rel="noreferrer noopener" target="_blank">{e.confLoc}</a></p>}
                </Row>
                {(e.confType === "live") &&
                  <Row>
                    <p><a href={e.confLocUrl} rel="noreferrer noopener" target="_blank">Venue's website</a></p>
                  </Row>}
                <Row>
                  <Link to={{
                    state: { confInfo: conference },
                    pathname: `/conferences/${e._id}`
                  }}>
                    <Button data-toggle="popover" title="Details">View details</Button>
                  </Link>
                </Row>
              </Col>
            </Row>
            <Row>
              {isAuthenticated &&
                user.email === e.creatorEmail &&
                <div>
                  <Col sm={4}>
                    <Link to={{
                      state: { confInfo: conference },
                      pathname: `/edit_conference/${e._id}`
                    }}>
                      <Button data-toggle="popover" title="Edit this conference">Edit</Button>
                    </Link>
                  </Col>
                  <Col sm={4}>
                    <Link to={{
                      state: { confInfo: conference },
                      pathname: `/add_session/${e._id}`
                    }}>
                      <Button data-toggle="popover" title="Add Session">Add Session</Button>
                    </Link>
                  </Col>
                </div>}
              {isAuthenticated &&
                user.email !== e.creatorEmail &&
                user.find(user => user.email !== e.confAttendees) &&
                <div>
                  <Col sm={4}></Col>
                  <Col sm={4}>
                    <Button data-toggle="popover" title="Register" onClick={handleRegister}>Register</Button>
                  </Col>
                </div>}
            </Row>
          </Card.Body>
        </Card>
      ))}
    </>
  )

}

export default Conference;