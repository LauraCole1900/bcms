import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { AttendeeAPI } from "../../utils/api";
import "./style.css";

const AttendeeTable = ({ attendees }) => {
  const [attendee, setAttendee] = useState();

  const urlArray = window.location.href.split("/");
  const confId = urlArray[urlArray.length - 1];

  const handleInputChange = (e) => {
    console.log("Attendee table", confId, e.target, e.target.dataset.id);
    AttendeeAPI.updateAttendeeById(e.target.dataset.id, { ...attendee })
      .catch(err => console.log(err))
    switch (e.isAdmin) {
      case undefined:
        setAttendee({ ...attendee, [e.target.name]: "yes"})
        break;
      case "yes":
        setAttendee({ ...attendee, [e.target.name]: "no" })
        break;
      default:
        setAttendee({ ...attendee, [e.target.name]: "yes" })
    }
  }

  return (
    <>
      {attendees.map(e => (
        <tr key={e._id}>
          <td>{e.familyName}</td>
          <td>{e.givenName}</td>
          <td>{e.email}</td>
          <td>{e.phone}</td>
          <td>{e.employerName}</td>
          <td>{e.emergencyContactName}</td>
          <td>{e.emergencyContactPhone}</td>
          <td>{e.allergies}</td>
          <td><Form.Check type="checkbox" name="isAdmin" value="yes" data-id={e._id} checked={e.isAdmin === "yes"} onChange={handleInputChange} /></td>
        </tr>
      ))
      }
    </>
  )
}

export default AttendeeTable;