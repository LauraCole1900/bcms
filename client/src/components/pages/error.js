import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";
import { Link, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Row, Col, Button } from "react-bootstrap";

const Error = (err) => {
  const urlArray = window.location.href.split("/")
  const urlId = urlArray[urlArray.length - 2]
  // How do you do this without throwing it into the URL?
  const errId = urlArray[urlArray.length - 1]
  const errMsg = errId.replaceAll("%20", " ")
  console.log({ urlId }, { errId }, { errMsg });

  const location = useLocation();


  return (
    <>
      <Container fluid>
        <Row>
          <Col sm={2}></Col>
          <Col sm={8}>
            <h1>We're sorry.</h1>
            <h3>Gremlins appear to have gotten into our system. Please copy the error message below and send it to us to help us find and banish these gremlins as quickly as we can.</h3>
            <h4>If you briefly saw a "Success" message, we apologize for that, too. Your information was <span className="red">not</span> posted to our database.</h4>
          </Col>
        </Row>
        <Row>
          <Col sm={2}></Col>
          <Col sm={8}>
            {(urlId === "attdel_error") &&
              <h3 className="error">{errMsg}. You are unable to unregister at this time.</h3>}
            {(urlId === "attreg_error") &&
              <h3 className="error">{errMsg}. Your registration could not be processed at this time.</h3>}
            {(urlId === "attupdate_error") &&
              <h3 className="error">{errMsg}. Your registration was not updated.</h3>}
            {(urlId === "exhdel_error") &&
              <h3 className="error">{errMsg}. You are unable to unregister your exhibit at this time.</h3>}
            {(urlId === "exhreg_error") &&
              <h3 className="error">{errMsg}. Your exhibit registration could not be processed at this time.</h3>}
            {(urlId === "exhupdate_error") &&
              <h3 className="error">{errMsg}. Your exhibit information was not updated.</h3>}
            {(urlId === "confcreate_error") &&
              <h3 className="error">{errMsg}. Your conference was not created.</h3>}
            {(urlId === "confupdate_error") &&
              <h3 className="error">{errMsg}. Your conference was not updated.</h3>}
            {/* {(urlId === "session_added") &&
              <h3 className="error">You have added a session.</h3>} */}
            {(urlId === "userupdate_error") &&
              <h3 className="error">{errMsg}. Your user information was not updated.</h3>}
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

export default Error;