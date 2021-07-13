import React, { MouseEvent, ReactElement, SetStateAction, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Location } from "history";
import { ObjectId } from "mongoose";
import { useAuth0, User } from "@auth0/auth0-react";
import { Container, Row, Col, Image, Button, ToggleButtonGroup } from "react-bootstrap";
import { ConferenceCard, UserCard } from "../components/cards";
import { ConfirmModal, ErrorModal, SuccessModal } from "../components/modals";
import { AttendeeAPI, ConferenceAPI, ExhibitorAPI, PresenterAPI, UserAPI } from "../utils/api";
import { handleConfCancel, handleFetchConfIds, handleFetchOne, handleUnreg } from "../utils/functions";
import { Conference } from "../utils/interfaces"
import { AxiosError, AxiosResponse } from "axios";
import "./style.css";

const ProfilePage = (): ReactElement => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0<User>();
  const location = useLocation<Location>();
  const [whichConf, setWhichConf] = useState<string>("create");
  const [conference, setConference] = useState<Conference>();
  const [attendConf, setAttendConf] = useState<Array<Conference>>([]);
  const [createConf, setCreateConf] = useState<Array<Conference>>([]);
  const [exhibitConf, setExhibitConf] = useState<Array<Conference>>([]);
  const [presentConf, setPresentConf] = useState<Array<Conference>>([]);
  const [errThrown, setErrThrown] = useState<string>();
  const [btnName, setBtnName] = useState<string>();
  const [thisId, setThisId] = useState<ObjectId>();
  const [thisName, setThisName] = useState<string>();
  const [pageReady, setPageReady] = useState<boolean>(false);

  // Determines which page user is on, specifically for use with URLs that include the conference ID
  const urlArray: Array<string> = window.location.href.split("/")
  const urlId: string = urlArray[urlArray.length - 1]
  const urlType: string = urlArray[urlArray.length - 2]

  // Modal variables
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showErr, setShowErr] = useState<boolean>(false);

  // Sets boolean to show or hide relevant modal
  const handleHideConfirm = (): boolean | void => setShowConfirm(false);
  const handleShowSuccess = (): boolean | void => setShowSuccess(true);
  const handleHideSuccess = (): boolean | void => {
    setShowSuccess(false);
    handleShowCreated();
  }
  const handleShowErr = () => setShowErr(true);
  const handleHideErr = () => setShowErr(false);

  // Handles click on buttons to determine which set of conferences to display
  const handleInputChange = (e: MouseEvent): SetStateAction<string> | void => {
    const whichConf = (e.target as HTMLButtonElement).value
    setWhichConf(whichConf)
  }

  // Handles click on "Attending" button
  const handleShowAttending = async (e: MouseEvent): Promise<Array<Conference> | void> => {
    handleInputChange(e);
    let unsortedAtt: Array<Conference> = [];
    let regConfIds: Array<ObjectId | string> = await handleFetchConfIds(AttendeeAPI.getConferencesAttending, user!.email!)
    // Map through the array of confIds to get info on each conference
    // Push each conference object to new array
    regConfIds.forEach((confId: string | ObjectId) => {
      handleFetchOne(ConferenceAPI.getConferenceById, confId, setConference)
        .then((resp: Array<Conference>) => {
          unsortedAtt = [...unsortedAtt, resp[0]]
          // When new array is same length as confIds array, sort new array & set it in state
          if (unsortedAtt.length === regConfIds!.length) {
            const sortedAtt: Array<Conference> = unsortedAtt.sort((a, b) => (a.startDate < b.startDate) ? 1 : -1);
            setAttendConf(sortedAtt)
          }
        })
        .catch((err: AxiosError) => console.log(err))
    })
  }

  // Handles click on "Created" button
  const handleShowCreated = (e?: MouseEvent): any | void => {
    if (e) {
      handleInputChange(e);
    }
    // Creates array of conferences user has created
    ConferenceAPI.getConferencesCreated(user!.email)
      .then((resp: AxiosResponse<Array<Conference>>) => {
        console.log("getConfCreated", resp.data)
        const createArr = resp.data
        // Sorts conferences by date, latest to earliest
        const sortedCreate = createArr.sort((a, b) => (a.startDate < b.startDate) ? 1 : -1)
        setCreateConf(sortedCreate)
      })
      .catch((err: AxiosError) => console.log(err))
  }

  // Handles click on "Exhibiting" button
  const handleShowExhibiting = async (e: MouseEvent): Promise<Array<Conference> | void> => {
    handleInputChange(e);
    let unsortedExh: Array<Conference> = [];
    let exhConfIds: Array<ObjectId | string> = await handleFetchConfIds(ExhibitorAPI.getConferencesExhibiting, user!.email!)
    // Map through the array of confIds to get info on each conference
    // Push each conference object to new array
    exhConfIds.forEach((confId: string | ObjectId) => {
      handleFetchOne(ConferenceAPI.getConferenceById, confId, setConference)
        .then((resp: Array<Conference>) => {
          unsortedExh = [...unsortedExh, resp[0]]
          // When new array is same length as confIds array, sort new array & set it in state
          if (unsortedExh.length === exhConfIds!.length) {
            const sortedExh: Array<Conference> = unsortedExh.sort((a, b) => (a.startDate < b.startDate) ? 1 : -1);
            setExhibitConf(sortedExh)
          }
        })
        .catch((err: AxiosError) => console.log(err))
    })
  }

  // Handles click on "Presenting" button
  const handleShowPresenting = async (e: MouseEvent): Promise<Array<Conference> | void> => {
    handleInputChange(e);
    let unsortedPres: Array<Conference> = [];
    let presConfIds: Array<ObjectId | string> = await handleFetchConfIds(PresenterAPI.getConferencesPresenting, user!.email!)
    // Map through the array of confIds to get info on each conference
    // Push each conference object to new array
    presConfIds.forEach((confId: string | ObjectId) => {
      handleFetchOne(ConferenceAPI.getConferenceById, confId, setConference)
        .then((resp: Array<Conference>) => {
          unsortedPres = [...unsortedPres, resp[0]]
          // When new array is same length as confIds array, sort new array & set it in state
          if (unsortedPres.length === presConfIds!.length) {
            const sortedPres: Array<Conference> = unsortedPres.sort((a, b) => (a.startDate < b.startDate) ? 1 : -1);
            setPresentConf(sortedPres)
          }
        })
        .catch((err: AxiosError) => console.log(err))
    })
  }

  // Defines button properties
  const buttons: any = [{
    name: "Attending",
    value: "attend",
    id: "attendConf",
    title: "View conferences you're attending",
    onClick: handleShowAttending
  },
  {
    name: "Created",
    value: "create",
    id: "createConf",
    title: "View conferences you've created",
    onClick: handleShowCreated
  },
  {
    name: "Exhibiting",
    value: "exhibit",
    id: "exhibitConf",
    title: "View conferences at which you're exhibiting",
    onClick: handleShowExhibiting
  },
  {
    name: "Presenting",
    value: "present",
    id: "presentConf",
    title: "View conferences at which you're presenting",
    onClick: handleShowPresenting
  }]

  // Get user by email
  const fetchUser = async (email: string): Promise<User | void> => {
    return UserAPI.getUserByEmail(email)
      .then((resp: AxiosResponse<User>) => {
        const userObj = resp.data
        return userObj
      })
      .catch((err: AxiosError) => console.log(err))
  }

  // Save user to database
  const saveUserToDB = async (): Promise<User | boolean | void> => {
    let savedUser: User | void = await fetchUser(user!.email!)
    if (savedUser) {
      return false
    } else {
      UserAPI.saveUser(user)
        .catch((err: AxiosError) => console.log(err))
    }
  }

  useEffect(() => {
    console.log({ showSuccess });
    if (isAuthenticated) {
      switch (pageReady) {
        case true:
          break;
        default:
          saveUserToDB();
      }
      handleShowCreated();
      setPageReady(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSuccess])


  return (
    <>
      {!isAuthenticated &&
        <Row>
          <h1 className="regRemind">Please <Link to={window.location.origin} className="login" onClick={() => loginWithRedirect()}>log in</Link> to view your profile.</h1>
          <div className="authLogo"><Image fluid className="loadLogo" src="/images/bristlecone-dark.png" alt="BCMS logo" /></div>
        </Row>}

      {isAuthenticated &&
        pageReady === true &&
        (
          <Container>
            <Row>
              <Col sm={3}></Col>
              <UserCard />
              <Col sm={3}></Col>
            </Row>
            <Row>
              <div className="myConfs">
                <h1>My Conferences</h1>
              </div>
            </Row>
            <Row>
              <Col sm={8}>
                <ToggleButtonGroup name="whichConf" type="radio" data-toggle="popover">
                  {buttons.map((button: any, idx: number) => (
                    <Button
                      key={idx}
                      id={button.id}
                      value={button.value}
                      active={whichConf === button.value}
                      title={button.title}
                      className="button"
                      onClick={button.onClick}>{button.name}</Button>
                  ))}
                </ToggleButtonGroup>
              </Col>
              <Col sm={2}></Col>
              <Col sm={2}>
                <Link to="/new_conference" className={location.pathname === "/new_conference" ? "link active" : "link"}>
                  <Button data-toggle="popover" className="button" title="Create a new conference">New Conference</Button>
                </Link>
              </Col>
            </Row>
            {whichConf === undefined &&
              <h3>Please select which of your conferences to view.</h3>}
            {whichConf === "attend" &&
              (attendConf.length > 0
                ? <ConferenceCard conference={attendConf} setConference={setConference} setBtnName={setBtnName} setShowConfirm={setShowConfirm} setThisId={setThisId} setThisName={setThisName} />
                : <h3>We're sorry, you don't seem to be registered for any conferences at this time.</h3>)
            }
            {whichConf === "create" &&
              (createConf.length > 0
                ? <ConferenceCard conference={createConf} setConference={setConference} setBtnName={setBtnName} setShowConfirm={setShowConfirm} setThisId={setThisId} setThisName={setThisName} />
                : <h3>We're sorry, you don't seem to have created any conferences at this time.</h3>)
            }
            {whichConf === "exhibit" &&
              (exhibitConf.length > 0
                ? <ConferenceCard conference={exhibitConf} setConference={setConference} setBtnName={setBtnName} setShowConfirm={setShowConfirm} setThisId={setThisId} setThisName={setThisName} />
                : <h3>We're sorry, you don't seem to be exhibiting at any conferences at this time.</h3>)
            }
            {whichConf === "present" &&
              (presentConf.length > 0
                ? <ConferenceCard conference={presentConf} setConference={setConference} setBtnName={setBtnName} setShowConfirm={setShowConfirm} setThisId={setThisId} setThisName={setThisName} />
                : <h3>We're sorry, you don't seem to be presenting at any conferences at this time.</h3>)
            }

            <ConfirmModal
              btnname={btnName}
              confname={thisName}
              urlid={urlId}
              cancelconf={() => handleConfCancel(
                AttendeeAPI.getAttendees,
                ExhibitorAPI.getExhibitors,
                thisId!,
                conference!,
                handleHideConfirm,
                handleShowSuccess,
                setErrThrown,
                handleShowErr
              )}
              unregatt={() => handleUnreg(
                AttendeeAPI.unregisterAttendee,
                thisId!,
                user!.email!,
                handleHideConfirm,
                handleShowSuccess,
                setErrThrown,
                handleShowErr
              )}
              unregexh={() => handleUnreg(
                ExhibitorAPI.deleteExhibitor,
                thisId!,
                user!.email!,
                handleHideConfirm,
                handleShowSuccess,
                setErrThrown,
                handleShowErr
              )}
              show={showConfirm === true}
              hide={() => handleHideConfirm()}
            />

            <SuccessModal
              conference={conference}
              confname={thisName}
              confid={thisId}
              urlid={urlId}
              urltype={urlType}
              btnname={btnName}
              show={showSuccess === true}
              hide={() => handleHideSuccess()}
            />

            <ErrorModal
              conference={conference}
              urlid={urlId}
              urltype={urlType}
              errmsg={errThrown}
              btnname={btnName}
              show={showErr === true}
              hide={() => handleHideErr()}
            />

          </Container >
        )
      }
    </>
  )
}

export default ProfilePage;