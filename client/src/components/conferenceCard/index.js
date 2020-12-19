import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Card, Row, Col, Button, Image } from "react-bootstrap";
// import Moment from "react-moment";
import API from "../../utils/api";

function Conference(conference) {
  const { user, isAuthenticated } = useAuth0();
  const history = useHistory();

  function handleRegister(confId) {
    const email = { email: user.email }
    API.updateConferenceAttendees(confId, email).then(
      history.push(`/register_attend/${confId}`)
    )
  }

  function handleDelete(confId) {
    console.log("from confCard", confId)
    API.deleteConference(confId).then(
      history.push("/deleted")
    )
  };

  return (
    <>
      <Card className="confCard">
        <Card.Header className="confTitle">
          <Row>
            <Col sm={10}>
              <h2>{conference.confName}</h2>
            </Col>
            <Col sm={2}>
              <Button data-toggle="popover" title="Delete this conference" onClick={() => handleDelete(conference._id)}>
                <Image fluid src="images/trash-can.png" className="delete" alt="Delete" />
              </Button>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col sm={8}>
              <Card.Text>Presented by {conference.confOrg}</Card.Text>
              <Card.Text>{conference.confDesc}</Card.Text>
            </Col>
            <Col sm={4}>
              <Row>{conference.startDate} - {conference.endDate}</Row>
              <Row>{conference.confStartTime} - {conference.confEndTime}</Row>
              <Row>{conference.confType}</Row>
              <Row>{conference.confLoc}</Row>
              <Row>
                <Link to={{
                  state: { confInfo: conference },
                  pathname: `/conferences/${conference._id}`
                }}>
                  <Button data-toggle="popover" title="Details">View details</Button>
                </Link>
              </Row>
            </Col>
          </Row>
          <Row>
            {user.email === conference.creatorEmail &&
              <div>
                <Col sm={4}>
                  <Link to={{
                    state: { confInfo: conference },
                    pathname: `/edit_conference/${conference._id}`
                  }}>
                    <Button data-toggle="popover" title="Edit this conference">Edit</Button>
                  </Link>
                </Col>
                <Col sm={4}>
                  <Link to={{
                    state: { confInfo: conference },
                    pathname: `/add_session/${conference._id}`
                  }}>
                    <Button data-toggle="popover" title="Add Session">Add Session</Button>
                  </Link>
                </Col>
              </div>}
            {user.email !== conference.creatorEmail &&
              isAuthenticated &&
              user.find(user => user.email !== conference.confAttendees) &&
              <div>
                <Col sm={4}></Col>
                <Col sm={4}>
                  <Button data-toggle="popover" title="Register" onClick={handleRegister}>Register</Button>
                </Col>
              </div>}
          </Row>
        </Card.Body>
      </Card>
    </>
  )

}

export default Conference;