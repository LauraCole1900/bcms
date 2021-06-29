import React, { ChangeEvent, ReactElement } from "react";
import { Link, useLocation } from "react-router-dom";
import { Location } from "history";
import { Form, Button, Image } from "react-bootstrap";
import { AttendeeAPI, ConferenceAPI } from "../../utils/api";
import { AxiosError } from "axios";
import "./style.css";

interface Attendee {
  confId: string,
  email: string,
  givenName: string,
  familyName: string,
  phone: string,
  employerName: string,
  employerAddress: string,
  emergencyContactName: string,
  emergencyContactPhone: string,
  allergyConfirm: string,
  allergies: string[],
  waiverSigned: boolean,
  paid: boolean,
  isAdmin: string,
  _id: string
}

const AttendeeTable = (props: any): ReactElement => {
  const location = useLocation<Location>();

  const getEmail = (id: string): string | undefined => {
    const adminObj: Attendee = props.attendees.find((attendee: Attendee) => attendee._id === id)
    const adminEmail: string = adminObj.email
    return adminEmail
  }

  // Click handler for "isAdmin" checkbox
  const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const { dataset, name, value } = e.target;
    console.log("Attendee table", value, dataset.id);
    let adminConf: string;
    // Define data to be changed based on existing checkbox value
    switch (value) {
      case "yes":
        adminConf = "no";
        break;
      default:
        adminConf = "yes";
    }
    // API call to update attendee document
    AttendeeAPI.updateAttendeeById({ [name]: adminConf }, dataset.id)
      .then(props.attcb(props.conference[0]._id))
      .catch((err: AxiosError) => console.log(err))
    let adminEmail: string | undefined = await getEmail(dataset.id!)
    switch (adminConf) {
      case "yes":
        // API call to add emails to conference.confAdmins
        ConferenceAPI.updateConference({ ...props.conference[0], confAdmins: [...props.conference[0].confAdmins, adminEmail] }, props.conference[0]._id)
          .then(props.confcb(props.conference[0]._id))
          .catch((err: AxiosError) => console.log(err))
        break;
      default:
        let adminArr: string[] = props.conference[0].confAdmins
        const index = adminArr.indexOf(adminEmail!)
        switch (index !== -1) {
          case false:
            console.log({ adminArr });
            break;
          default:
            const filteredAdmin: string[] = adminArr.filter((email: string) => email !== adminEmail)
            ConferenceAPI.updateConference({ confAdmins: [...filteredAdmin] }, props.conference[0]._id)
              .then(props.confcb(props.conference[0]._id))
              .catch((err: AxiosError) => console.log(err))
        }
    }
  }
  

  return (
    <>
      {props.attendees.map((att: Attendee) => (
        <tr key={att._id}>
          <td>{att.familyName}</td>
          <td>{att.givenName}</td>
          <td>{att.email}</td>
          <td>{att.phone}</td>
          <td>{att.employerName}</td>
          <td>{att.emergencyContactName}</td>
          <td>{att.emergencyContactPhone}</td>
          <td>{att.allergies}</td>
          <td><Form.Check type="checkbox" name="isAdmin" value={att.isAdmin} data-id={att._id} aria-label="adminCheck" className="adminCheck" checked={att.isAdmin === "yes"} onChange={handleInputChange} /></td>
          <td>
            <Link to={`/admin_edit_att/${att._id}`} className={location.pathname === `/admin_edit_att/${att._id}` ? "link active" : "link"}>
              <Button data-toggle="popover" title="Edit this attendee" className="tbleditbtn" name="attEdit">
                <Image fluid src="/images/edit-icon-2.png" className="tbledit" alt="Edit this attendee" data-attid={att._id} />
              </Button>
            </Link>
          </td>
          <td>
            <Button data-toggle="popover" title="Delete this attendee" className="tbldeletebtn" data-confid={props.conference[0]._id} data-confname={props.conference[0].confName} data-attname={att.givenName + " " + att.familyName} data-email={att.email} name="admUnregAtt" onClick={props.delete}>
              <Image fluid src="/images/trash-can.png" className="tbldelete" alt="Delete this attendee" data-confid={props.conference[0]._id} data-confname={props.conference[0].confName} data-attname={att.givenName + " " + att.familyName} data-email={att.email} onClick={props.delete} />
            </Button>
          </td>
        </tr>
      ))
      }
    </>
  )
}

export default AttendeeTable;