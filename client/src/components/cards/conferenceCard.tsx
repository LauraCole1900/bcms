import React, { MouseEvent, ReactElement, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Location } from "history";
import { ObjectId } from "mongoose";
import { useAuth0, User } from "@auth0/auth0-react";
import { Card, Row, Col, Button, Image } from "react-bootstrap";
import Moment from "react-moment";
import { AttendeeAPI, ConferenceAPI, ExhibitorAPI } from "../../utils/api";
import { handleFetchOne, handleParseTime } from "../../utils/functions";
import { Attendee, Conference, Exhibitor } from "../../utils/interfaces";
import { AxiosError, AxiosResponse } from "axios";
import "./style.css";

const ConferenceCard = (props: any): ReactElement => {
  const { user, isAuthenticated } = useAuth0<User>();
  const location = useLocation<Location>();
  const [cardAttendConf, setCardAttendConf] = useState<Array<ObjectId>>([]);
  const [cardExhibitConf, setCardExhibitConf] = useState<Array<ObjectId>>([]);
  const [cardRender, setCardRender] = useState<boolean>(false);

  // Determines which page user is on, specifically for use with URLs that include the conference ID
  const urlArray: Array<string> = window.location.href.split("/")
  const confId: string = urlArray[urlArray.length - 1]
  const urlType: string = urlArray[urlArray.length - 2]

  // Lifts state to show Confirm modal
  const handleShowConfirm = (e: MouseEvent, id: any, name: string): any | void => {
    const { dataset } = e.target as HTMLButtonElement;
    console.log({ dataset });
    console.log(dataset.btnname, id, name);
    handleFetchOne(ConferenceAPI.getConferenceById, id!, props.setConference);
    props.setBtnName(dataset.btnname);
    props.setThisId(id);
    props.setThisName(name);
    props.setShowConfirm(true);
  }

  useEffect(() => {
    if (isAuthenticated) {
      // Retrieves conferences user is registered to attend to determine whether register or unregister button should render
      AttendeeAPI.getConferencesAttending(user!.email)
        .then((resp: AxiosResponse<Array<Attendee>>) => {
          const cardAttArr: Array<Attendee> = resp.data
          const cardAttIds: Array<ObjectId> = cardAttArr.map((cardAtt: Attendee) => cardAtt.confId)
          setCardAttendConf(cardAttIds);
        })
        .catch((err: AxiosError) => console.log(err));

      // Retrieves conferences user is registered to exhibit at to determine whether exhibit register or unregister button should render
      ExhibitorAPI.getConferencesExhibiting(user!.email)
        .then((resp: AxiosResponse<Array<Exhibitor>>) => {
          console.log("from confCard getConfExh", resp.data)
          const cardExhArr: Array<Exhibitor> = resp.data
          const cardExhIds: Array<ObjectId> = cardExhArr.map((cardExh: Exhibitor) => cardExh.confId)
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
        props.conference.map((conf: Conference, idx: number) => (
          <Card className="infoCard" key={conf._id.toString()}>
            <Card.Header className="cardTitle">
              <Row>
                <Col sm={11}>
                  <h2 className="title">{conf.confName}</h2>
                  <p className="org">Presented by {conf.confOrg}</p>
                </Col>
                <Col sm={1}>
                  {isAuthenticated &&
                    (user!.email === conf.ownerEmail && conf.confCancel === "no" && urlType !== "session_proposals" && urlType !== "proposal_details") &&
                    <Button
                      data-toggle="popover"
                      title="Cancel this conference"
                      className="deletebtn"
                      data-btnname="confCancel"
                      onClick={(e: MouseEvent) => handleShowConfirm(e, conf._id, conf.confName)}
                    >
                      <Image
                        fluid
                        src="/images/cancel-event.png"
                        className="delete"
                        alt="Cancel event"
                        data-btnname="confCancel"
                        onClick={(e: MouseEvent) => handleShowConfirm(e, conf._id, conf.confName)}
                      />
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
                        ? <div><Row><p>When: <Moment format="ddd, D MMM YYYY" withTitle>{conf.startDate}</Moment> @{handleParseTime(conf.confStartTime)} - {handleParseTime(conf.confEndTime)}</p></Row></div>
                        : <div><Row><p>When: <Moment format="ddd, D MMM YYYY" withTitle>{conf.startDate}</Moment> @{handleParseTime(conf.confStartTime)} - <Moment format="ddd, D MMM YYYY" withTitle>{conf.endDate}</Moment> @{handleParseTime(conf.confEndTime)}</p></Row></div>}
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
                        <Link
                          to={`/details/${conf._id}`}
                          className={location.pathname === `/details/${conf._id}` ? "link active" : "link"}
                        >
                          <Button
                            data-toggle="popover"
                            title="View conference details"
                            className="button"
                          >View details</Button>
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
                      <Button
                        data-toggle="popover"
                        title="Unregister exhibit from this conference"
                        className="button"
                        name="unregExh"
                        onClick={(e: MouseEvent) => handleShowConfirm(e, conf._id, conf.confName)}
                      >Unregister Exhibit</Button>
                    </Col>
                    <Col sm={2}>
                      <Link
                        to={`/edit_exhibit/${conf._id}`}
                        className={location.pathname === `/edit_exhibit/${conf._id}` ? "link active" : "link"}
                      >
                        <Button
                          data-toggle="popover"
                          title="Edit your exhibitor registration"
                          className="button"
                        >Edit exhibitor registration</Button>
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
                      <Button
                        data-toggle="popover"
                        title="Unregister attendee from this conference"
                        className="button"
                        name="unregAtt"
                        onClick={(e: MouseEvent) => handleShowConfirm(e, conf._id, conf.confName)}
                      >Unregister Attendee</Button>
                    </Col>
                    <Col sm={2}>
                      <Link
                        to={`/register_edit/${conf._id}`}
                        className={location.pathname === `/register_edit/${conf._id}` ? "link active" : "link"}
                      >
                        <Button
                          data-toggle="popover"
                          title="Edit your attendee registration"
                          className="button"
                        >Edit attendee registration</Button>
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
                      <Link
                        to={`/register_exhibit/${conf._id}`}
                        className={location.pathname === `/register_exhibit/${conf._id}` ? "link active" : "link"}
                      >
                        <Button
                          data-toggle="popover"
                          title="Register to exhibit at this conference"
                          className="button"
                        >Register as Exhibitor</Button>
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
                      <Link
                        to={`/register_attend/${conf._id}`}
                        className={location.pathname === `/register_attend/${conf._id}` ? "link active" : "link"}
                      >
                        <Button
                          data-toggle="popover"
                          title="Register for this conference"
                          className="button"
                        >Register as Attendee</Button>
                      </Link>
                    </Col>
                    <Col sm={1}></Col>
                  </div>}

              </Row>
            </Card.Body>

          </Card>

        ))
      }
    </>
  )

}

export default ConferenceCard;