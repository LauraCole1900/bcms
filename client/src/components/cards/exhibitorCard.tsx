import React, { useEffect, useState } from "react";
import { Card, Row, Col, Image } from "react-bootstrap";
import "./style.css";

interface Exhibitor {
  confId: string,
  exhGivenName: string,
  exhFamilyName: string,
  exhEmail: string,
  exhCompany: string,
  exhPhone: string,
  exhCompanyAddress: string,
  exhDesc: string,
  exhLogo: string,
  exhWebsite: string,
  exhWorkers: number,
  exhWorkerNames: string[],
  exhSpaces: number,
  exhBoothNum: string,
  _id: string
}

const ExhibitorCard = ({ exhibitor }: { exhibitor: Exhibitor[] }): object => {
  const [cardRender, setCardRender] = useState<boolean>(false);

  useEffect(() => {
    if (exhibitor) {
      setCardRender(true)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
    <>
      { cardRender === true &&
        exhibitor.map((exh: Exhibitor) => (
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
                {exh.exhLogo !== undefined &&
                  <Col sm={4}>
                    <Image src={exh.exhLogo} alt={exh.exhCompany} />
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