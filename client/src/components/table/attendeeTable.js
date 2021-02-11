import React from "react";
import { Form } from "react-bootstrap";
import { AttendeeAPI, ConferenceAPI } from "../../utils/api";
import "./style.css";

const AttendeeTable = (props) => {

  const getEmail = (id) => {
    const adminObj = props.attendees.find(attendees => attendees._id === id)
    const adminEmail = adminObj.email
    return adminEmail
  }

  // Click handler for checkbox
  const handleInputChange = async (e) => {
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
    // API call to update attendee document
    AttendeeAPI.updateAttendeeById(e.target.dataset.id, { [e.target.name]: adminConf })
      .then(props.attcb(props.confId))
      .catch(err => console.log(err))
    let adminEmail = await getEmail(e.target.dataset.id)
    switch (adminConf) {
      case true:
        // API call to add emails to conference.confAdmins
        ConferenceAPI.updateConference({ confAdmins: [...props.conference[0].confAdmins, adminEmail] }, props.confId)
          .then(props.confcb(props.confId))
          .catch(err => console.log(err))
        break;
      default:
        let adminArr = props.conference[0].confAdmins
        const index = adminArr.indexOf(adminEmail)
        switch (index > -1) {
          case false:
            console.log({adminArr});
            break;
          default:
            ConferenceAPI.updateConference({ confAdmins: [...adminArr] }, props.confId)
              .then(props.confcb(props.confId))
              .catch(err => console.log(err))
        }
    }

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