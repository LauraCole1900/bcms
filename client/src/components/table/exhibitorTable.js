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
          <td>{exh.exhWorkerName1}</td>
          <td>{exh.exhWorkerName2}</td>
          <td>{exh.exhWorkerName3}</td>
          <td>{exh.exhWorkerName4}</td>
          <td>{exh.exhSpaces}</td>
          <td>{exh.exhAttend}</td>
        </tr>
      ))
      }
    </>
  )
}

export default ExhibitorTable;