import React, { ReactElement } from "react";
import { ObjectId } from "mongoose";
import "./style.css";

interface Presenter {
  confId: ObjectId,
  presGivenName: string,
  presFamilyName: string,
  presOrg: string,
  presBio: string,
  presEmail: string,
  presPhone: string,
  presWebsite: string,
  presPic: string,
  presSessionIds: ObjectId[],
  presKeynote: string,
  presAccepted: string,
  _id: ObjectId
}

const PresenterTable = ({ presenters }: { presenters: Presenter[] }): ReactElement => {

  
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