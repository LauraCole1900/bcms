import React from "react";
import { Container, Col, Row } from "react-bootstrap";
import { ConferencesButton, ProfileButton } from "../components/buttons";

const NotFound = () => {


  return (
    <Container>
      <Row>
        <Col sm={12}>
          <h1 className="center">Here be dragons!</h1>
        </Col>
      </Row>
      <Row>
        <Col sm={12}>
          <p>You've found undiscovered territory. Our wizards recommend returning to familiar areas.</p>
        </Col>
      </Row>
      <Row>
        <Col sm={12} className="spaceBetween">
          <ConferencesButton />
          <ProfileButton />
        </Col>
      </Row>
    </Container>
  )
}

export default NotFound;