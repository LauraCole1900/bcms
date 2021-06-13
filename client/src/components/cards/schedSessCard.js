import React from "react";
import { Card } from "react-bootstrap";
import "./style.css";

const SchedSessCard = (props) => {
  let nameArr = [];

  // Filters props.presenter by sessId, then maps through the result to pull out presenter names
  const fetchPresNames = (sessId) => {
    const thesePres = props.presenter.filter(pres => pres.presSessionIds.includes(sessId))
    const presName = thesePres.map(pres => pres.presGivenName + " " + pres.presFamilyName)
    nameArr = [presName.join(", ")]
    return nameArr;
  }
  

  return (
    <Card className="sched">
      <h3>{props.session.sessName}</h3>
      <h4>{fetchPresNames(props.session._id)}</h4>
    </Card>
  )
}

export default SchedSessCard;