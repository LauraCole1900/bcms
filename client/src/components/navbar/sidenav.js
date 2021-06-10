import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Nav, Row } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import "./style.css";

const Sidenav = (props) => {
  const { user, isAuthenticated } = useAuth0();
  const location = useLocation();

  // Pull conference ID from URL
  const urlArray = window.location.href.split("/");
  const confId = urlArray[urlArray.length - 1];
  const urlType = urlArray[urlArray.length - 2];

  return (
    <Nav fluid="true" className="center outline flex-column">
      <Row><h3 className="textTight">Navigation</h3></Row>
      {urlType !== "details" &&
        <Row>
          <Link to={`/details/${confId}`} className={location.pathname === `/details/${confId}` ? "link active" : "link"}>
            <Button data-toggle="popover" title="View details" className="sideButton">Details</Button>
          </Link>
        </Row>}
      <Row>
        <Link to={`/schedule/${confId}`} className={location.pathname === `/schedule/${confId}` ? "link active" : "link"}>
          <Button data-toggle="popover" title="View schedule" className="sideButton">Schedule</Button>
        </Link>
      </Row>
      <Row>
        <Link to={`/venue/${confId}`} className={location.pathname === `/venue/${confId}` ? "link active" : "link"}>
          <Button data-toggle="popover" title="Venue information" className="sideButton">Venue</Button>
        </Link>
      </Row>
      <Row>
        <Link to={`/exhibits/${confId}`} className={location.pathname === `/exhibits/${confId}` ? "link active" : "link"}>
          <Button data-toggle="popover" title="Exhibit information" className="sideButton">Exhibits</Button>
        </Link>
      </Row>
      {props.conference[0].confSessProposalConfirm === "yes" &&
        <Row>
          <Link to={`/propose_session/${confId}`} className={location.pathname === `/propose_session/${confId}` ? "link active" : "link"}>
            <Button data-toggle="popover" title="Session proposal form" className="sideButton">Session proposal form</Button>
          </Link>
        </Row>}
      {isAuthenticated && props.conference[0].confSessProposalCommittee.includes(user.email) &&
        <Row>
          <Link to={`/session_proposals/${confId}`} className={location.pathname === `/session_proposal/${confId}` ? "link active" : "link"}>
            <Button data-toggle="popover" title="View Session Proposals" className="committeeButton">View Session Proposals</Button>
          </Link>
        </Row>}
      {isAuthenticated &&
        urlType === "details" &&
        (user.email === props.conference[0].ownerEmail || props.conference[0].confAdmins.includes(user.email)) &&
        <>
          <Row>
            <Link to={`/attendees/${confId}`} className={location.pathname === `/attendees/${confId}` ? "link active" : "link"}>
              <Button data-toggle="popover" title="View conference attendees" className="adminButton">View Attendees</Button>
            </Link>
          </Row>
          <Row>
            <Link to={`/exhibitors/${confId}`} className={location.pathname === `/exhibitors/${confId}` ? "link active" : "link"}>
              <Button data-toggle="popover" title="View conference exhibitors" className="adminButton">View Exhibitors</Button>
            </Link>
          </Row>
          <Row>
            <Link to={`/presenters/${confId}`} className={location.pathname === `/presenters/${confId}` ? "link active" : "link"}>
              <Button data-toggle="popover" title="View conference presenters" className="adminButton">View Presenters</Button>
            </Link>
          </Row>
          <Row>
            <Link to={`/edit_conference/${confId}`} className={location.pathname === `/edit_conference/${confId}` ? "link active" : "link"}>
              <Button data-toggle="popover" title="Edit this conference" className="adminButton">Edit Conference</Button>
            </Link>
          </Row>
          <Row>
            <Link to={`/edit_schedule/${confId}`} className={location.pathname === `/edit_schedule/${confId}` ? "link active" : "link"}>
              <Button data-toggle="popover" title="Edit conference schedule" className="adminButton">Edit Schedule</Button>
            </Link>
          </Row>
          <Row>
            <Link to={`/new_session/${confId}`} className={location.pathname === `/new_session/${confId}` ? "link active" : "link"}>
              <Button data-toggle="popover" title="Add a session" className="adminButton">Add Session</Button>
            </Link>
          </Row>
          <Row>
            <Link to={`/admin_register_att/${confId}`} className={location.pathname === `/admin_register_att/${confId}` ? "link active" : "link"}>
              <Button data-toggle="popover" title="Add attendee" className="adminButton">Add Attendee</Button>
            </Link>
          </Row>
          <Row>
            <Link to={`/admin_register_exh/${confId}`} className={location.pathname === `/admin_register_exh/${confId}` ? "link active" : "link"}>
              <Button data-toggle="popover" title="Add attendee" className="adminButton">Add Exhibit</Button>
            </Link>
          </Row>
        </>}
    </Nav>
  )
}

export default Sidenav;