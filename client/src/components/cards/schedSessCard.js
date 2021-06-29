import React, { useState } from "react";
import { Button, Card } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { AssignModal, ErrorModal, SessionModal, SuccessModal } from "../modals";
import "./style.css";

const SchedSessCard = (props) => {
  const { user, isAuthenticated } = useAuth0();
  let nameArr = [];
  const [thisSess, setThisSess] = useState();
  const [room, setRoom] = useState("");
  const [time, setTime] = useState("");
  const [btnName, setBtnName] = useState("");
  const [errThrown, setErrThrown] = useState();

  // Modal variables
  const [showDetails, setShowDetails] = useState("0");
  const [showAssign, setShowAssign] = useState("0");
  const [showError, setShowError] = useState("0");

  // Show & hide SessionModal
  const handleShowDetails = (e) => {
    const { dataset } = e.target;
    setShowDetails(dataset.sessid);
  }
  const handleHideDetails = () => {
    setShowDetails(0);
  }

  // Show & hide AssignModal
  const handleShowAssign = (e) => {
    const { dataset } = e.target;
    setRoom(dataset.room);
    setTime(dataset.time);
    setShowAssign(dataset.room && dataset.time);
  }
  const handleHideAssign = () => {
    setShowAssign("none");
  }

  // Show & hide SuccessModal
  const handleShowSuccess = (e) => {
    handleHideAssign();
    props.setShowSuccess(room && time);
  }
  const handleHideSuccess = () => {
    props.setShowSuccess("none");
  }

  // Show & hide ErrorModal
  const handleShowError = () => {
    handleHideAssign();
    setShowError(room && time);
  }
  const handleHideError = () => {
    setShowError("none");
  }

  // sets error message in state
  const setErrorThrown = (data) => setErrThrown(data);

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
              <Button data-toggle="popover" title="Session Details" className="button" data-sessid={props.session[0]._id} onClick={(e) => handleShowDetails(e)}>Session Details</Button>
            </Card>
            : <Card className="schedBlue">
              <h3 data-toggle="popover" title="Assign Session" className="textTight clickable" data-room={props.room} data-time={props.time} onClick={(e) => handleShowAssign(e)}>Click to assign session</h3>
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

      <AssignModal allSess={props.allSess} conference={props.conference} room={props.room} startTime={props.startTime} endTime={props.endTime} date={props.date} setThisSess={setThisSess} setBtnName={setBtnName} errThrown={setErrorThrown} handleShowError={handleShowError} handleShowSuccess={handleShowSuccess} show={showAssign === (props.room && props.time)} hide={(e) => handleHideAssign(e)} urlid={props.urlid} urltype={props.urltype} change={props.change} />

      <SuccessModal session={thisSess} confname={props.conference.confName} conference={props.conference} btnname={btnName} urlid={props.urlid} urltype={props.urltype} show={props.showSuccess === (props.room && props.time)} hide={() => handleHideSuccess()} />

      <ErrorModal conference={props.conference} session={thisSess} confname={props.conference.confName} urlid={props.urlid} urltype={props.urltype} btnname={btnName} errmsg={errThrown} show={showError === (props.room && props.time)} hide={() => handleHideError()} />
    </>
  )
}

export default SchedSessCard;