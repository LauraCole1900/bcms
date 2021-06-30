import React, { MouseEvent, ReactElement, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Location } from "history";
import { ObjectId } from "mongoose";
import { useAuth0, User } from "@auth0/auth0-react";
import { Card, Row, Col, Button, Image } from "react-bootstrap";
import Moment from "react-moment";
import { ConfirmModal, ErrorModal, SuccessModal } from "../modals";
import { AttendeeAPI, ConferenceAPI, ExhibitorAPI } from "../../utils/api";
import { AxiosError, AxiosResponse } from "axios";
import "./style.css";

interface Attendee {
  confId: ObjectId,
  email: string,
  givenName: string,
  familyName: string,
  phone: string,
  employerName: string,
  employerAddress: string,
  emergencyContactName: string,
  emergencyContactPhone: string,
  allergyConfirm: string,
  allergies: string[],
  waiverSigned: boolean,
  paid: boolean,
  isAdmin: string,
  _id: ObjectId
}

interface Conference {
  ownerConfirm: string,
  ownerEmail: string,
  confName: string,
  confOrg: string,
  confDesc: string,
  startDate: string,
  endDate: string,
  numDays: number,
  confStartTime: string,
  confEndTime: string,
  confType: string,
  confLoc: string,
  confLocName: string,
  confLocUrl: string,
  confRegDeadline: string,
  confKeynote: string,
  confCapConfirm: string,
  confAttendCap: number,
  confFee: string,
  confFeeAmt: string,
  confEarlyRegConfirm: string,
  confEarlyRegDeadline: string,
  confEarlyRegFee: string,
  confEarlyRegSwagConfirm: string,
  confEarlyRegSwagType: string,
  confEarlyRegSizeConfirm: string,
  confSessProposalConfirm: string,
  confSessProposalDeadline: string,
  confSessProposalCommittee: string[],
  confAllergies: string,
  confWaiver: string,
  confAdmins: string[],
  confCancel: string,
  _id: ObjectId
}

interface Exhibitor {
  confId: ObjectId,
  exhGivenName: string,
  exhFamilyName: string,
  exhEmail: string,
  exhCompany: string,
  exhPhone: string,
  exhCompanyAddress: string,
  exhDesc: string,
  exhLogo: string,
  exhWebsite: string,
  exhWorkers: number,
  exhWorkerNames: string[],
  exhSpaces: number,
  exhBoothNum: string,
  exhAttend: boolean,
  _id: ObjectId
}

