import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { AttendeeAPI } from "../../utils/api";
import "./style.css";

const AttendeeTable = ({ attendees }) => {
  const [render, setRender] = useState(false)

  const handleClick = (e) => {
    console.log("Attendee table", e.target.value, e.target.dataset.id);
    let adminConf;
    switch (e.target.value) {
      case "yes":
        adminConf = "no";
        break;
      default: case "no":
        adminConf = "yes";
    }
    console.log("Attendee table", adminConf);
    AttendeeAPI.updateAttendeeById(e.target.dataset.id, { [e.target.name]: adminConf })
      .catch(err => console.log(err))
    switch (render) {
      case true:
        setRender(false)
        break;
      default:
        setRender(true)
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
          <td><Form.Check type="checkbox" name="isAdmin" value={e.isAdmin} data-id={e._id} aria-label="adminCheck" className="adminCheck" checked={e.isAdmin === "yes"} onChange={handleClick} /></td>
        </tr>
      ))
      }
    </>
  )
}

export default AttendeeTable;