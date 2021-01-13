import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ConferenceCard, UserCard } from "../cards";
import { AttendeeAPI, ExhibitorAPI, PresenterAPI } from "../../utils/api";
import "./style.css";
import { useAuth0 } from "@auth0/auth0-react";

const Table = (e) => {
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

  const urlArray = window.location.href.split("/");
  const confId = urlArray[urlArray.length - 1];
  const dataSet = urlArray[urlArray.length - 2];
}

export default Table;