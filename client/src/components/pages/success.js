import React, { Component } from "react";
import { Redirect } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Row, Col } from "react-bootstrap";

class Success extends Component {
  state = {
    ...this.state,
    redirect: false
  }

}

export default Success;