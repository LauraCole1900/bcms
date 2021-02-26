import React, { useEffect, useState } from "react";
import { useHistory, useLocation, Link } from "react-router-dom";
import { Card, Row, Col, Button, Image } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { ConferenceAPI, SessionAPI } from "../../utils/api";
import "./style.css";

const SessionCard = (props) => {
  const { user, isAuthenticated } = useAuth0();
  const history = useHistory();
  const location = useLocation();
  const [cardRender, setCardRender] = useState(false);

  // Grab conference ID from URL
  const urlArray = window.location.href.split("/");
  const confId = urlArray[urlArray.length - 1];

  // Handles click on delete button
  function handleDelete(sessId) {
    console.log("from sessCard handleDelete", sessId)
    SessionAPI.deleteSession(sessId)
      .then(history.push("/deleted"))
      .catch(err => console.log(err))
  };

  useEffect(() => {
    setCardRender(true)
  }, [])


  return (
    <>
      { cardRender === true &&
        props.session.map(sess => (
          <Card className="card" key={sess._id}>
            <Card.Header className="cardTitle">
              {sess.sessKeynote === true &&
                <Row>
                  <Col sm={11}>
                    <h3>Keynote</h3>
                  </Col>
                </Row>}
              <Row>
                <Col sm={11}>
                  <h2>{sess.sessName}</h2>
                  <p>{sess.sessPresenter}</p>
                </Col>
                <Col sm={1}>
                  {isAuthenticated &&
                    (user.email === props.conference[0].creatorEmail || props.conference[0].confAdmins.includes(user.email)) &&
                    <Button data-toggle="popover" title="Delete this session" className="deletebtn" onClick={() => handleDelete(sess._id)}>
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
              {isAuthenticated &&
              (user.email === props.conference[0].creatorEmail || props.conference[0].confAdmins.includes(user.email)) &&
              <Row>
                <Col sm={1}></Col>
                  <Col sm={5}>
                  <Link to={`/edit_session/${sess._id}`} className={location.pathname === `/edit_session/${sess._id}` ? "link active" : "link"}>
                      <Button data-toggle="popover" title="Edit session" className="button">Edit Session</Button>
                    </Link>
                </Col>
                </Row>}
            </Card.Body>
          </Card>
        ))}
    </>
  )
}

export default SessionCard;