import React, { useState } from "react";
import { Button, Card } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { SessionModal } from "../modals";
import "./style.css";

const SchedSessCard = (props) => {
  const { user, isAuthenticated } = useAuth0();
  let nameArr = [];

  // Modal variables
  const [showSession, setShowSession] = useState(0);

  const handleShowSession = (e) => {
    const { dataset } = e.target;
    console.log(dataset.sessid);
    setShowSession(dataset.sessid);
  }
  const handleHideSession = () => {
    setShowSession(0);
  }

  // Filters props.presenter by sessId, then maps through the result to pull out presenter names
  const fetchPresNames = (sessId) => {
    const thesePres = props.presenters.filter(pres => pres.presSessionIds.includes(sessId))
    const presName = thesePres.map(pres => pres.presGivenName + " " + pres.presFamilyName)
    nameArr = [presName.join(", ")]
    return nameArr;
  }


  return (
    <>
      {(isAuthenticated &&
        (user.email === props.conference.ownerEmail || props.conference.confAdmins.includes(user.email)))
        ? <>
          {props.session[0] !== undefined
            ? <Card className="sched">
              <h3 className="textTight maxWidth">{props.session[0].sessName}</h3><br />
              <p className="textTight maxWidth">{fetchPresNames(props.session[0]._id)}</p><br />
              <Button className="button" data-sessid={props.session[0]._id} onClick={(e) => handleShowSession(e)}>Session Details</Button>
            </Card>
            : <Card className="schedBlue">
              <h3 className="textTight">Click to add session</h3>
            </Card>}
        </>
        : <>
          {props.session[0] !== undefined
            ? <Card className="sched">
              <h3 className="textTight maxWidth">{props.session[0].sessName}</h3><br />
              <p className="textTight maxWidth">{fetchPresNames(props.session[0]._id)}</p><br />
              <Button data-toggle="popover" title="Session details" className="button" data-sessid={props.session[0]._id} onClick={(e) => handleShowSession(e)}>Session Details</Button>
            </Card>
            : <Card className="schedBlue">
              <h3 className="textTight">FREE</h3>
            </Card>}
        </>}

      {props.session[0] !== undefined &&
        <SessionModal session={props.session[0]} presenter={props.presenters} conference={props.conference} show={showSession === props.session[0]._id} hide={(e) => handleHideSession(e)} />}
    </>
  )
}

export default SchedSessCard;