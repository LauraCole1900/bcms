import React, { MouseEvent, ReactElement, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Location } from "history";
import { ObjectId } from "mongoose";
import { Card, Row, Col, Button, Image } from "react-bootstrap";
import { useAuth0, User } from "@auth0/auth0-react";
import Moment from "react-moment";
import { ConfirmModal, ErrorModal, SuccessModal } from "../modals";
import { PresenterAPI, SessionAPI } from "../../utils/api";
import { handleParseTime } from "../../utils/functions";
import { Presenter, Session } from "../../utils/interfaces";
import { AxiosError, AxiosResponse } from "axios";
import "./style.css";

const SessionCard = (props: any): ReactElement => {
  const { user, isAuthenticated } = useAuth0<User>();
  const location = useLocation<Location>();
  const [errThrown, setErrThrown] = useState<string>();
  const [btnName, setBtnName] = useState<string | undefined>("");
  const [thisId, setThisId] = useState<ObjectId | string | undefined>();
  const presEmailArr: string[] = props.session.sessPresEmails;
  let nameArr: string[] = [];
  let orgArr: string[] = [];

  // Determines which page user is on, specifically for use with URLs that include the conference ID
  const urlArray: string[] = window.location.href.split("/")
  const urlId: string = urlArray[urlArray.length - 1]
  const urlType: string = urlArray[urlArray.length - 2]

  // Modal variables
  const [showConfirm, setShowConfirm] = useState<ObjectId | string | undefined>("none");
  const [showErr, setShowErr] = useState<ObjectId | string | undefined>("none");

  // Sets boolean to show or hide relevant modal
  const handleShowConfirm = (e: MouseEvent): any | void => {
    const { dataset } = e.target as HTMLButtonElement;
    console.log(dataset.sessid);
    console.log({ dataset });
    setBtnName(dataset.btnname);
    setThisId(dataset.sessid);
    setShowConfirm(dataset.sessid);
  }
  const handleHideConfirm = (): string | void => setShowConfirm("none");
  const handleShowSuccess = (): ObjectId | undefined => props.setShowSuccess(thisId);
  const handleHideSuccess = (): string | void => props.setShowSuccess("none");
  const handleShowErr = (): ObjectId | void => setShowErr(thisId);
  const handleHideErr = (): string | void => setShowErr("none");

  // Handles click on "Yes, delete" button on Confirm modal
  const handleSessDelete = (sessId: ObjectId): Session | void => {
    console.log("from sessCard handleSessDelete", sessId)
    handleHideConfirm();
    // Deletes sessId from each presenters' sessId[]
    const thesePres: Presenter[] = props.presenter.filter((pres: Presenter) => pres.presSessionIds.includes(sessId))
    const presSessions: ObjectId[][] = thesePres.map((pres: Presenter) => pres.presSessionIds.filter(id => id !== sessId))
    console.log("from sessCard handleSessDelete presSessions", presSessions);
    thesePres.forEach((pres: Presenter) => {
      if (presSessions[0].length > 0) {
        PresenterAPI.updatePresenterByEmail({ ...pres, presSessionIds: presSessions[0] }, pres.presEmail, pres.confId)
      } else {
        PresenterAPI.deletePresenterByEmail(pres.presEmail, pres.confId)
      }
    })
    // Deletes session from DB
    SessionAPI.deleteSession(sessId)
      .then((resp: AxiosResponse) => {
        // If no errors thrown, show Success modal
        if (resp.status !== 422) {
          handleShowSuccess();
        }
      })
      .catch((err: AxiosError) => {
        console.log(err)
        setErrThrown(err.message);
        handleShowErr();
      })
  };

  // Filters props.presenter by sessId, then maps through the result to pull out presenter names
  const fetchPresNames = (sessId: ObjectId): string[] => {
    const thesePres: Presenter[] = props.presenter.filter((pres: Presenter) => pres.presSessionIds.includes(sessId))
    const presName: string[] = thesePres.map(pres => pres.presGivenName + " " + pres.presFamilyName)
    nameArr = [presName.join(", ")]
    return nameArr;
  }

  // Filters props.presenter by sessId, then maps through the result to put out presenter organizations
  const fetchPresOrgs = (sessId: ObjectId): string[] => {
    const thesePres = props.presenter.filter((pres: Presenter) => pres.presSessionIds.includes(sessId))
    const presOrg: string[] = thesePres.map((pres: Presenter) => pres.presOrg)
    orgArr = [...new Set(presOrg)]
    return orgArr;
  }


  return (
    <>
      {props.session.map((sess: Session) => (
        <Card className="infoCard" key={sess._id.toString()}>
          {sess.sessKeynote === "yes" &&
            <Card.Header className="cardTitleKeynote">
              <Row>
                <Col sm={2}>
                  <h3>&nbsp;Keynote:</h3>
                </Col>
                <Col sm={9}>
                  <h2 className="title">{sess.sessName}</h2>
                  <p>{fetchPresNames(sess._id)}</p>
                  <p>{fetchPresOrgs(sess._id)}</p>
                </Col>
                <Col sm={1}>
                  {isAuthenticated &&
                    urlType !== "schedule" &&
                    (user!.email === props.conference[0].ownerEmail || props.conference[0].confAdmins.includes(user!.email)) &&
                    <Button data-toggle="popover" title="Delete this session" className="deletebtn" data-sessid={sess._id} data-sessname={sess._id} data-name="sessDelete" onClick={(e) => handleShowConfirm(e)}>
                      <Image fluid src="/images/trash-can.png" className="delete" alt="Delete session" data-sessid={sess._id} data-sessname={sess._id} data-name="sessDelete" />
                    </Button>}
                  {urlType === "schedule" &&
                    <Button data-toggle="popover" title="Close" className="button closeBtn" onClick={props.hide}>
                      <Image fluid src="/images/close-icon-2.png" className="button close" alt="Close" />
                    </Button>}
                </Col>
              </Row>
            </Card.Header>}
          {sess.sessPanel === "yes" &&
            <Card.Header className="cardTitle">
              <Row>
                <Col sm={2}>
                  <h3>&nbsp;Panel:</h3>
                </Col>
                <Col sm={9}>
                  <h2 className="title">{sess.sessName}</h2>
                  <p>{fetchPresNames(sess._id)}</p>
                  <p>{fetchPresOrgs(sess._id)}</p>
                </Col>
                <Col sm={1}>
                  {isAuthenticated &&
                    urlType !== "schedule" &&
                    (user!.email === props.conference[0].ownerEmail || props.conference[0].confAdmins.includes(user!.email)) &&
                    <Button data-toggle="popover" title="Delete this session" className="deletebtn" data-sessid={sess._id} data-sessname={sess.sessName} data-name="sessDelete" onClick={(e) => handleShowConfirm(e)}>
                      <Image fluid src="/images/trash-can.png" className="delete" alt="Delete session" data-sessid={sess._id} data-sessname={sess.sessName} data-name="sessDelete" />
                    </Button>}
                  {urlType === "schedule" &&
                    <Button data-toggle="popover" title="Close" className="button closeBtn" onClick={props.hide}>
                      <Image fluid src="/images/close-icon-2.png" className="button close" alt="Close" />
                    </Button>}
                </Col>
              </Row>
            </Card.Header>}
          {sess.sessKeynote === "no" && sess.sessPanel === "no" &&
            <Card.Header className="cardTitle">
              <Row>
                <Col sm={11}>
                  <h2 className="title">{sess.sessName}</h2>
                  <p>{fetchPresNames(sess._id)}</p>
                  <p>{fetchPresOrgs(sess._id)}</p>
                </Col>
                <Col sm={1}>
                  {isAuthenticated &&
                    urlType !== "schedule" &&
                    (user!.email === props.conference[0].ownerEmail || props.conference[0].confAdmins.includes(user!.email)) &&
                    <Button data-toggle="popover" title="Delete this session" className="deletebtn" data-sessid={sess._id} data-sessname={sess.sessName} data-btnname="sessDelete" onClick={(e) => handleShowConfirm(e)}>
                      <Image fluid src="/images/trash-can.png" className="delete" alt="Delete session" data-sessid={sess._id} data-sessname={sess.sessName} data-btnname="sessDelete" />
                    </Button>}
                  {urlType === "schedule" &&
                    <Button data-toggle="popover" title="Close" className="closeBtn" onClick={props.hide}>
                      <Image fluid src="/images/close-icon-2.png" className="close" alt="Close" />
                    </Button>}
                </Col>
              </Row>
            </Card.Header>}
          <Card.Body className="infoCardBody">
            <Row>
              <Col sm={8}>
                <Card.Text>{sess.sessDesc}</Card.Text>
                {sess.sessEquipConfirm === "yes" &&
                  (sess.sessEquipProvide === "yes"
                    ? (sess.sessEquip.length === 2
                      ? <Card.Text className="alert">We will be providing {sess.sessEquip.join(" & ")} for your use. Please return equipment at the end of the session unless told otherwise.</Card.Text>
                      : <Card.Text className="alert">We will be providing {sess.sessEquip.join(", ")} for your use. Please return equipment at the end of the session unless told otherwise.</Card.Text>)
                    : <Card.Text className="alert">Please bring {sess.sessEquip.join(", ")} to use in this session.</Card.Text>
                  )}
              </Col>
              <Col sm={4}>
                <Row><p>Date: <Moment format="ddd, D MMM YYYY" withTitle>{sess.sessDate}</Moment></p></Row>
                <Row><p>Time: {handleParseTime(sess.sessStart)} - {handleParseTime(sess.sessEnd)}</p></Row>
                {props.conference[0].confType === "Live" &&
                  <Row><p>Location: {sess.sessRoom}</p></Row>}
              </Col>
            </Row>
            {isAuthenticated &&
              (user!.email === props.conference[0].ownerEmail || props.conference[0].confAdmins.includes(user!.email)) &&
              <Row>
                <Col sm={1}></Col>
                <Col sm={5}>
                  <Link to={`/edit_session/${sess._id}`} className={location.pathname === `/edit_session/${sess._id}` ? "link active" : "link"}>
                    <Button data-toggle="popover" title="Edit session" className="button">Edit Session</Button>
                  </Link>
                </Col>
              </Row>}
          </Card.Body>

        </Card >
      ))}
    </>
  )
}

export default SessionCard;