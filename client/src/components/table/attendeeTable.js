import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { AttendeeAPI } from "../../utils/api";
import "./style.css";

const AttendeeTable = ({ attendees }) => {
  const [admin, setAdmin] = useState();

  const handleClick = (e) => {
    console.log("Attendee table", e.target.value, e.target.dataset.id);
    switch (e.target.value) {
      case true:
        setAdmin({ [e.target.name]: false })
        break;
      default:
        setAdmin({ [e.target.name]: true })
    }
    AttendeeAPI.updateAttendeeById(e.target.dataset.id, admin)
      .catch(err => console.log(err))
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
          <td><Form.Check type="checkbox" name="isAdmin" value={e.isAdmin} data-id={e._id} aria-label="adminCheck" className="adminCheck" checked={e.isAdmin === true} onChange={handleClick} /></td>
        </tr>
      ))
      }
    </>
  )
}

export default AttendeeTable;