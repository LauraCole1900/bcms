import React, { useState, ChangeEvent, MouseEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { Form, Button, Image } from "react-bootstrap";
import { CommitteeAPI, ConferenceAPI } from "../../utils/api";
import { AxiosError, AxiosResponse } from "axios";
import "./style.css";

interface Committee {
  confId: string,
  commEmail: string,
  commGivenName: string,
  commFamilyName: string,
  commOrg: string,
  commPhone: string,
  isChair: string,
  _id: string
}

const CommitteeTable = (props: any): object => {
  const location = useLocation();

  const getEmail = (id: string | undefined): string => {
    const chairObj: Committee = props.committee.find((comm: Committee) => comm._id === id)
    const chairEmail: string = chairObj.commEmail
    return chairEmail
  }

  // Click handler for "edit member" button
  const handleSelect = (e: MouseEvent<HTMLElement>, data: object): any | void => {
    e.preventDefault();
    props.setThisMember(data);
    console.log("click", data);
  }

  const handleDelete = (e: MouseEvent<HTMLElement>, data: object): any | void => {
    console.log("click", e.target);
    const { dataset } = e.target as HTMLButtonElement;
    console.log(e.target);
    props.setBtnName(dataset.name);
    props.setEvent(e.target);
    props.delete(data);
  }

  // Click handler for "isChair" checkbox
  const handleInputChange = async (e: ChangeEvent<HTMLInputElement>): Promise<any | void> => {
    const { dataset, name, value } = e.target;
    console.log("Committee table", value, dataset.id);
    let commChair: string;
    // Define data to be changed based on existing checkbox value
    switch (value) {
      case "true":
        commChair = "false";
        break;
      default:
        commChair = "true";
    }
    // API call to update conference document TO ADD/REMOVE ADMINS -- may not be necessary here!
    ConferenceAPI.updateConference(dataset.id, { [name]: commChair },)
      .then(props.commcb(props.conference[0]._id))
      .catch((err: AxiosError) => console.log(err))
    let chairEmail = await getEmail(dataset.id)
    switch (commChair) {
      case "true":
        // API call to add emails to conference.confSessProposalCommittee
        ConferenceAPI.updateConference({ ...props.conference[0], confSessProposalCommittee: [...props.conference[0].confSessProposalCommittee, chairEmail] }, props.conference[0]._id)
          .then(props.confcb(props.conference[0]._id))
          .catch(err => console.log(err))
        break;
      default:
        let chairArr = props.conference[0].confSessProposalCommittee
        const index = chairArr.indexOf(chairEmail)
        switch (index > -1) {
          case false:
            console.log({ chairArr });
            break;
          default:
            ConferenceAPI.updateConference({ confSessProposalCommittee: [...chairArr] }, props.conference[0]._id)
              .then(props.confcb(props.conference[0]._id))
              .catch(err => console.log(err))
        }
    }
  }


  return (
    <>
      {props.committee.map((comm: Committee) => (
        <tr key={comm._id}>
          <td>{comm.commFamilyName}</td>
          <td>{comm.commGivenName}</td>
          <td>{comm.commEmail}</td>
          <td>{comm.commPhone}</td>
          <td>{comm.commOrg}</td>
          <td><Form.Check type="radio" name="isChair" value={comm.isChair} data-id={comm._id} aria-label="adminCheck" className="adminCheck" checked={comm.isChair === "true"} onChange={handleInputChange} /></td>
          <td>
            <Button data-toggle="popover" title="Edit this member" className="tbleditbtn" data-btnname="commEdit" onClick={(e) => handleSelect(e, comm)}>
              <Image fluid src="/images/edit-icon-2.png" className="tbledit" alt="Edit this member" data-commid={comm._id} data-name="commEdit" onClick={(e) => handleSelect(e, comm)} />
            </Button>
          </td>
          <td>
            <Button data-toggle="popover" title="Remove this member" className="tbldeletebtn" data-confid={props.conference[0]._id} data-confname={props.conference[0].confName} data-commname={comm.commGivenName + " " + comm.commFamilyName} data-email={comm.commEmail} data-name="delComm" onClick={(e) => handleDelete(e, comm)}>
              <Image fluid src="/images/trash-can.png" className="tbldelete" alt="Remove this member" data-confid={props.conference[0]._id} data-confname={props.conference[0].confName} data-commname={comm.commGivenName + " " + comm.commFamilyName} data-name="delComm" data-email={comm.commEmail} />
            </Button>
          </td>
        </tr>
      ))
      }
    </>
  )
}

export default CommitteeTable;