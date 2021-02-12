import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Row, Col, Button, ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import { ConferenceCard, UserCard } from "../cards";
import { AttendeeAPI, ConferenceAPI, UserAPI } from "../../utils/api";
import "./style.css";

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth0();
  const [whichConf, setWhichConf] = useState();
  const [createConf, setCreateConf] = useState([]);
  const [attendConf, setAttendConf] = useState([]);
  const [presentConf, setPresentConf] = useState([]);
  const [exhibitConf, setExhibitConf] = useState([]);
  const [pageReady, setPageReady] = useState(false);
  const location = useLocation();

  const radios = ["Attending", "Created", "Exhibiting", "Presenting"]

  // GET conference by ID
  const getConfById = async (confId) => {
    return ConferenceAPI.getConferenceById(confId)
      .then(resp => {
        console.log(resp)
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
        const data = resp.data
        const result = data.map(conf => conf.confId)
        return result
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
    let unsorted = []
    let regConfIds = await getRegisteredConferenceIds(user.email)
    // Map through the array of confIds to get info on each conference
    // Push each conference object to new array
    regConfIds.forEach(confId => {
      getConfById(confId).then(resp => {
        unsorted = [...unsorted, resp.data[0]]
        // When new array is same length as confIds array, sort new array & set it in state
        if (unsorted.length === regConfIds.length) {
          const sortedAtt = unsorted.sort((a, b) => (a.startDate < b.startDate) ? 1 : -1);
          setAttendConf(sortedAtt)
        }
      })
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
        const sortedCreate = createArr.sort((a, b) => (a.startDate < b.startDate) ? 1 : -1)
        setCreateConf(sortedCreate)
      })
      .catch(err => console.log(err))
  }

  // Handles click on "Exhibiting" button
  const handleShowExhibiting = (e) => {
    handleInputChange(e);
    // Creates array of conferences at which the user is exhibiting
    ConferenceAPI.getConferencesExhibiting(user.email)
      .then(resp => {
        console.log("getConfExhibiting", resp.data)
        const exhibitArr = resp.data
        const sortedExhibit = exhibitArr.sort((a, b) => (a.startDate < b.startDate) ? 1 : -1)
        setExhibitConf(sortedExhibit)
      })
      .catch(err => console.log(err))
  }

  // Handles click on "Presenting" button
  const handleShowPresenting = (e) => {
    handleInputChange(e);
    // Creates array of conferences at which the user is exhibiting
    ConferenceAPI.getConferencesPresenting(user.email)
      .then(resp => {
        console.log("getConfPresenting", resp.data)
        const presentArr = resp.data
        const sortedPresent = presentArr.sort((a, b) => (a.startDate < b.startDate) ? 1 : -1)
        setPresentConf(sortedPresent)
      })
      .catch(err => console.log(err))
  }

  // Save user to database
  const saveUserToDB = async () => {
    UserAPI.saveUser(user)
      .then(resp => {
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    saveUserToDB();

    // Sets pageReady(true) for page load
    setPageReady(true);
  }, [attendConf])

  return (
    <>
      { pageReady === true &&
        isAuthenticated && (
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
                <ToggleButtonGroup name="whichConf" type="radio">
                  <ToggleButton id="attendingConf" value="attend" data-toggle="popover" title="View conferences you're attending" className="button" checked={whichConf === "attend"} onChange={handleShowAttending}>
                    Attending
                  </ToggleButton>
                  <ToggleButton id="createdConf" value="create" data-toggle="popover" title="View conferences you've created" className="button" checked={whichConf === "create"} onChange={handleShowCreated}>
                    Created
                  </ToggleButton>
                  <ToggleButton id="exhibitingConf" value="exhibit" data-toggle="popover" title="View conferences at which you're exhibiting" className="button" checked={whichConf === "exhibit"} onChange={handleShowExhibiting}>
                    Exhibiting
                  </ToggleButton>
                  <ToggleButton id="presentingConf" value="present" data-toggle="popover" title="View conferences at which you're presenting" className="button" checked={whichConf === "present"} onChange={handleShowPresenting}>
                    Presenting
                  </ToggleButton>
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
              <h3>Please select which of your conferences you want to view.</h3>}
            {whichConf === "attend" &&
              (attendConf.length > 0
              ? <ConferenceCard conference={attendConf} />
              : <h3>We're sorry, you don't seem to be registered for any conferences at this time.</h3>)
            }
            {whichConf === "create" &&
              (createConf.length > 0
              ? <ConferenceCard conference={createConf} />
              : <h3>We're sorry, you don't seem to created any conferences at this time.</h3>)
            }
            {whichConf === "exhibit" &&
              (exhibitConf.length > 0
              ? <ConferenceCard conference={exhibitConf} />
              : <h3>We're sorry, you don't seem to be exhibiting at any conferences at this time.</h3>)
            }
            {whichConf === "present" &&
              (presentConf.length > 0
              ? <ConferenceCard conference={presentConf} />
              : <h3>We're sorry, you don't seem to be presenting at any conferences at this time.</h3>)
            }
          </Container >
        )
      }
    </>
  )
}
export default ProfilePage;