import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Form, Button, Image } from "react-bootstrap";
import { AttendeeAPI, ConferenceAPI } from "../../utils/api";
import "./style.css";

const AttendeeTable = (props) => {
  const location = useLocation();

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
    AttendeeAPI.updateAttendeeById(e.target.dataset.id, { [e.target.name]: adminConf },)
      .then(props.attcb(props.conference[0]._id))
      .catch(err => console.log(err))
    let adminEmail = await getEmail(e.target.dataset.id)
    switch (adminConf) {
      case true:
        // API call to add emails to conference.confAdmins
        ConferenceAPI.updateConference({ ...props.conference[0], confAdmins: [...props.conference[0].confAdmins, adminEmail] }, props.conference[0]._id)
          .then(props.confcb(props.conference[0]._id))
          .catch(err => console.log(err))
        break;
      default:
        let adminArr = props.conference[0].confAdmins
        const index = adminArr.indexOf(adminEmail)
        switch (index > -1) {
          case false:
            console.log({ adminArr });
            break;
          default:
            ConferenceAPI.updateConference({ confAdmins: [...adminArr] }, props.conference[0]._id)
              .then(props.confcb(props.conference[0]._id))
              .catch(err => console.log(err))
        }
    }
  }

  return (
    <>
      {props.attendees.map(att => (
        <tr key={att._id}>
          <td>{att.familyName}</td>
          <td>{att.givenName}</td>
          <td>{att.email}</td>
          <td>{att.phone}</td>
          <td>{att.employerName}</td>
          <td>{att.emergencyContactName}</td>
          <td>{att.emergencyContactPhone}</td>
          <td>{att.allergies}</td>
          <td><Form.Check type="checkbox" name="isAdmin" value={att.isAdmin} data-id={att._id} aria-label="adminCheck" className="adminCheck" checked={att.isAdmin === true} onChange={handleInputChange} /></td>
          <td>
            <Link to={`/register_edit/${att.confId}`} className={location.pathname === `/register_edit/${att.confId}` ? "link active" : "link"}>
              <Button data-toggle="popover" title="Edit this attendee" className="tbleditbtn">
                <Image fluid="true" src="/images/edit-icon-2.png" className="tbledit" alt="Edit this attendee" data-attid={att._id} name="attEdit" />
              </Button>
            </Link>
          </td>
          <td>
            <Button data-toggle="popover" title="Delete this attendee" className="tbldeletebtn" data-confid={props.conference[0]._id} data-confname={props.conference[0].confName} data-attname={att.givenName + " " + att.familyName} data-email={att.email} name="admUnregAtt" onClick={props.delete}>
              <Image fluid="true" src="/images/trash-can.png" className="tbldelete" alt="Delete this attendee" data-confid={props.conference[0]._id} data-confname={props.conference[0].confName} data-attname={att.givenName + " " + att.familyName} data-email={att.email} name="admUnregAtt" onClick={props.delete} />
            </Button>
          </td>
        </tr>
      ))
      }
    </>
  )
}

export default AttendeeTable;