import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Container, Row, Col, Table } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { ConferenceCard, UserCard } from "../cards";
import TableData from "./tableData.js";
import { AttendeeAPI, ConferenceAPI, ExhibitorAPI, PresenterAPI } from "../../utils/api";
import "./style.css";

const TableComp = (e) => {
  // pull confId out of URL
  // pull attendee, exhibitor or presenter out of url
  // useState runs appropriate API call based on ^
  // then populates the result data to the table
  // data needs to be sortable and searchable
  // "conferences page" button
  // "conference details" button
  // user card
  // conference card

  const { user, isAuthenticated } = useAuth0();
  const location = useLocation();
  const [attendees, setAttendees] = useState([]);
  const [conference, setConference] = useState([]);
  const [exhibitors, setExhibitors] = useState([]);
  const [presenters, setPresenters] = useState([]);
  const [colHead, setColHead] = useState([]);
  const [pageReady, setPageReady] = useState(false);

  const urlArray = window.location.href.split("/");
  const confId = urlArray[urlArray.length - 1];
  const dataSet = urlArray[urlArray.length - 2];

  useEffect(() => {
    ConferenceAPI.getConferenceById(confId)
      .then(resp => {
        console.log("table getConfsById", resp.data)
        setConference(resp.data)
      })
      .catch(err => console.log(err))

    if (dataSet === "attendees") {
      AttendeeAPI.getAttendees(confId)
        .then(resp => {
          console.log("table getAttendees", resp.data)
          setAttendees(resp.data)
        })
        .catch(err => console.log(err))
    } else if (dataSet === "exhibitors") {
      ExhibitorAPI.getExhibitors(confId)
        .then(resp => {
          console.log("table getExhibitors", resp.data)
          setExhibitors(resp.data)
        })
        .catch(err => console.log(err))
    } else if (dataSet === "presenters") {
      PresenterAPI.getPresenters(confId)
        .then(resp => {
          console.log("table getPresenters", resp.data)
          setPresenters(resp.data)
        })
        .catch(err => console.log(err))
    }
    setPageReady(true);
  }, [])

  return (
    <>
      {pageReady === true &&
        <Container fluid>
          <Row>
            <Col lg={6} md={12}>
              <UserCard />
            </Col>
            <Col lg={6} md={12}>
              <ConferenceCard conference={conference} />
            </Col>
          </Row>
          <Row>
            {dataSet === "attendees" &&
              <h1>Attendees</h1>}
            {dataSet === "exhibitors" &&
              <h1>Exhibitors</h1>}
            {dataSet === "presenters" &&
              <h1>Presenters</h1>}
          </Row>
          <Table striped border hover responsive>
            <thead>
              <tr>
                <th className="columnHeader">
                  <span onClick={sortByName}>Name</span>
                </th>
                <th className="columnHeader">
                  <span onClick={sortByEmail}>Email</span>
                </th>
                <th className="columnHeader">
                  <span onClick={sortByPhone}>Phone</span>
                </th>
                <th className="columnHeader">
                  <span onClick={sortByOrg}>Company, Org, School, etc.</span>
                </th>
                <th className="columnHeader">
                  <span onClick={sortByEmergency}>Emergency Contact Name</span>
                </th>
                <th className="columnHeader">
                  <span onClick={sortByEmergencyPhone}>Emergency Contact Phone</span>
                </th>
                <th className="columnHeader">
                  <span onClick={sortByAllergies}>Allergies</span>
                </th>
                <th className="columnHeader">
                  <span onClick={sortByAdmin}>Admin?</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {dataSet === "attendees" &&
                <TableData data={attendees} />}
              {dataSet === "exhibitors" &&
                <TableData data={exhibitors} />}
              {dataSet === "presenters" &&
                <TableData dta={presenters} />}
            </tbody>
          </Table>
        </Container>
      }
    </>
  )

}

export default TableComp;