const ConferenceCard = (props: any): ReactElement => {
  const { user, isAuthenticated } = useAuth0<User>();
  const location = useLocation<Location>();
  const [cardAttendConf, setCardAttendConf] = useState<ObjectId[]>([]);
  const [cardExhibitConf, setCardExhibitConf] = useState<ObjectId[]>([]);
  const [errThrown, setErrThrown] = useState<string>();
  const [btnName, setBtnName] = useState<string>();
  const [thisId, setThisId] = useState<string>();
  const [thisName, setThisName] = useState<string>();
  const [cardRender, setCardRender] = useState<boolean>(false);

  // Determines which page user is on, specifically for use with URLs that include the conference ID
  const urlArray: string[] = window.location.href.split("/")
  const confId: string = urlArray[urlArray.length - 1]
  const urlType: string = urlArray[urlArray.length - 2]

  // Modal variables
  const [showConfirm, setShowConfirm] = useState<string | undefined>("none");
  const [showErr, setShowErr] = useState<string | undefined>("none");

  // Sets boolean to show or hide relevant modal
  const handleShowConfirm = (e: MouseEvent): any | void => {
    const { dataset } = e.target as HTMLButtonElement;
    console.log(dataset.name, dataset.confid, dataset.confname);
    props.setConference(dataset.conf);
    props.setBtnName(dataset.name);
    props.setThisId(dataset.confid);
    props.setThisName(dataset.confname);
    props.setShowConfirm(true);
  }
  
  // Parses time to 12-hour
  const parseTime = (time: any): string | void => {
    const timeArr: [number, string] = time.split(":");
    let hours: number = timeArr[0];
    let minutes: any = timeArr[1];
    const ampm: string = hours >= 12 ? "pm" : "am"
    hours = hours % 12;
    hours = hours ? hours : 12
    minutes = minutes < 10 ? "0" + minutes.slice(-1) : minutes;
    const timeStr: string = `${hours}:${minutes}${ampm}`
    return timeStr
  };

  useEffect(() => {
    if (isAuthenticated) {
      // Retrieves conferences user is registered to attend to determine whether register or unregister button should render
      AttendeeAPI.getConferencesAttending(user!.email)
        .then((resp: AxiosResponse<Attendee[]>) => {
          const cardAttArr: Attendee[] = resp.data
          const cardAttIds: ObjectId[] = cardAttArr.map((cardAtt: Attendee) => cardAtt.confId)
          setCardAttendConf(cardAttIds);
        })
        .catch((err: AxiosError) => console.log(err));

      // Retrieves conferences user is registered to exhibit at to determine whether exhibit register or unregister button should render
      ExhibitorAPI.getConferencesExhibiting(user!.email)
        .then((resp: AxiosResponse<Exhibitor[]>) => {
          console.log("from confCard getConfExh", resp.data)
          const cardExhArr: Exhibitor[] = resp.data
          const cardExhIds: ObjectId[] = cardExhArr.map((cardExh: Exhibitor) => cardExh.confId)
          setCardExhibitConf(cardExhIds);
        })
        .catch((err: AxiosError) => console.log(err))
    }
    setCardRender(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {cardRender === true &&
        props.conference.map((conf: Conference) => (
          <Card className="infoCard" key={conf._id.toString()}>
            <Card.Header className="cardTitle">
              <Row>
                <Col sm={11}>
                  <h2 className="title">{conf.confName}</h2>
                  <p className="org">Presented by {conf.confOrg}</p>
                </Col>
                <Col sm={1}>
                  {isAuthenticated &&
                    (user!.email === conf.ownerEmail) &&
                    <Button data-toggle="popover" title="Cancel this conference" className="deletebtn" data-confid={conf._id} data-confname={conf.confName} data-name="confCancel" data-conf={conf} onClick={(e) => handleShowConfirm(e)}>
                      <Image fluid src="/images/cancel-event.png" className="delete" alt="Cancel event" data-confid={conf._id} data-confname={conf.confName} data-name="confCancel" data-conf={conf} />
                    </Button>}
                </Col>
              </Row>
            </Card.Header>
            <Card.Body className="infoCardBody">
              <Row>
                <Col sm={7}>
                  {(conf.confWaiver === "yes") &&
                    <div className="alert">
                      <h5>A signed liability waiver will be required to participate in this event. It will be available at check-in to the event.</h5>
                    </div>}
                  <Card.Text>{conf.confDesc}</Card.Text>
                </Col>
                <Col sm={5} className="vitals">
                  {conf.confCancel === "no" &&
                    <div>
                      {conf.numDays === 1
                        ? <div><Row><p>When: <Moment format="ddd, D MMM YYYY" withTitle>{conf.startDate}</Moment> @{parseTime(conf.confStartTime)} - {parseTime(conf.confEndTime)}</p></Row></div>
                        : <div><Row><p>When: <Moment format="ddd, D MMM YYYY" withTitle>{conf.startDate}</Moment> @{parseTime(conf.confStartTime)} - <Moment format="ddd, D MMM YYYY" withTitle>{conf.endDate}</Moment> @{parseTime(conf.confEndTime)}</p></Row></div>}
                      <Row><p>Type: {conf.confType}</p></Row>
                      <Row>
                        {(conf.confType === "Live") &&
                          <p><a href={`https://www.google.com/maps/search/${conf.confLoc.replace(" ", "+")}`} rel="noreferrer noopener" target="_blank">{conf.confLoc}</a></p>}
                        {(conf.confType === "Virtual") &&
                          (conf.confLocUrl !== undefined && conf.confLocUrl !== "") &&
                          <p><a href={conf.confLocUrl} rel="noreferrer noopener" target="_blank">{conf.confLoc}</a></p>}
                        {(conf.confType === "Virtual") &&
                          (conf.confLocUrl === undefined || conf.confLocUrl === "") &&
                          <p>{conf.confLoc}</p>}
                      </Row>
                      {(conf.confType === "Live") &&
                        (conf.confLocUrl !== undefined && conf.confLoc !== "") &&
                        <Row>
                          <p><a href={conf.confLocUrl} rel="noreferrer noopener" target="_blank">{conf.confLocName}</a></p>
                        </Row>}
                      <Row>
                        <Col>
                          {conf.confType === "Live"
                            ? (conf.confRegDeadline === conf.endDate
                              ? <p>Registration available at the door.</p>
                              : <p>Register by <Moment format="ddd, D MMM YYYY" withTitle>{conf.confRegDeadline}</Moment></p>)
                            : <p>Register by <Moment format="ddd, D MMM YYYY" withTitle>{conf.confRegDeadline}</Moment></p>}
                          {(conf.confFee === "yes")
                            ? (conf.confEarlyRegConfirm === "yes"
                              ? <p>Registration fee: ${conf.confEarlyRegFee}.00 before <Moment format="ddd, D MMM YYYY" withTitle>{conf.confEarlyRegDeadline}</Moment>; increases to ${conf.confFeeAmt}.00 after</p>
                              : <p>Registration fee: ${conf.confFeeAmt}.00</p>)
                            : <p>Registration is free!</p>}
                          {conf.confEarlyRegSwagConfirm === "yes" &&
                            <p>Register by <Moment format="ddd, D MMM YYYY" withTitle>{conf.confEarlyRegDeadline}</Moment> to also receive {conf.confEarlyRegSwagType}</p>}
                        </Col>
                      </Row>
                    </div>}

                  {conf.confCancel === "yes" &&
                    <div>
                      <h3 className="cancel">This event has been cancelled.</h3>
                    </div>}

                  {(confId === "" || confId === "conferences" || confId === "profile") &&
                    <Row>
                      <Col sm={4}>
                        <Link to={`/details/${conf._id}`} className={location.pathname === `/details/${conf._id}` ? "link active" : "link"}>
                          <Button data-toggle="popover" title="View conference details" className="button">View details</Button>
                        </Link>
                      </Col>
                    </Row>}
                </Col>
              </Row>

              <Row>
                {isAuthenticated &&
                  conf.confType === "Live" &&
                  conf.confCancel === "no" &&
                  urlType !== "details" && urlType !== "schedule" && urlType !== "exhibits" &&
                  cardExhibitConf.indexOf(conf._id) >= 0 &&
                  <div>
                    <Col sm={1}></Col>
                    <Col sm={2}>
                      <Button data-toggle="popover" title="Unregister exhibit from this conference" className="button" data-confid={conf._id} data-confname={conf.confName} name="unregExh" onClick={(e) => handleShowConfirm(e)}>Unregister Exhibit</Button>
                    </Col>
                    <Col sm={2}>
                      <Link to={`/edit_exhibit/${conf._id}`} className={location.pathname === `/edit_exhibit/${conf._id}` ? "link active" : "link"}>
                        <Button data-toggle="popover" title="Edit your exhibitor registration" className="button">Edit exhibitor registration</Button>
                      </Link>
                    </Col>
                  </div>}

                {isAuthenticated &&
                  user!.email !== conf.ownerEmail &&
                  conf.confCancel === "no" &&
                  urlType !== "details" && urlType !== "schedule" && urlType !== "exhibits" &&
                  cardAttendConf.indexOf(conf._id) >= 0 &&
                  <div>
                    {conf.confType === "Live"
                      ? <Col sm={2}></Col>
                      : <Col sm={7}></Col>}
                    <Col sm={2}>
                      <Button data-toggle="popover" title="Unregister attendee from this conference" className="button" data-confid={conf._id} data-confname={conf.confName} name="unregAtt" onClick={(e) => handleShowConfirm(e)}>Unregister Attendee</Button>
                    </Col>
                    <Col sm={2}>
                      <Link to={`/register_edit/${conf._id}`} className={location.pathname === `/register_edit/${conf._id}` ? "link active" : "link"}>
                        <Button data-toggle="popover" title="Edit your attendee registration" className="button">Edit attendee registration</Button>
                      </Link>
                    </Col>
                  </div>}

                {isAuthenticated &&
                  user!.email !== conf.ownerEmail &&
                  conf.confType === "Live" &&
                  conf.confCancel === "no" &&
                  urlType !== "details" && urlType !== "schedule" && urlType !== "exhibits" &&
                  cardExhibitConf.indexOf(conf._id) < 0 &&
                  <div>
                    <Col sm={1}></Col>
                    <Col sm={2}>
                      <Link to={`/register_exhibit/${conf._id}`} className={location.pathname === `/register_exhibit/${conf._id}` ? "link active" : "link"}>
                        <Button data-toggle="popover" title="Register to exhibit at this conference" className="button">Register as Exhibitor</Button>
                      </Link>
                    </Col>
                  </div>}

                {isAuthenticated &&
                  user!.email !== conf.ownerEmail &&
                  conf.confCancel === "no" &&
                  urlType !== "details" && urlType !== "schedule" && urlType !== "exhibits" &&
                  cardAttendConf.indexOf(conf._id) < 0 &&
                  <div>
                    {conf.confType === "Live"
                      ? (cardExhibitConf.indexOf(conf._id) < 0
                        ? <Col sm={4}></Col>
                        : <Col sm={2}></Col>)
                      : <Col sm={7}></Col>}
                    <Col sm={3}>
                      <Link to={`/register_attend/${conf._id}`} className={location.pathname === `/register_attend/${conf._id}` ? "link active" : "link"}>
                        <Button data-toggle="popover" title="Register for this conference" className="button">Register as Attendee</Button>
                      </Link>
                    </Col>
                    <Col sm={1}></Col>
                  </div>}

              </Row>
            </Card.Body>

            {/* Will need to add deletesess={() => handleSessDelete(sess._id)}? Or only from sessionCard? */}
            {/* <ConfirmModal btnname={btnName} confname={thisName} urlid={confId} cancelconf={() => handleConfCancel(thisId!)} unregatt={() => handleAttUnreg(thisId!, user!.email!)} unregexh={() => handleExhUnreg(thisId!, user!.email!)} show={showConfirm === (conf._id && btnName)} hide={() => handleHideConfirm()} />

            <SuccessModal conference={conf} confname={thisName} confid={conf._id} urlid={confId} urltype={urlType} btnname={btnName} show={props.showSuccess === (conf._id && btnName)} hide={() => handleHideSuccess()} />

            <ErrorModal conference={conf} urlid={confId} urltype={urlType} errmsg={errThrown} btnname={btnName} show={showErr === (conf._id && btnName)} hide={() => handleHideErr()} /> */}

          </Card>

        ))
      }
    </>
  )

}

export default ConferenceCard;