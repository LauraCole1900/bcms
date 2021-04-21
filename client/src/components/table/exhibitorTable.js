import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Form, Image } from "react-bootstrap";
import { ExhibitorAPI } from "../../utils/api";
import "./style.css";

const ExhibitorTable = (props) => {
  const location = useLocation();
  const [booth, setBooth] = useState(props.exhibitors.exhBoothNum);

  // handles input to booth number field
  const handleInputChange = (e) => {
    setBooth(e.target.value)
  }

  // APT call to update exhibitor document onSubmit
  const handleSubmit = (e) => {
    if (e.charCode === 13 && e.shiftKey === false) {
      console.log("from exhTable handleSubmit", { booth })
      ExhibitorAPI.updateExhibitor({ exhBoothNum: booth }, e.target.dataset.id)
        .then(props.exhcb(props.conference[0]._id))
        .catch(err => console.log(err))
    }
  }

  return (
    <>
      {props.exhibitors.map(exh => (
        <tr key={exh._id}>
          <td>{exh.exhFamilyName}</td>
          <td>{exh.exhGivenName}</td>
          <td>{exh.exhEmail}</td>
          <td>{exh.exhPhone}</td>
          <td>{exh.exhCompany}</td>
          <td>{exh.exhWorkerName1}</td>
          <td>{exh.exhWorkerName2}</td>
          <td>{exh.exhWorkerName3}</td>
          <td>{exh.exhWorkerName4}</td>
          <td>{exh.exhSpaces}</td>
          <td>{exh.exhAttend}</td>
          <td><Form.Control type="input" name="exhBoothNum" value={booth} data-id={exh._id} className="formInput" onChange={handleInputChange} onKeyPress={handleSubmit} /></td>
          <td>
            <Link to={`/admin_edit_exh/${exh._id}`} className={location.pathname === `/admin_edit_exh/${exh._id}` ? "link active" : "link"}>
              <Button data-toggle="popover" title="Edit this exhibit" className="tbleditbtn">
                <Image fluid="true" src="/images/edit-icon-2.png" className="tbledit" alt="Edit this exhibit" data-attid={exh._id} name="attEdit" />
              </Button>
            </Link>
          </td>
          <td>
            <Button data-toggle="popover" title="Delete this exhibit" className="tbldeletebtn" data-confid={props.conference[0]._id} data-confname={props.conference[0].confName} data-exhname={exh.exhCompany} data-email={exh.exhEmail} name="admUnregExh" onClick={props.delete}>
              <Image fluid="true" src="/images/trash-can.png" className="tbldelete" alt="Delete this exhibit" data-confid={props.conference[0]._id} data-confname={props.conference[0].confName} data-exhname={exh.exhCompany} data-email={exh.exhEmail} name="admUnregExh" onClick={props.delete} />
            </Button>
          </td>
        </tr>
      ))
      }
    </>
  )
}

export default ExhibitorTable;