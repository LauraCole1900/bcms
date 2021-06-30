import React, { MouseEvent, ReactElement, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Location } from "history";
import { useAuth0, User } from "@auth0/auth0-react";
import { Card, Row, Col, Button, Image } from "react-bootstrap";
import Moment from "react-moment";
import { ConfirmModal, ErrorModal, SuccessModal } from "../modals";
import { AttendeeAPI, ConferenceAPI, ExhibitorAPI } from "../../utils/api";
import { AxiosError, AxiosResponse } from "axios";
import "./style.css";

interface Attendee {
  confId: string,
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
  _id: string
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
  _id: string
}

interface Exhibitor {
  confId: string,
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
  _id: string
}

const ConferenceCard = (props: any): ReactElement => {
  const { user, isAuthenticated } = useAuth0<User>();
  const location = useLocation<Location>();
  const [cardAttendConf, setCardAttendConf] = useState<string[]>([]);
  const [cardExhibitConf, setCardExhibitConf] = useState<string[]>([]);
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
  const handleShowConfirm = (e: MouseEvent): string | void => {
    const { dataset, name } = e.target as HTMLButtonElement;
    console.log(dataset.name, dataset.confid, dataset.confname);
    setBtnName(dataset.name);
    setThisId(dataset.confid);
    setThisName(dataset.confname);
    setShowConfirm(dataset.confid && name);
  }
  const handleHideConfirm = () => setShowConfirm("none");
  const handleShowSuccess = () => props.setShowSuccess(thisId && btnName);
  const handleHideSuccess = () => props.setShowSuccess(0);
  const handleShowErr = () => setShowErr(thisId && btnName);
  const handleHideErr = () => setShowErr("none");
  
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

  // GETs registered attendees' emails
  const fetchAttendeeEmails = async (confId: string): Promise<string[] | void> => {
    console.log("from confCard fetchAttendees", confId)
    await AttendeeAPI.getAttendees(confId)
      .then((resp: AxiosResponse<Attendee[]>) => {
        // map through res.data and pull all emails into an array
        const attData: Attendee[] = resp.data
        let attEmails: string[] = attData.map((att: Attendee) => att.email)
        return attEmails
      })
      .catch((err: AxiosError) => {
        console.log("from confCard fetAttEmails", err)
        setErrThrown(err.message);
        handleShowErr();
      })
  }

  // Handles click on "Yes, Cancel" button on ConfirmModal
  // Will need to have email functionality to email registered participants
  const handleConfCancel = async (confId: string): Promise<Conference | void> => {
    console.log("from confCard", confId)
    handleHideConfirm();
    let attEmailArr: string[] | void = await fetchAttendeeEmails(confId);
    // send-email functionality for registered attendees goes here

    ExhibitorAPI.getExhibitors(confId)
      .then((resp: AxiosResponse<Exhibitor[]>) => {
        if (resp.status !== 422) {
          console.log("from confCard getExhibitors", resp.data)
        }
      })
      .catch((err: AxiosError) => {
        console.log("from confCard getExhibitors", err);
        setErrThrown(err.message);
        handleShowErr();
      })

    ConferenceAPI.updateConference({ ...props.conference, confCancel: "yes" }, confId)
      .then((resp: AxiosResponse<Conference>) => {
        if (resp.status !== 422) {
          handleShowSuccess();
        }
      })
      .catch((err: AxiosError) => {
        console.log("from confCard updateConf", err);
        setErrThrown(err.message);
        handleShowErr();
      });
  };

  // Handles click on "Yes, unregister attendee" button on ConfirmModal
  const handleAttUnreg = (confId: string, email: string): Attendee | void => {
    console.log("from confirm attUnreg", confId, email)
    handleHideConfirm();
    // DELETE call to delete attendee document
    AttendeeAPI.unregisterAttendee(confId, email)
      .then((resp: AxiosResponse<Attendee>) => {
        // If no errors thrown, show Success modal
        if (resp.status !== 422) {
          handleShowSuccess();
        }
      })
      // If yes errors thrown, show Error modal
      .catch((err: AxiosError) => {
        console.log(err);
        setErrThrown(err.message);
        handleShowErr();
      });
  }

  // Handles click on "Yes, unregister exhibitor" button on ConfirmModal
  const handleExhUnreg = (confId: string, email: string): Exhibitor | void => {
    console.log("from confirm exhUnreg", confId, email)
    handleHideConfirm();
    // DELETE call to delete exhibitor document
    ExhibitorAPI.deleteExhibitor(confId, email)
      .then((resp: AxiosResponse<Exhibitor>) => {
        // If no errors thrown, show Success modal
        if (resp.status !== 422) {
          handleShowSuccess();
        }
      })
      // If yes errors thrown, show Error modal
      .catch((err: AxiosError) => {
        console.log(err)
        setErrThrown(err.message);
        handleShowErr();
      });
  }

  useEffect(() => {
    if (isAuthenticated) {
      // Retrieves conferences user is registered to attend to determine whether register or unregister button should render
      AttendeeAPI.getConferencesAttending(user!.email)
        .then((resp: AxiosResponse<Attendee[]>) => {
          const cardAttArr: Attendee[] = resp.data
          const cardAttIds: string[] = cardAttArr.map((cardAtt: Attendee) => cardAtt.confId)
          setCardAttendConf(cardAttIds);
        })
        .catch(err => console.log(err));

      // Retrieves conferences user is registered to exhibit at to determine whether exhibit register or unregister button should render
      ExhibitorAPI.getConferencesExhibiting(user!.email)
        .then((resp: AxiosResponse<Exhibitor[]>) => {
          console.log("from confCard getConfExh", resp.data)
          const cardExhArr: Exhibitor[] = resp.data
          const cardExhIds: string[] = cardExhArr.map((cardExh: Exhibitor) => cardExh.confId)
          setCardExhibitConf(cardExhIds);
        })
    }
    setCardRender(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {cardRender === true &&
        props.conference.map((conf: Conference) => (
          <Card className="infoCard" key={conf._id}>
            <Card.Header className="cardTitle">
              <Row>
                <Col sm={11}>
                  <h2 className="title">{conf.confName}</h2>
                  <p className="org">Presented by {conf.confOrg}</p>
                </Col>
                <Col sm={1}>
                  {isAuthenticated &&
                    (user!.email === conf.ownerEmail) &&
                    <Button data-toggle="popover" title="Cancel this conference" className="deletebtn" data-confid={conf._id} data-confname={conf.confName} data-name="confCancel" onClick={(e) => handleShowConfirm(e)}>
                      <Image fluid src="/images/cancel-event.png" className="delete" alt="Cancel event" data-confid={conf._id} data-confname={conf.confName} data-name="confCancel" />
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
                          (conf.confLocUrl !== undefined) &&
                          <p><a href={conf.confLocUrl} rel="noreferrer noopener" target="_blank">{conf.confLoc}</a></p>}
                        {(conf.confType === "Virtual") &&
                          (conf.confLocUrl === undefined) &&
                          <p>{conf.confLoc}</p>}
                      </Row>
                      {(conf.confType === "Live") &&
                        (conf.confLocUrl !== undefined) &&
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
            <ConfirmModal btnname={btnName} confname={thisName} urlid={confId} cancelconf={() => handleConfCancel(thisId!)} unregatt={() => handleAttUnreg(thisId!, user!.email!)} unregexh={() => handleExhUnreg(thisId!, user!.email!)} show={showConfirm === (conf._id && btnName)} hide={() => handleHideConfirm()} />

            <SuccessModal conference={conf} confname={thisName} confid={conf._id} urlid={confId} urltype={urlType} btnname={btnName} show={props.showSuccess === (conf._id && btnName)} hide={() => handleHideSuccess()} />

            <ErrorModal conference={conf} urlid={confId} urltype={urlType} errmsg={errThrown} btnname={btnName} show={showErr === (conf._id && btnName)} hide={() => handleHideErr()} />

          </Card>

        ))
      }
    </>
  )

}

export default ConferenceCard;