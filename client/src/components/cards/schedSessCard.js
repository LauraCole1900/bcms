import React, { useState } from "react";
import { Button, Card } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { SessionModal } from "../modals";
import "./style.css";

const SchedSessCard = (props) => {
  const { user, isAuthenticated } = useAuth0();
  let nameArr = [];

  // Modal variables
  const [showDetails, setShowDetails] = useState(0);
  const [showAssign, setShowAssign] = useState(0);

  const handleShowDetails = (e) => {
    const { dataset } = e.target;
    console.log(dataset.sessid);
    setShowDetails(dataset.sessid);
  }
  const handleHideDetails = () => {
    setShowDetails(0);
  }

  const handleShowAssign = (e) => {
    // Probably will make use of props.allSess, props.room, and props.time
    // Bring up modal to choose from existing sessions + option to create new session
    // New option sends user to session form
    const { name, value, dataset } = e.target;

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
              <Button className="button" data-sessid={props.session[0]._id} onClick={(e) => handleShowDetails(e)}>Session Details</Button>
            </Card>
            : <Card className="schedBlue">
              <h3 className="textTight" onClick={(e) => handleShowAssign(e)}>Click to add session</h3>
            </Card>}
        </>
        : <>
          {props.session[0] !== undefined
            ? <Card className="sched">
              <h3 className="textTight maxWidth">{props.session[0].sessName}</h3><br />
              <p className="textTight maxWidth">{fetchPresNames(props.session[0]._id)}</p><br />
              <Button data-toggle="popover" title="Session details" className="button" data-sessid={props.session[0]._id} onClick={(e) => handleShowDetails(e)}>Session Details</Button>
            </Card>
            : <Card className="schedBlue">
              <h3 className="textTight">FREE</h3>
            </Card>}
        </>}

      {props.session[0] !== undefined &&
        <SessionModal allsess={props.allSess} session={props.session[0]} presenter={props.presenters} conference={props.conference} show={showDetails === props.session[0]._id} hide={(e) => handleHideDetails(e)} />}
    </>
  )
}

export default SchedSessCard;