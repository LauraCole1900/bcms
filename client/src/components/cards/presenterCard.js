import React, { useEffect, useState } from "react";
import { Card, Row, Col, Image } from "react-bootstrap";
import "./style.css";

// Figure out how to add session name(s)?

const PresenterCard = (props) => {
  const [cardRender, setCardRender] = useState(false);

  useEffect(() => {
    if (props.session.length > 0) {
      setCardRender(true)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
    <>
      { cardRender === true &&
        props.session.map(sess => (
          <Card className="infoCard" key={sess._id}>
            <Card.Header className="cardTitle">
              <Row>
                <Col sm={12}>
                  {sess.sessKeynote === "yes"
                  ? <h2>{sess.sessPresenter}, Keynote Speaker</h2>
                  : <h2>{sess.sessPresenter}</h2>}
                  <p>{sess.sessPresenterOrg}</p>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body className="infoCardBody">
              <Row>
                <Col sm={8}>
                  <Card.Text>{sess.sessPresenterBio}</Card.Text>
                </Col>
                {props.session.sessPresenterPic !== undefined &&
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