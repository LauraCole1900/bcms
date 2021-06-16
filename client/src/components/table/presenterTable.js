import React from "react";
import "./style.css";

const PresenterTable = ({ presenters }) => {

  
  return (
    <>
      {presenters.map(pres => (
        <tr key={pres._id}>
          <td>{pres.presFamilyName}</td>
          <td>{pres.presGivenName}</td>
          <td>{pres.presEmail}</td>
          <td>{pres.presPhone}</td>
          <td>{pres.presOrg}</td>
          <td>{pres.presWebsite}</td>
          <td>{pres.presSessionIds.join(", ")}</td>
          <td>{pres.sessionName}</td>
        </tr>
      ))
      }
    </>
  )
}

export default PresenterTable;