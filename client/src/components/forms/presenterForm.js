import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Form, Card, Row, Col, Button, Image } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { ConferenceAPI, PresenterAPI, SessionAPI } from "../../utils/api";
import { presValidate } from "../../utils/validation";
import { ErrorModal, SuccessModal } from "../modals";
import "./style.css";

const PresenterForm = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const [presenter, setPresenter] = useState({
    presGivenName: "",
    presFamilyName: "",
    presOrg: "",
    presBio: "",
    presEmail: "",
    presPhone: "",
    presWebsite: "",
    presPic: "",
  });
  const [conference, setConference] = useState();
  const [session, setSession] = useState();
  const [charRem, setCharRem] = useState(750);
  const [errThrown, setErrThrown] = useState();
  const [errors, setErrors] = useState({});
  const [presReady, setPresReady] = useState(false);
  const [confReady, setConfReady] = useState(false);

  
  // Handles input changes to form fields
  const handleInputChange = (e) => {
    setPresenter({ ...presenter, [e.target.name]: e.target.value })
  };



  return (
    <>
      {!isAuthenticated &&
        <Row>
          <h1 className="authRemind">Please <Link to={window.location.origin} className="login" onClick={() => loginWithRedirect()}>
            log in
          </Link> to add or edit a session.</h1>
          <div className="authLogo"><Image fluid="true" className="loadLogo" src="/images/bristlecone-dark.png" alt="BCMS logo" /></div>
        </Row>}
    </>
  )
}

export default PresenterForm;