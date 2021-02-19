import React, { useEffect, useState } from "react";
import { Card, Row, Col, Image } from "react-bootstrap";
import { SessionAPI } from "../../utils/api";
import "./style.css";

const PresenterCard = ({ session }) => {
  const [sessions, setSessions] = useState();
  const [cardRender, setCardRender] = useState(false);

  // Grabs ConfID from URL
  const urlArray = window.location.href.split("/")
  const confId = urlArray[urlArray.length - 1]

  useEffect(() => {
    SessionAPI.getSessions(confId)
      .then(resp => {
        console.log(resp.data)
        setSessions(resp.data)
      })
      .catch(err => console.log(err))
    setCardRender(true)
  }, [confId])

  return (
    <>
      { cardRender === true &&
        session.map(sess => (
          <Card className="presCard" key={sess._id}>
            <Card.Header className="presName">
              <Row>
                <Col sm={12}>
                  <h2>{sess.sessPresenter}</h2>
                  <p>{sess.sessPresenterOrg}</p>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body className="cardBody">
              <Row>
                <Col sm={8}>
                  <Card.Text>{sess.sessPresenterBio}</Card.Text>
                </Col>
                {sess.sessPresenterPic.length > 0 &&
                  <Col sm={4}>
                    <Image src={sess.presPresenterPic} alt={sess.sessPresenter} />
                  </Col>}
              </Row>
            </Card.Body>
          </Card>
        ))
      }
    </>
  )
}

export default PresenterCard;