import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { AttendeeAPI } from "../../utils/api";
import "./style.css";

const AttendeeTable = ({ attendees }) => {
  const [admin, setAdmin] = useState(false)

  const adminSet = () => {
    switch (admin) {
      case true:
        setAdmin(false)
        break;
      default:
        setAdmin(true)
    }
  }

  const handleClick = async (e) => {
    console.log("Attendee table", e.target.value, e.target.dataset.id);
    let adminConf;
    switch (e.target.value) {
      case "yes":
        adminConf = "no";
        await adminSet();
        break;
      default: case "no":
        adminConf = "yes";
        await adminSet();
    }
    AttendeeAPI.updateAttendeeById(e.target.dataset.id, { [e.target.name]: adminConf })
      .catch(err => console.log(err))
    console.log(admin)
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