import React, { useState } from "react";
import { Form } from "react-bootstrap";
import "./style.css";

const AttendeeTable = ({ attendees }) => {
  const [attendee, setAttendee] = useState();

  const handleInputChange = (e) => {
    switch (e.isAdmin) {
      case true:
        setAttendee({ ...attendee, [e.isAdmin]: "no" })
        break;
      default:
        setAttendee({ ...attendee, [e.isAdmin]: "yes" })
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
          <td><Form.Check type="checkbox" name="isAdmin" value="yes" checked={e.isAdmin === true} onChange={handleInputChange} /></td>
        </tr>
      ))
      }
    </>
  )
}

export default AttendeeTable;