import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Container, Row, Col, Table } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { ConferenceCard, UserCard } from "../cards";
import AttendeeTable from "./attendeeTable.js";
import ExhibitorTable from "./exhibitorTable.js";
import PresenterTable from "./presenterTable.js";
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

  const { user, isAuthenticated } = useAuth0();
  const location = useLocation();
  const [attendees, setAttendees] = useState([]);
  const [conference, setConference] = useState([]);
  const [exhibitors, setExhibitors] = useState([]);
  const [presenters, setPresenters] = useState([]);
  const [sortAscending, setSortAscending] = useState(false);
  const [pageReady, setPageReady] = useState(false);

  const urlArray = window.location.href.split("/");
  const confId = urlArray[urlArray.length - 1];
  const dataSet = urlArray[urlArray.length - 2];

  const attHeaders = ["familyName", "givenName", "email", "phone", "employerName", "emergencyContactName", "emergencyContactPhone", "allergies", "isAdmin"];
  const exhHeaders = ["exhFamilyName", "exhGivenName", "exhEmail", "exhPhone", "exhCompany", "exhWorkerNames", "exhSpaces", "exhAttend"];
  const presHeaders = ["presFamilyName", "presGivenName", "presEmail", "presPhone", "presOrg", "presWebsite", "presSessionIds", "sessionName"];

  // Sort ascending
  const ascendingSort = (arr, value) => {
    return arr.sort((a, b) => (a[value] > b[value]) ? 1 : -1);
  }

  // Sort descending
  const descendingSort = (arr, value) => {
    return arr.sort((a, b) => (a[value] > b[value]) ? -1 : 1);
  }

  // Sort by column header
  const sortBy = (e) => {
    if (dataSet === "attendees") {
      const sortAtt = (sortAscending) ? ascendingSort(attendees, e.target.innerHTML) : descendingSort(attendees, e.target.innerHTML)
      setAttendees(sortAtt)
      if (sortAscending === true) {
        setSortAscending(false)
      } else {
        setSortAscending(true)
      }
    } else if (dataSet === "exhibitors") {
      const sortExh = (sortAscending) ? ascendingSort(exhibitors, e.target.innerHTML) : descendingSort(exhibitors, e.target.innerHTML)
      setExhibitors(sortExh)
      if (sortAscending === true) {
        setSortAscending(false)
      } else {
        setSortAscending(true)
      }
    } else if (dataSet === "presenters") {
      const sortPres = (sortAscending) ? ascendingSort(presenters, e.target.innerHTML) : descendingSort(presenters, e.target.innerHTML)
      setPresenters(sortPres)
      if (sortAscending === true) {
        setSortAscending(false)
      } else {
        setSortAscending(true)
      }
    }
  }

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
            <Col className="center">
              {dataSet === "attendees" &&
                <h1>Attendees</h1>}
              {dataSet === "exhibitors" &&
                <h1>Exhibitors</h1>}
              {dataSet === "presenters" &&
                <h1>Presenters</h1>}
            </Col>
          </Row>
          <Row>
            <Col className="subhead">
              <p>Click column headers to sort</p>
            </Col>
          </Row>
          <Table striped border hover responsive>
            <thead>
              <tr>
                {dataSet === "attendees" &&
                  attendees.length > 0 && (
                    attHeaders.map((data, idx) => (
                      <td key={idx} value={data.value} onClick={sortBy}>{data}</td>
                    )))}
                {dataSet === "exhibitors" &&
                  exhibitors.length > 0 && (
                    exhHeaders.map((data, idx) => (
                      <td key={idx} onClick={sortBy}>{data}</td>
                    )))}
                {dataSet === "presenters" &&
                  presenters.length > 0 && (
                    presHeaders.map((data, idx) => (
                      <td key={idx} onClick={sortBy}>{data}</td>
                    )))}
              </tr>
            </thead>
            <tbody>
              {dataSet === "attendees" && (
                attendees.length > 0
                  ? <AttendeeTable attendees={attendees} />
                  : <h3>We can't seem to find any registered attendees at this time. If you think this is an error, please contact us.</h3>)}
              {dataSet === "exhibitors" && (
                exhibitors.length > 0
                  ? < ExhibitorTable data={exhibitors} />
                  : <h3>We can't seem to find any exhibitors registered for this conference. If you think this is an error, please contact us.</h3>)}
              {dataSet === "presenters" && (
                presenters.length > 0
                  ? <PresenterTable data={presenters} />
                  : <h3>We can't seem to find any presenters for this conference. If you think this is an error, please contact us.</h3>)}
            </tbody>
          </Table>
        </Container>
      }
    </>
  )

}

export default TableComp;