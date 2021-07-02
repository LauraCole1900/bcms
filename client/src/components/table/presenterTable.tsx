import React, { ReactElement } from "react";
import { Presenter } from "../../utils/interfaces";
import "./style.css";

const PresenterTable = ({ presenters }: { presenters: Array<Presenter> }): ReactElement => {

  
  return (
    <>
      {presenters.map((pres: Presenter) => (
        <tr key={pres._id.toString()}>
          <td>{pres.presFamilyName}</td>
          <td>{pres.presGivenName}</td>
          <td>{pres.presEmail}</td>
          <td>{pres.presPhone}</td>
          <td>{pres.presOrg}</td>
          <td>{pres.presWebsite}</td>
          <td>{pres.presSessionIds.join(", ")}</td>
        </tr>
      ))
      }
    </>
  )
}

export default PresenterTable;