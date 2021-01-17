import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ConferenceCard, UserCard } from "../cards";
import { Container, Row, Col, Table } from "react-bootstrap";
import { AttendeeAPI, ExhibitorAPI, PresenterAPI } from "../../utils/api";
import "./style.css";
import { useAuth0 } from "@auth0/auth0-react";

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
  const [exhibitors, setExhibitors] = useState([]);
  const [presenters, setPresenters] = useState([]);
  const [pageReady, setPageReady] = useState(false);

  const urlArray = window.location.href.split("/");
  const confId = urlArray[urlArray.length - 1];
  const dataSet = urlArray[urlArray.length - 2];

  useEffect(() => {
    if (dataSet === "attendees") {
      AttendeeAPI.getAttendees(confId)
        .then(resp => {
          console.log("table getAttendees", resp.data)
          setAttendees(resp.data)
        })
    } else if (dataSet === "exhibitors") {
      ExhibitorAPI.getExhibitors(confId)
        .then(resp => {
          console.log("table getExhibitors", resp.data)
          setExhibitors(resp.data)
        })
    } else if (dataSet === "presenters") {
      PresenterAPI.getPresenters(confId)
      .then(resp => {
        console.log("table getPresenters", resp.data)
        setPresenters(resp.data)
      })
    }
    setPageReady(true);
  }, [])

  return (
    <>
    {pageReady === true &&
      <Container fluid>

      </Container>
    }
    </>
  )

}

export default TableComp;