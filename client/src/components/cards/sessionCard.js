import React, { useEffect, useState } from "react";
import { useHistory, useLocation, Link } from "react-router-dom";
import { Card, Row, Col, Button, Image } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import Moment from "react-moment";
import { PresenterAPI, SessionAPI } from "../../utils/api";
import "./style.css";

const SessionCard = (props) => {
  const { user, isAuthenticated } = useAuth0();
  const history = useHistory();
  const location = useLocation();
  const [cardRender, setCardRender] = useState(false);
  const [presenters, setPresenters] = useState();
  const [presNames, setPresNames] = useState([]);
  const [presOrgs, setPresOrgs] = useState([]);
  const presEmailArr = props.session.sessPresEmails;
  let presObj = [];
  let names = [];

  // Handles click on delete button
  const handleDelete = (sessId) => {
    console.log("from sessCard handleDelete", sessId)
    SessionAPI.deleteSession(sessId)
      .then(history.push("/deleted"))
      .catch(err => console.log(err))
  };

  // GETs Presenter by email
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
      setCardRender(true)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.session])


  return (
    <>
      { cardRender === true &&
        props.session.map(sess => (
          <Card className="infoCard" key={sess._id}>
            {/* {() => findNames(sess.sessPresEmails, sess.confId)} */}
            <Card.Header className="cardTitle">
              <Row>
                {sess.sessKeynote === "yes" &&
                  <div>
                    <Col sm={2}>
                      <h3>&nbsp;Keynote:</h3>
                    </Col>
                    <Col sm={9}>
                      <h2>{sess.sessName}</h2>
                      <p>{sess.sessPresNames.join(", ")}</p>
                      <p>{sess.sessPresOrgs.join(", ")}</p>
                    </Col>
                  </div>}
                {sess.sessPanel === "yes" &&
                  <div>
                    <Col sm={2}>
                      <h3>&nbsp;Panel<br />&nbsp;Discussion:</h3>
                    </Col>
                    <Col sm={9}>
                      <h2>{sess.sessName}</h2>
                      <p>{sess.sessPresNames.join(", ")}</p>
                      <p>{sess.sessPresOrgs.join(", ")}</p>
                    </Col>
                  </div>}
                {sess.sessKeynote === "no" && sess.sessPanel === "no" &&
                  <div>
                    <Col sm={11}>
                      <h2>{sess.sessName}</h2>
                      <p>{sess.sessPresNames.join(", ")}</p>
                      <p>{sess.sessPresOrgs.join(", ")}</p>
                    </Col>
                  </div>}
                <Col sm={1}>
                  {isAuthenticated &&
                    (user.email === props.conference[0].ownerEmail || props.conference[0].confAdmins.includes(user.email)) &&
                    <Button data-toggle="popover" title="Delete this session" className="deletebtn" name="sessDelete" onClick={() => handleDelete(sess._id)}>
                      <Image fluid="true" src="/images/trash-can.png" className="delete" alt="Delete" name="sessDelete" />
                    </Button>}
                </Col>
              </Row>
            </Card.Header>
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
          </Card>
        ))}
    </>
  )
}

export default SessionCard;