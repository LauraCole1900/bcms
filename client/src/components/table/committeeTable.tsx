import React, { ChangeEvent, MouseEvent, ReactElement } from "react";
import { Form, Button, Image } from "react-bootstrap";
import { CommitteeAPI } from "../../utils/api";
import { Committee } from "../../utils/interfaces";
import { AxiosError, AxiosResponse } from "axios";
import "./style.css";

const CommitteeTable = (props: any): ReactElement => {

  const getEmail = (id: string | undefined): string => {
    const chairObj: Committee = props.committee.find((comm: Committee) => comm._id.toString() === id)
    const chairEmail: string = chairObj.commEmail
    return chairEmail
  }

  // Click handler for "edit member" button
  const handleSelect = (e: MouseEvent<HTMLElement>, data: object): any | void => {
    e.preventDefault();
    props.setMember(data);
    console.log("click", data);
  }

  const handleDelete = (e: MouseEvent<HTMLElement>, confId: any, confName: string, email: string, commGivenName: string, commFamilyName: string): any | void => {
    console.log("click", e.target);
    const { dataset } = e.target as HTMLButtonElement;
    console.log(e.target);
    props.setBtnName(dataset.name);
    props.setEvent(e.target);
    props.delete(confId, confName, email, commGivenName, commFamilyName);
  }

  // Click handler for "isChair" radio button
  const handleInputChange = async (e: ChangeEvent<HTMLInputElement>, id: any): Promise<any | void> => {
    console.log("Committee table", id);
    props.setBtnName("chair");
    props.setConfName(props.conference[0].confName);
    const commChairNo: Committee = props.committee.find((comm: Committee) => comm.isChair === "yes")
    console.log({ commChairNo });
    if (commChairNo !== undefined) {
      CommitteeAPI.updateCommMember({ ...commChairNo, isChair: "no" }, commChairNo.confId, commChairNo.commEmail)
      .then((resp: AxiosResponse<Committee>) => {
        if (resp.status !== 422) {
          console.log(resp);
        }
      })
      .catch((err: AxiosError) => {
        console.log(err);
        props.setErrThrown(err.message);
        props.handleShowErr();
      })
    }
    const commChairYes: Committee = props.committee.find((comm: Committee) => comm._id.toString() === id)
    props.setCommName(`${commChairYes.commGivenName} ${commChairYes.commFamilyName}`)
    console.log({ commChairYes });
    CommitteeAPI.updateCommMemberById({ ...commChairYes, isChair: "yes" }, commChairYes._id)
      .then((resp: AxiosResponse<Committee>) => {
        if (resp.status !== 422) {
          props.handleShowSuccess();
        }
      })
      .catch((err: AxiosError) => {
        console.log(err);
        props.setErrThrown(err.message);
        props.handleShowErr();
      })
  }


  return (
    <>
      {props.committee.map((comm: Committee) => (
        <tr key={comm._id.toString()}>
          <td>{comm.commFamilyName}</td>
          <td>{comm.commGivenName}</td>
          <td>{comm.commEmail}</td>
          <td>{comm.commPhone}</td>
          <td>{comm.commOrg}</td>
          <td><Form.Check
            type="radio"
            name="isChair"
            value={comm.isChair}
            aria-label="adminCheck"
            className="adminCheck"
            checked={comm.isChair === "yes"}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(e, comm._id)}
          /></td>
          <td>
            <Button
              data-toggle="popover"
              title="Edit this member"
              className="tbleditbtn"
              data-name="commEdit"
              onClick={(e: MouseEvent<HTMLElement>) => handleSelect(e, comm)}
            >
              <Image
                fluid src="/images/edit-icon-2.png"
                className="tbledit"
                alt="Edit this member"
                data-commid={comm._id}
                data-name="commEdit"
                onClick={(e: MouseEvent<HTMLElement>) => handleSelect(e, comm)}
              />
            </Button>
          </td>
          <td>
            <Button
              data-toggle="popover"
              title="Remove this member"
              className="tbldeletebtn"
              data-confid={props.conference[0]._id}
              data-confname={props.conference[0].confName}
              data-commname={comm.commGivenName + " " + comm.commFamilyName}
              data-email={comm.commEmail}
              data-name="delComm"
              onClick={(e: MouseEvent<HTMLElement>) => handleDelete(e, props.conference[0]._id, props.conference[0].confName, comm.commEmail, comm.commGivenName, comm.commFamilyName)}
            >
              <Image
                fluid
                src="/images/trash-can.png"
                className="tbldelete"
                alt="Remove this member"
                data-confid={props.conference[0]._id}
                data-confname={props.conference[0].confName}
                data-commname={comm.commGivenName + " " + comm.commFamilyName}
                data-name="delComm" data-email={comm.commEmail}
                onClick={(e: MouseEvent<HTMLElement>) => handleDelete(e, props.conference[0]._id, props.conference[0].confName, comm.commEmail, comm.commGivenName, comm.commFamilyName)}
              />
            </Button>
          </td>
        </tr>
      ))
      }
    </>
  )
}

export default CommitteeTable;