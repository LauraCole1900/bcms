import React, { MouseEvent, ReactElement, useState, useEffect } from "react";
import { Nav, Row } from "react-bootstrap";
import { ObjectId } from "mongoose";
import { useAuth0, User } from "@auth0/auth0-react";
import { InternalLinkButton, UnregisterButton } from "../buttons";
import { ConfirmModal, ErrorModal, SuccessModal } from "../modals";
import { AttendeeAPI, ExhibitorAPI } from "../../utils/api";
import { Attendee, Conference, Exhibitor } from "../../utils/interfaces";
import { AxiosError, AxiosResponse } from "axios";
import "./style.css";

const Sidenav = (props: any): ReactElement => {
  const { user, isAuthenticated } = useAuth0<User>();
  const [cardAttendConf, setCardAttendConf] = useState<ObjectId[]>([]);
  const [cardExhibitConf, setCardExhibitConf] = useState<ObjectId[]>([]);
  const [errThrown, setErrThrown] = useState<string>();
  const [btnName, setBtnName] = useState<string>("");
  const [thisId, setThisId] = useState<string>();
  const [thisName, setThisName] = useState<string>();
  const [pageReady, setPageReady] = useState<boolean>(false);

  // Pull conference ID from URL
  const urlArray: string[] = window.location.href.split("/");
  const confId: string = urlArray[urlArray.length - 1];
  const urlType: string = urlArray[urlArray.length - 2];

  // Modal variables
  const [showConfirm, setShowConfirm] = useState<string | undefined>("0");
  const [showErr, setShowErr] = useState<string | undefined>("0");

  // Sets boolean to show or hide relevant modal
  const handleShowConfirm = (e: MouseEvent): any | void => {
    const { dataset, name } = e.target as HTMLButtonElement;
    console.log(name, dataset.confid, dataset.confname);
    setBtnName(name);
    setThisId(dataset.confid);
    setThisName(dataset.confname);
    setShowConfirm(dataset.confid && name);
  }
  const handleHideConfirm = (): string | void => setShowConfirm("0");
  const handleShowSuccess = (): string | void => props.setShowSuccess(thisId && btnName);
  const handleHideSuccess = (): string | void => props.setShowSuccess("0");
  const handleShowErr = (): string | void => setShowErr(thisId && btnName);
  const handleHideErr = (): string | void => setShowErr("0");

  // Handles click on "Yes, unregister attendee" button on ConfirmModal
  const handleAttUnreg = (confId: string, email: string): Attendee | void => {
    console.log("from confirm attUnreg", confId, email)
    handleHideConfirm();
    // DELETE call to delete attendee document
    AttendeeAPI.unregisterAttendee(confId, email)
      .then((resp: AxiosResponse<Attendee>) => {
        // If no errors thrown, show Success modal
        if (resp.status !== 422) {
          handleShowSuccess()
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
        .then((resp: AxiosResponse) => {
          const cardAttArr: Attendee[] = resp.data
          const cardAttIds: ObjectId[] = cardAttArr.map((cardAttArr: Attendee) => cardAttArr.confId)
          setCardAttendConf(cardAttIds);
        })
        .catch((err: AxiosError) => console.log(err));

      // Retrieves conferences user is registered to exhibit at to determine whether exhibit register or unregister button should render
      ExhibitorAPI.getConferencesExhibiting(user!.email)
        .then((resp: AxiosResponse) => {
          console.log("from confCard getConfExh", resp.data)
          const cardExhArr: Exhibitor[] = resp.data
          const cardExhIds: ObjectId[] = cardExhArr.map((cardExhArr: Exhibitor) => cardExhArr.confId)
          setCardExhibitConf(cardExhIds);
        })
    }
    setPageReady(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {pageReady === true &&
        <Nav className="center outline flex-column">
          <Row><h3 className="textTight">Navigation</h3></Row>
          {urlType !== "details" &&
            <Row>
              <InternalLinkButton confid={props.conference[0]._id} page={props.conference[0].confName} urltype="details" button="sideButton" />
            </Row>}
          {urlType !== "schedule" &&
            <Row>
              <InternalLinkButton confid={props.conference[0]._id} page="Schedule" urltype="schedule" button="sideButton" />
            </Row>}
          {urlType !== "venue" &&
            <Row>
              <InternalLinkButton confid={props.conference[0]._id} page="Venue" urltype="venue" button="sideButton" />
            </Row>}
          {urlType !== "exhibits" &&
            <Row>
              <InternalLinkButton confid={props.conference[0]._id} page="Exhibits" urltype="exhibits" button="sideButton" />
            </Row>}
          {isAuthenticated &&
            user!.email !== props.conference[0].ownerEmail &&
            props.conference[0].confCancel === "no" &&
            cardAttendConf.indexOf(props.conference[0]._id) < 0 &&
            <Row>
              <InternalLinkButton confid={props.conference[0]._id} page="Register as Attendee" urltype="register_attend" button="sideButton" />
            </Row>}
          {isAuthenticated &&
            user!.email !== props.conference[0].ownerEmail &&
            props.conference[0].confCancel === "no" &&
            cardAttendConf.indexOf(props.conference[0]._id) >= 0 &&
            <Row>
              <UnregisterButton confid={props.conference[0]._id} confname={props.conference[0].confName} page="Unregister Attendee" name="unregAtt" button="sideButton" click={(e: MouseEvent) => handleShowConfirm(e)} />
            </Row>}
          {isAuthenticated &&
            user!.email !== props.conference[0].ownerEmail &&
            props.conference[0].confCancel === "no" &&
            cardAttendConf.indexOf(props.conference[0]._id) >= 0 &&
            <Row>
              <InternalLinkButton confid={props.conference[0]._id} page="Edit attendee registration" urltype="register_edit" button="sideButton" />
            </Row>}
          {isAuthenticated &&
            user!.email !== props.conference[0].ownerEmail &&
            props.conference[0].confType === "Live" &&
            props.conference[0].confCancel === "no" &&
            cardExhibitConf.indexOf(props.conference[0]._id) < 0 &&
            <Row>
              <InternalLinkButton confid={props.conference[0]._id} page="Register as Exhibitor" urltype="register_exhibit" button="sideButton" />
            </Row>}
          {isAuthenticated &&
            props.conference[0].confType === "Live" &&
            props.conference[0].confCancel === "no" &&
            cardExhibitConf.indexOf(props.conference[0]._id) >= 0 &&
            <Row>
              <UnregisterButton confid={props.conference[0]._id} confname={props.conference[0].confName} page="Unregister Exhibit" name="unregExh" button="sideButton" click={(e: MouseEvent) => handleShowConfirm(e)} />
            </Row>}
          {isAuthenticated &&
            props.conference[0].confType === "Live" &&
            props.conference[0].confCancel === "no" &&
            cardExhibitConf.indexOf(props.conference[0]._id) >= 0 &&
            <Row>
              <InternalLinkButton confid={props.conference[0]._id} page="Edit exhibitor registration" urltype="edit_exhibit" button="sideButton" />
            </Row>}
          {isAuthenticated &&
            props.conference[0].confSessProposalConfirm === "yes" &&
            <Row>
              <InternalLinkButton confid={props.conference[0]._id} page="Session proposal form" urltype="propose_session" button="sideButton" />
            </Row>}
          {isAuthenticated &&
            (user!.email === props.conference[0].ownerEmail || props.conference[0].confSessProposalCommittee.includes(user!.email)) &&
            <>
              {urlType !== "session_proposals" &&
                <Row>
                  <InternalLinkButton confid={props.conference[0]._id} page="View Session Proposals" urltype="session_proposals" button="committeeButton" />
                </Row>}
              {urlType !== "committee" &&
                <Row>
                  <InternalLinkButton confid={props.conference[0]._id} page="Proposal Review Committee" urltype="committee" button="committeeButton" />
                </Row>}
            </>}
          {isAuthenticated &&
            (user!.email === props.conference[0].ownerEmail || props.conference[0].confAdmins.includes(user!.email)) &&
            <>
              {urlType !== "attendees" &&
                <Row>
                  <InternalLinkButton confid={props.conference[0]._id} page="View Attendees" urltype="attendees" button="adminButton" />
                </Row>}
              {urlType !== "exhibitors" &&
                <Row>
                  <InternalLinkButton confid={props.conference[0]._id} page="View Exhibitors" urltype="exhibitors" button="adminButton" />
                </Row>}
              {urlType !== "presenters" &&
                <Row>
                  <InternalLinkButton confid={props.conference[0]._id} page="View Presenters" urltype="presenters" button="adminButton" />
                </Row>}
              <Row>
                <InternalLinkButton confid={props.conference[0]._id} page="Edit Conference" urltype="edit_conference" button="adminButton" />
              </Row>
              <Row>
                <InternalLinkButton confid={props.conference[0]._id} page="Edit Schedule" urltype="schedule" button="adminButton" />
              </Row>
              <Row>
                <InternalLinkButton confid={props.conference[0]._id} page="Add Attendee" urltype="admin_register_att" button="adminButton" />
              </Row>
              <Row>
                <InternalLinkButton confid={props.conference[0]._id} page="Add Exhibit" urltype="admin_register_exh" button="adminButton" />
              </Row>
              <Row>
                <InternalLinkButton confid={props.conference[0]._id} page="Add Session" urltype="new_session" button="adminButton" />
              </Row>
              <Row>
                <p className="whitespace">New presenters may only be added by adding a new session or editing an existing session.</p>
              </Row>
            </>}

          {/* Will need to add deletesess={() => handleSessDelete(sess._id)}? Or only from sessionCard? */}
          <ConfirmModal btnname={btnName} confname={thisName} urlid={props.conference[0]._id} unregatt={() => handleAttUnreg(thisId!, user!.email!)} unregexh={() => handleExhUnreg(thisId!, user!.email!)} show={showConfirm === (props.conference[0]._id && btnName)} hide={handleHideConfirm} />

          <SuccessModal conference={props.conference} confname={thisName} urlid={props.conference[0]._id} urltype={urlType} btnname={btnName} show={props.showSuccess === (props.conference[0]._id && btnName)} hide={handleHideSuccess} />

          <ErrorModal conference={props.conference} urlid={props.conference[0]._id} urltype={urlType} errmsg={errThrown} btnname={btnName} show={showErr === (props.conference[0]._id && btnName)} hide={handleHideErr} />

        </Nav>
      }
    </>
  )
}

export default Sidenav;