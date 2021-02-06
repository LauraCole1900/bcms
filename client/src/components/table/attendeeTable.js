import React from "react";
import { Form } from "react-bootstrap";
import "./style.css";

const AttendeeTable = ({ attendees }) => {
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
          <td><Form.Check type="checkbox" checked={e.isAdmin === true} /></td>
        </tr>
      ))
      }
    </>
  )
}

export default AttendeeTable;