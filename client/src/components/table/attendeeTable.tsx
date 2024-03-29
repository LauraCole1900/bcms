import React, { ChangeEvent, ReactElement } from "react";
import { Link, useLocation } from "react-router-dom";
import { Location } from "history";
import { ObjectId } from "mongoose";
import { Form, Button, Image } from "react-bootstrap";
import { AttendeeAPI, ConferenceAPI } from "../../utils/api";
import { Attendee } from "../../utils/interfaces";
import { AxiosError } from "axios";
import "./style.css";

const AttendeeTable = (props: any): ReactElement => {
  const location = useLocation<Location>();

  const getEmail = (id: string): string | undefined => {
    const adminObj: Attendee = props.attendees.find((attendee: Attendee) => attendee._id.toString() === id)
    const adminEmail: string = adminObj.email
    return adminEmail
  }

  // Click handler for "isAdmin" checkbox
  const handleInputChange = async (e: ChangeEvent<HTMLInputElement>, id: any) => {
    const { name, value } = e.target;
    console.log("Attendee table", value, id);
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
    AttendeeAPI.updateAttendeeById({ [name]: adminConf }, id)
      .then(props.attcb(props.conference[0]._id))
      .catch((err: AxiosError) => console.log(err))
    let adminEmail: string | undefined = await getEmail(id!)
    switch (adminConf) {
      case "yes":
        // API call to add emails to conference.confAdmins
        ConferenceAPI.updateConference({ ...props.conference[0], confAdmins: [...props.conference[0].confAdmins, adminEmail] }, props.conference[0]._id)
          .then(props.confcb(props.conference[0]._id))
          .catch((err: AxiosError) => console.log(err))
        break;
      default:
        let adminArr: Array<string> = props.conference[0].confAdmins
        const index = adminArr.indexOf(adminEmail!)
        switch (index !== -1) {
          case false:
            console.log({ adminArr });
            break;
          default:
            const filteredAdmin: Array<string> = adminArr.filter((email: string) => email !== adminEmail)
            ConferenceAPI.updateConference({ confAdmins: [...filteredAdmin] }, props.conference[0]._id)
              .then(props.confcb(props.conference[0]._id))
              .catch((err: AxiosError) => console.log(err))
        }
    }
  }


  return (
    <>
      {props.attendees.map((att: Attendee) => (
        <tr key={att._id.toString()}>
          <td>{att.familyName}</td>
          <td>{att.givenName}</td>
          <td>{att.email}</td>
          <td>{att.phone}</td>
          <td>{att.employerName}</td>
          <td>{att.emergencyContactName}</td>
          <td>{att.emergencyContactPhone}</td>
          <td>{att.allergies}</td>
          <td><Form.Check
            type="checkbox"
            name="isAdmin"
            value={att.isAdmin}
            aria-label="adminCheck"
            className="adminCheck"
            checked={att.isAdmin === "yes"}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(e, att._id)}
          /></td>
          <td>
            <Link
              to={`/admin_edit_att/${att._id}`}
              className={location.pathname === `/admin_edit_att/${att._id}` ? "link active" : "link"}
            >
              <Button
                data-toggle="popover"
                title="Edit this attendee"
                className="tbleditbtn"
                name="attEdit"
              >
                <Image
                  fluid
                  src="/images/edit-icon-2.png"
                  className="tbledit"
                  alt="Edit this attendee"
                />
              </Button>
            </Link>
          </td>
          <td>
            <Button
              data-toggle="popover"
              title="Delete this attendee"
              className="tbldeletebtn"
              name="admUnregAtt"
              onClick={() => props.delete(props.conference[0]._id, props.conference[0].confName, att.givenName, att.familyName, att.email)}
            >
              <Image
                fluid
                src="/images/trash-can.png"
                className="tbldelete"
                alt="Delete this attendee"
                onClick={() => props.delete(props.conference[0]._id, props.conference[0].confName, att.givenName, att.familyName, att.email)}
              />
            </Button>
          </td>
        </tr>
      ))
      }
    </>
  )
}

export default AttendeeTable;