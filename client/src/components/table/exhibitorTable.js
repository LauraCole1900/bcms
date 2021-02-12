import React from "react";
import "./style.css";

const ExhibitorTable = ({ exhibitors }) => {
  return (
    <>
      {exhibitors.map(exh => (
        <tr key={exh._id}>
          <td>{exh.exhFamilyName}</td>
          <td>{exh.exhGivenName}</td>
          <td>{exh.exhEmail}</td>
          <td>{exh.exhPhone}</td>
          <td>{exh.exhCompany}</td>
          <td>{exh.exhWorkerNames}</td>
          <td>{exh.exhSpaces}</td>
          <td>{exh.exhAttend}</td>
        </tr>
      ))
      }
    </>
  )
}

export default ExhibitorTable;