import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Row, Col, Table } from "react-bootstrap";
import { SessionAPI } from "../../utils/api";
import "./style.css";

const AboutBCMS = () => {

  return (
    <Container>
      <Row>
        <Col sm={2}></Col>
        <Col sm={8}>
          <h1>About BCMS</h1>
        </Col>
      </Row>

      <Row>
        <Col sm={2}></Col>
        <Col sm={8}>
          <p>Bristlecone Conference Management System is a platform for creating and registering for conferences, conventions, seminars and similar events. It is intended to give conference creators, organizers and administrators a single, intuitive tool to manage registration and attendance for attendees, presenters and exhibitors, including dynamically changing information regarding presenters & sessions and exhibitors & exhibits when the unexpected happens--such as when travel problems lead to presenters and exhibitors arriving later than intended.</p>
        </Col>
      </Row>

      <Row>
        <Col sm={2}></Col>
        <Col sm={8}>
          <Table bordered responsive>
            <thead>
              <tr>
                <th>What BCMS <span className="green">Is:</span></th>
                <th>What BCMS <span className="red">Isn't:</span></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <ul>
                    <li></li>
                  </ul>
                </td>
                <td>
                  <ul>
                    <li></li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>

  )

}

export default AboutBCMS;