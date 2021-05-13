import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Card, Row, Col, Button, Image } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import "./style.css";

// Figure out how to add session name(s)?

const PresenterCard = (props) => {
  const { user, isAuthenticated } = useAuth0();
  const location = useLocation();
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
            {pres.presKeynote === "yes"
              ? <>
                <Card.Header className="cardTitleKeynote">
                  <Row>
                    <Col sm={12}>
                      <h2>{pres.presGivenName} {pres.presFamilyName}, Keynote Speaker</h2>
                      <p>{pres.presOrg}</p>
                    </Col>
                  </Row>
                </Card.Header>
              </>
              :
              <>
                <Card.Header className="cardTitle">
                  <Row>
                    <Col sm={12}>
                      <h2>{pres.presGivenName} {pres.presFamilyName}</h2>
                      <p>{pres.presOrg}</p>
                    </Col>
                  </Row>
                </Card.Header>
              </>}
            <Card.Body className="infoCardBody">
              <Row>
                <Col sm={8}>
                  <Card.Text>{pres.presBio}</Card.Text>
                  {pres.presWebsite !== "" &&
                    <p>Website: <a href={pres.presWebsite} rel="noreferrer noopener" target="_blank">{pres.presWebsite}</a></p>}
                </Col>
                {props.presenter.presPic !== undefined &&
                  <Col sm={4}>
                    <Image src={pres.presPic} alt={pres.presGivenName + " " + pres.presFamilyName} />
                  </Col>}
              </Row>
              {isAuthenticated &&
                (user.email === props.conference[0].ownerEmail || props.conference[0].confAdmins.includes(user.email)) &&
                <Row>
                  <Col sm={1}></Col>
                  <Col sm={5}>
                    <Link to={`/edit_presenter/${pres._id}`} className={location.pathname === `/edit_presenter/${pres._id}` ? "link active" : "link"}>
                      <Button data-toggle="popover" title="Edit session" className="button">Edit Presenter</Button>
                    </Link>
                  </Col>
                </Row>}
            </Card.Body>
          </Card>
        ))
      }
    </>
  )
}

export default PresenterCard;