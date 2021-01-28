import React from "react";
import "./style.css";

const ExhibitorTable = ({ exhibitors }) => {
  return (
    <>
      {exhibitors.map(e => (
        <tr key={e._id}>
          <td>{e.exhFamilyName}</td>
          <td>{e.exhGivenName}</td>
          <td>{e.exhEmail}</td>
          <td>{e.exhPhone}</td>
          <td>{e.exhCompany}</td>
          <td>{e.exhWorkerNames}</td>
          <td>{e.exhSpaces}</td>
          <td>{e.exhAttend}</td>
        </tr>
      ))
      }
    </>
  )
}

export default ExhibitorTable;