import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Row, Col, Button, ButtonGroup, ToggleButton } from "react-bootstrap";
import { ConferenceCard, UserCard } from "../cards";
import { AttendeeAPI, ConferenceAPI, UserAPI } from "../../utils/api";
import "./style.css";

const Profile = () => {
  const { user, isAuthenticated } = useAuth0();
  const [whichConf, setWhichConf] = useState();
  const [createConf, setCreateConf] = useState([]);
  const [attendConfId, setAttendConfId] = useState([]);
  const [attendConf, setAttendConf] = useState([]);
  const [presentConf, setPresentConf] = useState([]);
  const [exhibitConf, setExhibitConf] = useState([]);
  const [pastConf, setPastConf] = useState([]);
  const [idConfs, setIdConfs] = useState([]);
  const [pageReady, setPageReady] = useState(false);
  const location = useLocation();

  function confById(confId) {
    console.log("profilePage confById", confId)
    ConferenceAPI.getConferenceById(confId)
      .then(resp => {
        console.log("profilePage getConfById resp.data", resp.data)
        const idObj = resp.data[0]
        console.log("profilePage getConfById idObj", idObj)
        setIdConfs([{ ...idConfs }], idObj)
        console.log("profilePage getConfById idConfs", idConfs);
        // const filteredId = idConfs.filter(a => new Date(a.startDate) - new Date() >= 0);
        // const sortedId = filteredId.sort((a, b) => (a.startDate > b.startDate) ? 1 : -1);
      })
      .catch(err => console.log(err));
  }

  const handleInputChange = (e) => {
    const whichConf = e.target.value
    // setIdConfs([]);
    setWhichConf(whichConf)
  }

  // Handles click on "Attending" button
  const handleShowAttending = (e) => {
    handleInputChange(e);
    // Creates array of conferences for which the user has registered
    AttendeeAPI.getConferencesAttending(user.email)
      .then(resp => {
        console.log("profilePage getConfAttending resp.data", resp.data)
        const attArr = resp.data
        // Map through resp.data for all resp.data.confId - THIS WORKS
        // Put all confIds into array - THIS WORKS
        // Map through array to query each confId - THIS WORKS
        // Put resulting results into array
        // Render
        const attConfId = attArr.map(attArr => attArr.confId)
        console.log("from profilePage attArr.map confIds", attConfId)
        attConfId.map(confById)
        console.log("from getConfAtt idConfs", idConfs);
        const filteredAtt = idConfs.filter(a => new Date(a.startDate) - new Date() >= 0);
        const sortedAtt = filteredAtt.sort((a, b) => (a.startDate > b.startDate) ? 1 : -1);
        setAttendConf(sortedAtt)
      })
      .catch(err => console.log(err))
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

  // Handles click on "Past" button
  const handleShowPast = (e) => {
    handleInputChange(e);
    // Uses above arrays to find past conference with which the user's email is associated
    // const pastArr = [attendConf, createConf, presentConf, exhibitConf];
    // const filteredConf = pastArr.filter(a => new Date(a.startDate) - new Date() < 0);
    // const sortedPast = filteredConf.sort((a, b) => (a.startDate > b.startDate) ? 1 : -1)
    // setPastConf(sortedPast)
  }

  // Save user to DB
  const saveUserToDB = () => {
    UserAPI.saveUser(user)
      .catch(err => console.log(err))
  }

  useEffect(() => {
    saveUserToDB();
    // Sets pageReady(true) for page load
    setPageReady(true);
  }, [])


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
                <ButtonGroup toggle defaultValue={1}>
                  <ToggleButton type="radio" id="attendingConf" name="whichConf" value="attend" className="button" checked={whichConf === "attend"} onClick={handleShowAttending}>
                    Attending
                  </ToggleButton>
                  <ToggleButton type="radio" id="createdConf" name="whichConf" value="create" className="button" checked={whichConf === "create"} onClick={handleShowCreated}>
                    Created
                  </ToggleButton>
                  <ToggleButton type="radio" id="exhibitingConf" name="whichConf" value="exhibit" className="button" checked={whichConf === "exhibit"} onClick={handleShowExhibiting}>
                    Exhibiting
                  </ToggleButton>
                  <ToggleButton type="radio" id="presentingConf" name="whichConf" value="present" className="button" checked={whichConf === "present"} onClick={handleShowPresenting}>
                    Presenting
                  </ToggleButton>
                  <ToggleButton type="radio" id="pastConf" name="whichConf" value="past" className="button" checked={whichConf === "past"} onClick={handleShowPast}>
                    Past conferences
                  </ToggleButton>
                </ButtonGroup>
              </Col>
              <Col sm={2}></Col>
              <Col sm={2}>
                <Link to="/new_conference" className={location.pathname === "/new_conference" ? "link active" : "link"}>
                  <Button data-toggle="popover" className="button" title="Create a new conference">New Conference</Button>
                </Link>
              </Col>
            </Row>
            {whichConf === "attend" &&
              attendConf.length > 0 &&
              <ConferenceCard conference={attendConf} />
            }
            {whichConf === "attend" &&
              attendConf.length === 0 &&
              <h3>We're sorry, you don't seem to be registered for any conferences at this time.</h3>
            }
            {whichConf === "create" &&
              createConf.length > 0 &&
              <ConferenceCard conference={createConf} />
            }
            {whichConf === "create" &&
              createConf.length === 0 &&
              <h3>We're sorry, you don't seem to created any conferences at this time.</h3>
            }
            {whichConf === "exhibit" &&
              exhibitConf.length > 0 &&
              <ConferenceCard conference={exhibitConf} />
            }
            {whichConf === "exhibit" &&
              exhibitConf.length === 0 &&
              <h3>We're sorry, you don't seem to be exhibiting at any conferences at this time.</h3>
            }
            {whichConf === "present" &&
              presentConf.length > 0 &&
              <ConferenceCard conference={presentConf} />
            }
            {whichConf === "present" &&
              presentConf.length === 0 &&
              <h3>We're sorry, you don't seem to be presenting at any conferences at this time.</h3>
            }
            {whichConf === "past" &&
              pastConf.length > 0 &&
              <ConferenceCard conference={pastConf} />
            }
            {/* {whichConf === "past" &&
              pastConf.length === 0 &&
              <h3>We're sorry, your email doesn't seem to be associated with any past conferences at this time.</h3>
            } */}
          </Container >
        )
      }
    </>
  )
}

export default Profile;