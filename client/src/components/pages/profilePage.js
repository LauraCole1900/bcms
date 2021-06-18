import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Row, Col, Image, Button, ButtonGroup } from "react-bootstrap";
import { ConferenceCard, UserCard } from "../cards";
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
  const [changeToggle, setChangeToggle] = useState(false);
  const [pageReady, setPageReady] = useState(false);

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

  const handleToggle = () => {
    switch (changeToggle) {
      case true:
        setChangeToggle(false);
        break;
      default:
        setChangeToggle(true);
    }
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
  }, [changeToggle, createConf])


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
                ? <ConferenceCard conference={attendConf} change={handleToggle} />
                : <h3>We're sorry, you don't seem to be registered for any conferences at this time.</h3>)
            }
            {whichConf === "create" &&
              (createConf.length > 0
                ? <ConferenceCard conference={createConf} change={handleToggle} />
                : <h3>We're sorry, you don't seem to have created any conferences at this time.</h3>)
            }
            {whichConf === "exhibit" &&
              (exhibitConf.length > 0
                ? <ConferenceCard conference={exhibitConf} change={handleToggle} />
                : <h3>We're sorry, you don't seem to be exhibiting at any conferences at this time.</h3>)
            }
            {whichConf === "present" &&
              (presentConf.length > 0
                ? <ConferenceCard conference={presentConf} change={handleToggle} />
                : <h3>We're sorry, you don't seem to be presenting at any conferences at this time.</h3>)
            }
          </Container >
        )
      }
    </>
  )
}
export default ProfilePage;