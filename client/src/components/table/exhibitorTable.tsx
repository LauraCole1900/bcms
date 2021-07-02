import React, { ChangeEvent, FormEvent, ReactElement, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Location } from "history";
import { ObjectId } from "mongoose";
import { Button, Form, Image } from "react-bootstrap";
import { ExhibitorAPI } from "../../utils/api";
import { Exhibitor } from "../../utils/interfaces";
import "./style.css";

const ExhibitorTable = (props: any): ReactElement => {
  const location = useLocation<Location>();
  const [exhibitor, setExhibitor] = useState<Exhibitor>();

  // handles input to booth number field
  // const handleInputChange = (e: ChangeEvent<HTMLInputElement>): string | void => {
  //   const { name, value } = e.target;
  //   setExhibitor({ ...exhibitor!, [name]: value })
  // }

  // API call to update exhibitor document onSubmit
  // const handleSubmit = (e: FormEvent<HTMLElement>): string | void => {
  //   const { dataset } = e.target as HTMLInputElement;
  //   if (e.key === "Enter") {
  //     console.log("from exhTable handleSubmit", { exhibitor })
  //     ExhibitorAPI.updateExhibitor({ ...exhibitor }, dataset.id)
  //       .then(props.exhcb(props.conference[0]._id))
  //       .catch(err => console.log(err))
  //   }
  // }


  return (
    <>
      {props.exhibitors.map((exh: Exhibitor) => (
        <tr key={exh._id.toString()}>
          <td>{exh.exhFamilyName}</td>
          <td>{exh.exhGivenName}</td>
          <td>{exh.exhEmail}</td>
          <td>{exh.exhPhone}</td>
          <td>{exh.exhCompany}</td>
          <td>{exh.exhWorkerNames}</td>
          <td>{exh.exhSpaces}</td>
          <td>{exh.exhAttend}</td>
          <td>{exh.exhBoothNum}</td>
          {/* <td><Form.Control type="input" name="exhBoothNum" value={exh.exhBoothNum} data-id={exh._id} className="formInput" onChange={handleInputChange} onSubmit={handleSubmit} /></td> */}
          <td>
            <Link to={`/admin_edit_exh/${exh._id}`} className={location.pathname === `/admin_edit_exh/${exh._id}` ? "link active" : "link"}>
              <Button data-toggle="popover" title="Edit this exhibit" className="tbleditbtn" name="attEdit">
                <Image src="/images/edit-icon-2.png" className="tbledit" alt="Edit this exhibit" data-attid={exh._id} />
              </Button>
            </Link>
          </td>
          <td>
            <Button data-toggle="popover" title="Delete this exhibit" className="tbldeletebtn" data-confid={props.conference[0]._id} data-confname={props.conference[0].confName} data-exhname={exh.exhCompany} data-email={exh.exhEmail} name="admUnregExh" onClick={props.delete}>
              <Image src="/images/trash-can.png" className="tbldelete" alt="Delete this exhibit" data-confid={props.conference[0]._id} data-confname={props.conference[0].confName} data-exhname={exh.exhCompany} data-email={exh.exhEmail} onClick={props.delete} />
            </Button>
          </td>
        </tr>
      ))
      }
    </>
  )
}

export default ExhibitorTable;