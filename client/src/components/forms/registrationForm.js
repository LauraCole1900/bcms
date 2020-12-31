import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { AttendeeAPI } from "../../utils/api";

const Registration = () => {
  const { user, isAuthenticated } = useAuth0();
  const history = useHistory();
  const [pageReady, setPageReady] = useState(false);
  const [attendee, setAttendee] = useState({})

  const urlArray = window.location.href.split("/")
  const confId = urlArray[urlArray.length - 1]
  
  useEffect(() => {
    setAttendee({ ...attendee, confId: confId })
    setPageReady(true);
  }, [])

  const handleInputChange = (e) => {
    setAttendee({ ...attendee, [e.target.name]: e.target.value })
  };

}

export default Registration;