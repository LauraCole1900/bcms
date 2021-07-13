import React, { MouseEvent, ReactElement, useState } from "react";
import { ObjectId } from "mongoose";
import { Button, Card } from "react-bootstrap";
import { useAuth0, User } from "@auth0/auth0-react";
import { AssignModal, ErrorModal, SessionModal, SuccessModal } from "../modals";
import { Presenter, Session } from "../../utils/interfaces";
import "./style.css";

const SchedSessCard = (props: any): ReactElement => {
  const { user, isAuthenticated } = useAuth0<User>();
  let nameArr: Array<string>;
  const [thisSess, setThisSess] = useState<Session>();
  const [room, setRoom] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [btnName, setBtnName] = useState<string>("");
  const [errThrown, setErrThrown] = useState<string>();

  // Modal variables
  const [showDetails, setShowDetails] = useState<string>("none");
  const [showAssign, setShowAssign] = useState<string>("none");
  const [showError, setShowError] = useState<string>("none");

  // Show & hide SessionModal
  const handleShowDetails = (e: MouseEvent): ReactElement | void => {
    const { dataset } = e.target as HTMLButtonElement;
    setShowDetails(dataset.sessid!);
  }
  const handleHideDetails = () => setShowDetails("none");

  // Show & hide AssignModal
  const handleShowAssign = (e: MouseEvent): ReactElement | void => {
    const { dataset } = e.target as HTMLButtonElement;
    setRoom(dataset.room!);
    setTime(dataset.time!);
    setShowAssign(dataset.room! && dataset.time!);
  }
  const handleHideAssign = () => setShowAssign("none");

  // Show & hide SuccessModal
  const handleShowSuccess = (e: MouseEvent): ReactElement | void => {
    handleHideAssign();
    props.setShowSuccess(room && time);
  }
  const handleHideSuccess = () => props.setShowSuccess("none");

  // Show & hide ErrorModal
  const handleShowError = () => {
    handleHideAssign();
    setShowError(room && time);
  }
  const handleHideError = () => {
    setShowError("none");
  }

  // sets error message in state
  const setErrorThrown = (data: string): string | void => setErrThrown(data);

  // Filters props.presenter by sessId, then maps through the result to pull out presenter names
  const fetchPresNames = (sessId: ObjectId) => {
    const thesePres: Array<Presenter> = props.presenters.filter((pres: Presenter) => pres.presSessionIds.includes(sessId))
    const presName: Array<string> = thesePres.map((pres: Presenter) => pres.presGivenName + " " + pres.presFamilyName)
    nameArr = [presName.join(", ")]
    return nameArr;
  }


  return (
    <>
      {(isAuthenticated &&
        (user!.email === props.conference.ownerEmail || props.conference.confAdmins.includes(user!.email)))
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
        <SessionModal allsess={props.allSess} session={props.session[0]} presenter={props.presenters} conference={props.conference} show={showDetails === props.session[0]._id} hide={() => handleHideDetails()} />}

      <AssignModal allSess={props.allSess} conference={props.conference} room={props.room} startTime={props.startTime} endTime={props.endTime} date={props.date} setThisSess={setThisSess} setBtnName={setBtnName} errThrown={setErrorThrown} handleShowError={handleShowError} handleShowSuccess={handleShowSuccess} show={showAssign === (props.room && props.time)} hide={() => handleHideAssign()} urlid={props.urlid} urltype={props.urltype} change={props.change} />

      {/* <SuccessModal session={thisSess} confname={props.conference.confName} conference={props.conference} btnname={btnName} urlid={props.urlid} urltype={props.urltype} show={props.showSuccess === (props.room && props.time)} hide={() => handleHideSuccess()} />

      <ErrorModal conference={props.conference} session={thisSess} confname={props.conference.confName} urlid={props.urlid} urltype={props.urltype} btnname={btnName} errmsg={errThrown} show={showError === (props.room && props.time)} hide={() => handleHideError()} /> */}
    </>
  )
}

export default SchedSessCard;