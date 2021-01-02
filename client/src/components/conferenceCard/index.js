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
    ).catch(err => console.log(err))
  }

  function handleDelete(confId) {
    console.log("from confCard", confId)
    ConferenceAPI.deleteConference(confId).then(
      history.push("/deleted")
    ).catch(err => console.log(err))
  };

  return (
    <>
      {conference.map(e => (
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
                <Card.Text>{e.confDesc}</Card.Text>
              </Col>
              <Col sm={4}>
                <Row><p>Dates: {e.startDate} - {e.endDate}</p></Row>
                <Row><p>Times: {e.confStartTime} - {e.confEndTime}</p></Row>
                <Row><p>{e.confType}</p></Row>
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
                    <p><a href={e.confLocUrl} rel="noreferrer noopener" target="_blank">Venue's website</a></p>
                  </Row>}
                <Row>
                  <Link to={{
                    state: { confInfo: conference },
                    pathname: `/conferences/${e._id}`
                  }}>
                    <Button data-toggle="popover" title="Details" className="button">View details</Button>
                  </Link>
                </Row>
              </Col>
            </Row>
            <Row>
              {isAuthenticated &&
                user.email === e.creatorEmail &&
                <div>
                  <Col sm={5}></Col>
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
                      <Button data-toggle="popover" title="Add Session" className="button">Add Session</Button>
                    </Link>
                  </Col>
                </div>}
              {isAuthenticated &&
                user.email !== e.creatorEmail &&
                // user.find(user => user.email !== e.confAttendees) &&
                <div>
                  <Col sm={4}></Col>
                  <Col sm={4}>
                    <Button data-toggle="popover" title="Register" className="button" onClick={handleRegister}>Register</Button>
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