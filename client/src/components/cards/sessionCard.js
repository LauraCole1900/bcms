import React, { useEffect, useState } from "react";
import { useHistory, useLocation, Link } from "react-router-dom";
import { Card, Row, Col, Button, Image } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import Moment from "react-moment";
import { SessionAPI } from "../../utils/api";
import "./style.css";

const SessionCard = (props) => {
  const { user, isAuthenticated } = useAuth0();
  const history = useHistory();
  const location = useLocation();
  const [cardRender, setCardRender] = useState(false);
  const [presNames, setPresNames] = useState([]);
  const [presOrgs, setPresOrgs] = useState([]);
  const presEmailArr = props.session.sessPresEmails;

  // Handles click on delete button
  const handleDelete = (sessId) => {
    console.log("from sessCard handleDelete", sessId)
    SessionAPI.deleteSession(sessId)
      .then(history.push("/deleted"))
      .catch(err => console.log(err))
  };

  // Creates array of presenter names
  // Map through presenters
  // Find where props.session.sessPresEmails.includes(props.presenter.presEmail)
  // Concat {props.presenter.presGivenName + " " + props.presenter.presFamilyName} to array of presNames
  // const findPres = () => {
  //   let pres = props.presenter.forEach(sess => sess.sessPresEmails.includes(props.presenter.presEmail))
  //   setPresNames(...presNames, pres.presGivenName + " " + pres.presFamilyName)
  //   setPresOrgs(...presOrgs, pres.presOrg)
  // }

  useEffect(() => {
    if (props.session.length > 0) {
      // findPres(presEmailArr);
      setCardRender(true)
    }
  }, [props.session])


  return (
    <>
      { cardRender === true &&
        props.session.map(sess => (
          <Card className="infoCard" key={sess._id}>
            <Card.Header className="cardTitle">
              <Row>
                {sess.sessKeynote === "yes"
                  ? <div>
                    <Col sm={2}>
                      <h3>&nbsp;Keynote:</h3>
                    </Col>
                    <Col sm={9}>
                      <h2>{sess.sessName}</h2>
                      <p>{presNames}, {presOrgs}</p>
                    </Col>
                  </div>
                  : <div>
                    <Col sm={11}>
                      <h2>{sess.sessName}</h2>
                      <p>{presNames}, {presOrgs}</p>
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