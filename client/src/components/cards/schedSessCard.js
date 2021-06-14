import React from "react";
import { Card } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import "./style.css";

const SchedSessCard = (props) => {
  const { user, isAuthenticated } = useAuth0();
  let nameArr = [];

  // Filters props.presenter by sessId, then maps through the result to pull out presenter names
  const fetchPresNames = (sessId) => {
    const thesePres = props.presenters.filter(pres => pres.presSessionIds.includes(sessId))
    const presName = thesePres.map(pres => pres.presGivenName + " " + pres.presFamilyName)
    nameArr = [presName.join(", ")]
    return nameArr;
  }


  return (
    <>
      {isAuthenticated &&
        (user.email === props.conference.ownerEmail || props.conference.confAdmins.includes(user.email))
        ? <>
          {props.schedule !== undefined
            ? <Card className="sched">
              <h3>{props.session.sessName}</h3>
              <h4>{fetchPresNames(props.session._id)}</h4>
            </Card>
            : <Card className="schedBlue">
              <h3 className="textTight">Click to add session</h3>
            </Card>}
        </>
        : <>
          <Card className="schedBlue">
            <h3 className="textTight">FREE</h3>
          </Card>
        </>}
    </>
  )
}

export default SchedSessCard;