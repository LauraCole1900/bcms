import React, { useEffect, useState } from "react";
import { Card, Row, Col, Image } from "react-bootstrap";
import "./style.css";

// Figure out how to add session name(s)?

const PresenterCard = (props) => {
  const [cardRender, setCardRender] = useState(false);

  useEffect(() => {
    if (props.presenter.length > 0) {
      setCardRender(true)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
    <>
      { cardRender === true &&
        props.presenter.map(pres => (
          <Card className="infoCard" key={pres._id}>
            <Card.Header className="cardTitle">
              <Row>
                <Col sm={12}>
                  {pres.presKeynote === "yes"
                  ? <h2>{pres.presGivenName} {pres.presFamilyName}, Keynote Speaker</h2>
                  : <h2>{pres.presGivenName} {pres.presFamilyName}</h2>}
                  <p>{pres.presOrg}</p>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body className="infoCardBody">
              <Row>
                <Col sm={8}>
                  <Card.Text>{pres.presBio}</Card.Text>
                </Col>
                {props.presenter.presPic !== undefined &&
                  <Col sm={4}>
                    <Image src={pres.presPic} alt={pres.presGivenName + " " + pres.presFamilyName} />
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