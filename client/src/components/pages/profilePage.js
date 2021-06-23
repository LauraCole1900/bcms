import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Row, Col, Image, Button, ButtonGroup } from "react-bootstrap";
import { ConferenceCard, UserCard } from "../cards";
import { ConfirmModal, ErrorModal, SuccessModal } from "../modals";
import { AttendeeAPI, ConferenceAPI, ExhibitorAPI, PresenterAPI, UserAPI } from "../../utils/api";
import "./style.css";

const ProfilePage = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const location = useLocation();
  const [whichConf, setWhichConf] = useState("create");
  const [attendConf, setAttendConf] = useState([]);
  const [createConf, setCreateConf] = useState([]);
  const [exhibitConf, setExhibitConf] = useState([]);
  const [presentConf, setPresentConf] = useState([]);
  const [errThrown, setErrThrown] = useState();
  const [btnName, setBtnName] = useState("");
  const [thisIdx, setThisIdx] = useState();
  const [thisId, setThisId] = useState();
  const [thisName, setThisName] = useState();
  const [pageReady, setPageReady] = useState(false);

  // Determines which page user is on, specifically for use with URLs that include the conference ID
  const urlArray = window.location.href.split("/")
  const urlId = urlArray[urlArray.length - 1]
  const urlType = urlArray[urlArray.length - 2]

  // Modal variables
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showErr, setShowErr] = useState(false);

  // Sets boolean to show or hide relevant modal
  const handleShowConfirm = () => setShowConfirm(true);
  const handleHideConfirm = () => setShowConfirm(false);
  const handleShowSuccess = () => setShowSuccess(true);
  const handleHideSuccess = () => setShowSuccess(false);
  const handleShowErr = () => setShowErr(true);
  const handleHideErr = () => setShowErr(false);

  // GET conference by ID
  const getConfById = async (confId) => {
    return ConferenceAPI.getConferenceById(confId)
      .then(resp => {
        return resp
      })
      .catch(err => {
        console.log(err)
        return false
      });
  }

  // GET IDs of conferences user is registered for
  const getRegisteredConferenceIds = async (email) => {
    return AttendeeAPI.getConferencesAttending(email)
      .then(resp => {
        const attData = resp.data
        const attResult = attData.map(conf => conf.confId)
        return attResult
      })
      .catch(err => {
        console.log(err)
        return false
      })
  }

  // GET IDs of conferences at which user is exhibiting
  const getExhibitingConferenceIds = async (email) => {
    return ExhibitorAPI.getConferencesExhibiting(email)
      .then(resp => {
        const exhData = resp.data
        const exhResult = exhData.map(conf => conf.confId)
        return exhResult
      })
      .catch(err => {
        console.log(err)
        return false
      })
  }

  // GET IDs of conferences at which user is presenting
  const getPresentingConferenceIds = async (email) => {
    return PresenterAPI.getConferencesPresenting(email)
      .then(resp => {
        const presData = resp.data
        const presResult = presData.map(conf => conf.confId)
        return presResult
      })
      .catch(err => {
        console.log(err)
        return false
      })
  }

  // Handles click on buttons to determine which set of conferences to display
  const handleInputChange = (e) => {
    const whichConf = e.target.value
    setWhichConf(whichConf)
  }

  // Handles click on "Attending" button
  const handleShowAttending = async (e) => {
    handleInputChange(e);
    let unsortedAtt = []
    let regConfIds = await getRegisteredConferenceIds(user.email)
    // Map through the array of confIds to get info on each conference
    // Push each conference object to new array
    regConfIds.forEach(confId => {
      getConfById(confId).then(resp => {
        unsortedAtt = [...unsortedAtt, resp.data[0]]
        // When new array is same length as confIds array, sort new array & set it in state
        if (unsortedAtt.length === regConfIds.length) {
          const sortedAtt = unsortedAtt.sort((a, b) => (a.startDate < b.startDate) ? 1 : -1);
          setAttendConf(sortedAtt)
        }
      })
        .catch(err => console.log(err))
    })
  }

  // Handles click on "Created" button
  const handleShowCreated = (e) => {
    handleInputChange(e);
    // Creates array of conferences user has created
    ConferenceAPI.getConferencesCreated(user.email)
      .then(resp => {
        console.log("getConfCreated", resp.data)
        const createArr = resp.data
        // Sorts conferences by date, latest to earliest
        const sortedCreate = createArr.sort((a, b) => (a.startDate < b.startDate) ? 1 : -1)
        setCreateConf(sortedCreate)
      })
      .catch(err => console.log(err))
  }

  // Handles click on "Exhibiting" button
  const handleShowExhibiting = async (e) => {
    handleInputChange(e);
    let unsortedExh = []
    let exhConfIds = await getExhibitingConferenceIds(user.email)
    // Map through the array of confIds to get info on each conference
    // Push each conference object to new array
    exhConfIds.forEach(confId => {
      getConfById(confId).then(resp => {
        unsortedExh = [...unsortedExh, resp.data[0]]
        // When new array is same length as confIds array, sort new array & set it in state
        if (unsortedExh.length === exhConfIds.length) {
          const sortedExh = unsortedExh.sort((a, b) => (a.startDate < b.startDate) ? 1 : -1);
          setExhibitConf(sortedExh)
        }
      })
        .catch(err => console.log(err))
    })
  }

  // Handles click on "Presenting" button
  const handleShowPresenting = async (e) => {
    handleInputChange(e);
    let unsortedPres = [];
    let presConfIds = await getPresentingConferenceIds(user.email)
    // Map through the array of confIds to get info on each conference
    // Push each conference object to new array
    presConfIds.forEach(confId => {
      getConfById(confId).then(resp => {
        unsortedPres = [...unsortedPres, resp.data[0]]
        // When new array is same length as confIds array, sort new array & set it in state
        if (unsortedPres.length === presConfIds.length) {
          const sortedPres = unsortedPres.sort((a, b) => (a.startDate < b.startDate) ? 1 : -1);
          setPresentConf(sortedPres)
        }
      })
        .catch(err => console.log(err))
    })
  }

  // Defines button properties
  const buttons = [{
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
  const fetchUser = async (email) => {
    return UserAPI.getUserByEmail(email)
      .then(resp => {
        const userObj = resp.data
        return userObj
      })
      .catch(err => console.log(err))
  }

  // Save user to database
  const saveUserToDB = async () => {
    let savedUser = await fetchUser(user.email)
    if (savedUser) {
      return false
    } else {
      UserAPI.saveUser(user)
        .catch(err => console.log(err))
    }
  }
  
  // GETs registered attendees' emails
  const fetchAttendeeEmails = async (confId) => {
    console.log("from confCard fetchAttendees", confId)
    await AttendeeAPI.getAttendees(confId)
      .then(res => {
        // map through res.data and pull all emails into an array
        const attData = res.data
        let attEmails = attData.map(attData => attData.email)
        return attEmails
      })
      .catch(err => {
        console.log("from confCard fetAttEmails", err)
        setErrThrown(err.message);
        handleShowErr();
      })
  }
  
  // Handles click on "Yes, Cancel" button on ConfirmModal
  // Will need to have email functionality to email registered participants
  const handleConfCancel = async (data, confId) => {
    console.log("from allConfsPage handleConfCancel", data, confId)
    handleHideConfirm();
    let attEmailArr = await fetchAttendeeEmails(confId);
    // send-email functionality for registered attendees goes here

    ExhibitorAPI.getExhibitors(confId)
      .then(res => {
        if (!res.err) {
          console.log("from allConfsPage getExhibitors", res.data)
        }
      })
      .catch(err => {
        console.log("from allConfsPage getExhibitors", err);
        setErrThrown(err.message);
        handleShowErr();
      })

    ConferenceAPI.updateConference({ ...confArray[thisIdx], confCancel: "yes" }, confId)
      .then(res => {
        if (!res.err) {
          handleShowSuccess();
        }
      })
      .catch(err => {
        console.log("from allConfsPage updateConf", err);
        setErrThrown(err.message);
        handleShowErr();
      });
  };

  // Handles click on "Yes, unregister attendee" button on ConfirmModal
  const handleAttUnreg = (confId, email) => {
    console.log("from confirm attUnreg", confId, email)
    handleHideConfirm();
    // DELETE call to delete attendee document
    AttendeeAPI.unregisterAttendee(confId, email)
      .then(res => {
        // If no errors thrown, show Success modal
        if (!res.err) {
          handleShowSuccess()
        }
      })
      // If yes errors thrown, show Error modal
      .catch(err => {
        console.log(err);
        setErrThrown(err.message);
        handleShowErr();
      });
  }

  // Handles click on "Yes, unregister exhibitor" button on ConfirmModal
  const handleExhUnreg = (confId, email) => {
    console.log("from confirm exhUnreg", confId, email)
    handleHideConfirm();
    // DELETE call to delete exhibitor document
    ExhibitorAPI.deleteExhibitor(confId, email)
      .then(res => {
        // If no errors thrown, show Success modal
        if (!res.err) {
          handleShowSuccess();
        }
      })
      // If yes errors thrown, show Error modal
      .catch(err => {
        console.log(err)
        setErrThrown(err.message);
        handleShowErr();
      });
  }

  useEffect(() => {
    if (isAuthenticated) {
      switch (pageReady) {
        case true:
          return false;
        default:
          saveUserToDB();
      }

      ConferenceAPI.getConferencesCreated(user.email)
        .then(resp => {
          console.log("getConfCreated", resp.data)
          const createArr = resp.data
          // Sorts conferences by date, latest to earliest
          const sortedCreate = createArr.sort((a, b) => (a.startDate < b.startDate) ? 1 : -1)
          setCreateConf(sortedCreate)
          // Sets pageReady(true) for page load
          setPageReady(true);
        })
        .catch(err => console.log(err))
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSuccess])


  return (
    <>
      {!isAuthenticated &&
        <Row>
          <h1 className="regRemind">Please <Link to={window.location.origin} className="login" onClick={() => loginWithRedirect()}>log in</Link> to view your profile.</h1>
          <div className="authLogo"><Image fluid="true" className="loadLogo" src="/images/bristlecone-dark.png" alt="BCMS logo" /></div>
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
                <ButtonGroup name="whichConf" type="radio" data-toggle="popover">
                  {buttons.map((button, idx) => (
                    <Button
                      key={idx}
                      id={button.id}
                      value={button.value}
                      active={whichConf === button.value}
                      title={button.title}
                      className="button"
                      onClick={button.onClick}>{button.name}</Button>
                  ))}
                </ButtonGroup>
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
                ? <ConferenceCard conference={attendConf} setBtnName={setBtnName} setThisId={setThisId} setThisIdx={setThisIdx} setThisName={setThisName} handleShowConfirm={handleShowConfirm} setErrThrown={setErrThrown} handleShowErr={handleShowErr} handleShowSuccess={handleShowSuccess} urlId={urlId} urlType={urlType} />
                : <h3>We're sorry, you don't seem to be registered for any conferences at this time.</h3>)
            }
            {whichConf === "create" &&
              (createConf.length > 0
                ? <ConferenceCard conference={createConf} setBtnName={setBtnName} setThisId={setThisId} setThisIdx={setThisIdx} setThisName={setThisName} handleShowConfirm={handleShowConfirm} setErrThrown={setErrThrown} handleShowErr={handleShowErr} handleShowSuccess={handleShowSuccess} urlId={urlId} urlType={urlType} />
                : <h3>We're sorry, you don't seem to have created any conferences at this time.</h3>)
            }
            {whichConf === "exhibit" &&
              (exhibitConf.length > 0
                ? <ConferenceCard conference={exhibitConf} setBtnName={setBtnName} setThisId={setThisId} setThisIdx={setThisIdx} setThisName={setThisName} handleShowConfirm={handleShowConfirm} setErrThrown={setErrThrown} handleShowErr={handleShowErr} handleShowSuccess={handleShowSuccess} urlId={urlId} urlType={urlType} />
                : <h3>We're sorry, you don't seem to be exhibiting at any conferences at this time.</h3>)
            }
            {whichConf === "present" &&
              (presentConf.length > 0
                ? <ConferenceCard conference={presentConf} setBtnName={setBtnName} setThisId={setThisId} setThisIdx={setThisIdx} setThisName={setThisName} handleShowConfirm={handleShowConfirm} setErrThrown={setErrThrown} handleShowErr={handleShowErr} handleShowSuccess={handleShowSuccess} urlId={urlId} urlType={urlType} />
                : <h3>We're sorry, you don't seem to be presenting at any conferences at this time.</h3>)
            }
            
            {/* Will need to add deletesess={() => handleSessDelete(sess._id)}? Or only from sessionCard? */}
            <ConfirmModal btnname={btnName} confname={thisName} urlid={urlId} cancelconf={() => handleConfCancel(confArray[thisIdx], thisId)} unregatt={() => handleAttUnreg(thisId, user.email)} unregexh={() => handleExhUnreg(thisId, user.email)} show={showConfirm === true} hide={(e) => handleHideConfirm(e)} />

            <SuccessModal conference={confArray[thisIdx]} confname={thisName} confid={thisId} urlid={urlId} urltype={urlType} btnname={btnName} show={showSuccess === true} hide={(e) => handleHideSuccess(e)} />

            <ErrorModal conference={confArray[thisIdx]} confName={thisName} confid={thisId} urlid={urlId} urltype={urlType} errmsg={errThrown} btnname={btnName} show={showErr === true} hide={(e) => handleHideErr(e)} />

          </Container >
        )
      }
    </>
  )
}
export default ProfilePage;