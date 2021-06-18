import React, { useEffect, useState } from "react";
import { Card, Row, Col, Image } from "react-bootstrap";
import "./style.css";

const ExhibitorCard = (props) => {
  const [cardRender, setCardRender] = useState(false);

  useEffect(() => {
    if (props.exhibitor.length > 0) {
      setCardRender(true)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
    <>
      { cardRender === true &&
        props.exhibitor.map(exh => (
          <Card className="infoCard smallCard" key={exh._id}>
            <Card.Header className="cardTitle">
              <Row>
                <Col sm={12}>
                  <h2>{exh.exhCompany}</h2>
                  <p>Booth #{exh.exhBoothNum}</p>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body className="infoCardBody">
              <Row>
                <Col sm={8}>
                  <Card.Text>{exh.exhDesc}</Card.Text>
                </Col>
                {props.exhibitor.exhCompanyLogo !== undefined &&
                  <Col sm={4}>
                    <Image src={exh.exhCompanyLogo} alt={exh.exhCompany} />
                  </Col>}
              </Row>
            </Card.Body>
          </Card>
        ))
      }
    </>
  )
}

export default ExhibitorCard;