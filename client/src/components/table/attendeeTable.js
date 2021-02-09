import React from "react";
import { Form } from "react-bootstrap";
import { AttendeeAPI } from "../../utils/api";
import "./style.css";

const AttendeeTable = (props) => {

  // Click handler for checkbox
  const handleInputChange = (e) => {
    console.log("Attendee table", e.target.value, e.target.dataset.id);
    let adminConf;
    // Define data to be changed based on existing checkbox value
    switch (e.target.value) {
      case "true":
        adminConf = false;
        break;
      default:
        adminConf = true;
    }
    // API call to update database document
    AttendeeAPI.updateAttendeeById(e.target.dataset.id, { [e.target.name]: adminConf })
    .then(props.callback(props.confId))
      .catch(err => console.log(err))
  }

  return (
    <>
      {props.attendees.map(e => (
        <tr key={e._id}>
          <td>{e.familyName}</td>
          <td>{e.givenName}</td>
          <td>{e.email}</td>
          <td>{e.phone}</td>
          <td>{e.employerName}</td>
          <td>{e.emergencyContactName}</td>
          <td>{e.emergencyContactPhone}</td>
          <td>{e.allergies}</td>
          <td><Form.Check type="checkbox" name="isAdmin" value={e.isAdmin} data-id={e._id} aria-label="adminCheck" className="adminCheck" checked={e.isAdmin === true} onChange={handleInputChange} /></td>
        </tr>
      ))
      }
    </>
  )
}

export default AttendeeTable;