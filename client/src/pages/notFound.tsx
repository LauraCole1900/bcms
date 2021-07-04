import React, { ReactElement } from "react";
import { Container, Col, Image, Row } from "react-bootstrap";
import { ConferencesButton, ProfileButton } from "../components/buttons";

// Dragon image created by <a href="https://freepngimg.com/author/hannahhil-5479">Hannah Hill</a> and found at <a href="https://freepngimg.com/png/2678-tattoo-dragon-png-image">FreePNG.com</a>.

const NotFound = (): ReactElement => {


  return (
    <Container>
      <Row>
        <Col sm={12}>
          <h1 className="notFound">404 Page Not Found</h1>
          <h1 className="center">Here be dragons!</h1>
        </Col>
      </Row>
      <Row>
        <Col sm={12} className="center">
          <Image className="dragon" src="/images/dragon-image.png" alt="Dragon" />
        </Col>
      </Row>
      <Row>
        <Col sm={12} className="center">
          <p>You've found uncharted territory. Our wizards recommend returning to familiar areas:</p>
        </Col>
      </Row>
      <Row>
        <Col sm={12} className="center">
          <ConferencesButton />
          <ProfileButton />
        </Col>
      </Row>
    </Container>
  )
}

export default NotFound;