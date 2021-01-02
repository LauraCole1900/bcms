import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Row, Col, Button, ButtonGroup, ToggleButton } from "react-bootstrap";
import { ConferenceCard, UserCard } from "../cards";
import { ConferenceAPI, UserAPI } from "../../utils/api";
import "./style.css";

const Profile = () => {
  const { user, isAuthenticated } = useAuth0();
  const [whichConf, setWhichConf] = useState();
  const [createConf, setCreateConf] = useState();
  const [attendConf, setAttendConf] = useState();
  const [presentConf, setPresentConf] = useState();
  const [exhibitConf, setExhibitConf] = useState();
  const [pastConf, setPastConf] = useState();
  const [pageReady, setPageReady] = useState(false);
  const location = useLocation();

  const handleInputChange = (e) => {
    const whichConf = e.target.value
    console.log("inputChange whichConf", whichConf)
    setWhichConf(whichConf)
  }

  // Save user to DB
  const saveUserToDB = () => {
    UserAPI.saveUser(user)
  }

  useEffect(() => {
    saveUserToDB();
    // Creates array of conferences for which the user has registered
    ConferenceAPI.getConferencesAttending(user.email)
      .then(resp => {
        console.log("getConfAttending", resp.data)
        const attArr = resp.data
        const sortedAtt = attArr.sort((a, b) => (a.startDate > b.startDate) ? 1 : -1)
        setAttendConf(sortedAtt)
      })
      .catch(err => console.log(err))

    // Creates array of conferences user has created
    ConferenceAPI.getConferencesCreated(user.email)
      .then(resp => {
        console.log("getConfCreated", resp.data)
        const createArr = resp.data
        const sortedCreate = createArr.sort((a, b) => (a.startDate > b.startDate) ? 1 : -1)
        setCreateConf(sortedCreate)
      })
      .catch(err => console.log(err))

    // Creates array of conferences at which the user is presenting
    ConferenceAPI.getConferencesPresenting(user.email)
      .then(resp => {
        console.log("getConfPresenting", resp.data)
        const presentArr = resp.data
        const sortedPresent = presentArr.sort((a, b) => (a.startDate > b.startDate) ? 1 : -1)
        setPresentConf(sortedPresent)
      })
      .catch(err => console.log(err))

    // Creates array of conferences at which the user is exhibiting
    ConferenceAPI.getConferencesExhibiting(user.email)
      .then(resp => {
        console.log("getConfExhibiting", resp.data)
        const exhibitArr = resp.data
        const sortedExhibit = exhibitArr.sort((a, b) => (a.startDate > b.startDate) ? 1 : -1)
        setExhibitConf(sortedExhibit)
      })
      .catch(err => console.log(err))

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
                  <ToggleButton type="radio" id="attendingConf" name="whichConf" value="attend" className="button" checked={whichConf === "attend"} onChange={(handleInputChange)}>
                    Attending
                  </ToggleButton>
                  <ToggleButton type="radio" id="createdConf" name="whichConf" value="create" className="button" checked={whichConf === "create"} onChange={handleInputChange}>
                    Created
                  </ToggleButton>
                  <ToggleButton type="radio" id="exhibitingConf" name="whichConf" value="exhibit" className="button" checked={whichConf === "exhibit"} onChange={handleInputChange}>
                    Exhibiting
                  </ToggleButton>
                  <ToggleButton type="radio" id="presentingConf" name="whichConf" value="present" className="button" checked={whichConf === "present"} onChange={handleInputChange}>
                    Presenting
                  </ToggleButton>
                  {/* <ToggleButton type="radio" id="pastConf" name="whichConf" value="past" className="button" checked={whichConf === "past"} onChange={handleInputChange}>
                    Past conferences
                  </ToggleButton> */}
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
            {/* {whichConf === "past" &&
              pastConf.length > 0 &&
              <ConferenceCard conference={presentConf} />
            }
            {whichConf === "past" &&
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