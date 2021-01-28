import React from "react";
import "./style.css";

const PresenterTable = ({ presenters }) => {
  return (
    <>
      {presenters.map(e => (
        <tr key={e._id}>
          <td>{e.presFamilyName}</td>
          <td>{e.presGivenName}</td>
          <td>{e.presEmail}</td>
          <td>{e.presPhone}</td>
          <td>{e.presOrg}</td>
          <td>{e.presWebsite}</td>
          <td>{e.presSessionIds}</td>
          <td>{e.sessionName}</td>
        </tr>
      ))
      }
    </>
  )
}

export default PresenterTable;