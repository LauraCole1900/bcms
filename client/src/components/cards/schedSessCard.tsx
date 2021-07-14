import React, { MouseEvent, ReactElement } from "react";
import { ObjectId } from "mongoose";
import { Button, Card } from "react-bootstrap";
import { useAuth0, User } from "@auth0/auth0-react";
import { Presenter } from "../../utils/interfaces";
import "./style.css";

const SchedSessCard = (props: any): ReactElement => {
  const { user, isAuthenticated } = useAuth0<User>();
  let nameArr: Array<string>;

  // Show & hide SessionModal
  const handleShowDetails = (e: MouseEvent): ReactElement | void => {
    props.setThisSess(props.session[0])
    props.setShowDetails(true);
  }

  // Show & hide AssignModal
  const handleShowAssign = (e: MouseEvent): ReactElement | void => {
    const { dataset } = e.target as HTMLButtonElement;
    props.setRoom(dataset.room!);
    props.setTime(dataset.time!);
    props.setStartTime(props.startTime);
    props.setEndTime(props.endTime);
    props.setThisDate(props.date);
    props.setBtnName(dataset.name!);
    props.setThisSess(props.session[0]);
    props.setShowAssign(true);
  }

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
        (user!.email === props.conference[0].ownerEmail || props.conference[0].confAdmins.includes(user!.email)))
        ? <>
          {props.session[0] !== undefined
            ? <Card className="sched">
              <h3 className="textTight maxWidth">{props.session[0].sessName}</h3><br />
              <p className="textTight maxWidth">{fetchPresNames(props.session[0]._id)}</p><br />
              <Button data-toggle="popover" title="Session Details" className="button" data-sessid={props.session[0]._id} onClick={(e) => handleShowDetails(e)}>Session Details</Button>
            </Card>
            : <Card className="schedBlue">
              <h3 data-toggle="popover" title="Assign Session" className="textTight clickable" data-name="Assign" data-room={props.room} data-time={props.time} onClick={(e) => handleShowAssign(e)}>Click to assign session</h3>
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
    </>
  )
}

export default SchedSessCard;