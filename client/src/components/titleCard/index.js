import React from "react";
import { Container, Card } from "react-bootstrap";
import "./style.css";

const TitleCard = () => {

  return (
    <Container>
      <Card className="title">
        <Card.Body>
          <Card.Title>
            <h1>Concino Conference Management System</h1>
          </Card.Title>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default TitleCard;