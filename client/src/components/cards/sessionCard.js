import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Card, Row, Col, Button, Image } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { ConferenceAPI, SessionAPI } from "../../utils/api";
import "./style.css";

const SessionCard = ({ session }) => {
  const { user, isAuthenticated } = useAuth0();
  const history = useHistory();
  const [conference, setConference] = useState();
  const [sessions, setSessions] = useState();
  const [cardRender, setCardRender] = useState(false);

  // Grab conference ID from URL
  const urlArray = window.location.href.split("/");
  const confId = urlArray[urlArray.length - 1];

  // Handles click on delete button
  function handleDelete(sessId) {
    console.log("from sessCard", sessId)
    SessionAPI.deleteSession(sessId)
      .then(history.push("/deleted"))
      .catch(err => console.log(err))
  };

  useEffect(() => {
    // GET call for conference by conference ID
    ConferenceAPI.getConferenceById(confId)
      .then(resp => {
        console.log("from sessCard getConfByID", resp.data)
        setConference(resp.data)
      })
      .catch(err => console.log(err));

    // GET call for sessions by conference ID
    SessionAPI.getSessions(confId)
      .then(resp => {
        console.log("from sessCard getSessions", resp.data)
        setSessions(resp.data)
      })
      .catch(err => console.log(err))
    setCardRender(true)
  }, [confId])


  return (
    <>
      { cardRender === true &&
        session.map(sess => (
          <Card className="sessCard" key={sess._id}>
            <Card.Header className="sessName">
              {sess.sessKeynote === true &&
                <Row>
                  <Col sm={11}>
                    <h3>Keynote</h3>
                  </Col>
                </Row>}
              <Row>
                <Col sm={11}>
                  <h2>{sess.sessName}</h2>
                </Col>
                <Col sm={1}>
                  {isAuthenticated &&
                    (user.email === conference.creatorEmail || conference[0].confAdmins.includes(user.email)) &&
                    <Button data-toggle="popover" title="Delete this conference" className="deletebtn" onClick={() => handleDelete(sess._id)}>
                      <Image fluid src="/images/trash-can.png" className="delete" alt="Delete" />
                    </Button>}
                </Col>
              </Row>
            </Card.Header>
            <Card.Body className="cardBody">
              <Row>
                <Col sm={8}>
                  <Card.Text>{sess.sessDesc}</Card.Text>
                </Col>
                <Col sm={4}>
                  <Row><p>Date: {sess.sessDate}</p></Row>
                  <Row><p>Time: {sess.sessStart} - {sess.sessEnd}</p></Row>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))}
    </>
  )
}

export default SessionCard;