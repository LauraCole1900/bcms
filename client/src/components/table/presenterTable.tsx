import React, { ReactElement } from "react";
import "./style.css";

interface Presenter {
  confId: string,
  presGivenName: string,
  presFamilyName: string,
  presOrg: string,
  presBio: string,
  presEmail: string,
  presPhone: string,
  presWebsite: string,
  presPic: string,
  presSessionIds: string[],
  presKeynote: string,
  presAccepted: string,
  _id: string
}

const PresenterTable = ({ presenters }: { presenters: Presenter[] }): ReactElement => {

  
  return (
    <>
      {presenters.map((pres: Presenter) => (
        <tr key={pres._id}>
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