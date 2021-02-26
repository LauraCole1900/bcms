import React, { useEffect, useState } from "react";
import { Card, Row, Col, Image } from "react-bootstrap";
import { SessionAPI } from "../../utils/api";
import "./style.css";

const PresenterCard = (props) => {
  const [cardRender, setCardRender] = useState(false);

  // Grabs ConfID from URL
  const urlArray = window.location.href.split("/")
  const confId = urlArray[urlArray.length - 1]

  useEffect(() => {
    setCardRender(true)
  }, [])

  
  return (
    <>
      { cardRender === true &&
        props.session.map(sess => (
          <Card className="card" key={sess._id}>
            <Card.Header className="cardTitle">
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
                {sess.sessPresenterPic !== undefined &&
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