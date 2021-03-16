import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";
import { Link, useLocation } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";

const SuccessPage = () => {
  const urlArray = window.location.href.split("/")
  const urlId = urlArray[urlArray.length - 1]
  console.log(urlId);

  const location = useLocation();
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRedirect(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [5000]);

  return (
    <>
      { redirect ? <Redirect to="/profile" /> : null}
      <Container fluid="true">
        <Row>
          <Col sm={2}></Col>
          <Col sm={8}>
            <h1>Success!</h1>
          </Col>
        </Row>
        <Row>
          <Col sm={2}></Col>
          <Col sm={8}>
            {(urlId === "conference_created") &&
              <h4>You have created a new conference.</h4>}
            {(urlId === "session_added") &&
              <h4>You have added a session.</h4>}
            {(urlId === "attendee_updated") &&
              <h4>You have updated your registration.</h4>}
            {(urlId === "conference_updated") &&
              <h4>You have updated your conference.</h4>}
            {(urlId === "session_updated") &&
              <h4>You have updated your session.</h4>}
            {(urlId === "user_updated") &&
              <h4>You have updated your information.</h4>}
            {(urlId === "unregistered") &&
              <h4>You have unregistered from this conference. If you paid a registration fee, please contact the conference organizers.</h4>}
            {(urlId === "deleted") &&
              <h4>Deleted!</h4>}
          </Col>
        </Row>
        <Row>
          <Col sm={2}></Col>
          <Col sm={8}>
            <h4>You will be redirected to your profile page shortly. To go there now,</h4>
          </Col>
        </Row>
        <Row>
          <Col sm={5}></Col>
          <Col sm={2}>
            <Link to="/profile" className={location.pathname === "/profile" ? "sessionbtn active" : "sessionbtn"}>
              <Button data-toggle="popover" title="Return to profile" type="button" className="button">Return to profile</Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default SuccessPage;