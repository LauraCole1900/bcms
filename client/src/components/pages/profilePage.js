import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Row, Col, Button, ButtonGroup, ToggleButton } from "react-bootstrap";
import Conference from "../conferenceCard";
import UserCard from "../userCard";
import { ConferenceAPI, UserAPI } from "../../utils/api";
import "./style.css";

const Profile = () => {
  const { user, isAuthenticated } = useAuth0();
  const [whichConf, setWhichConf] = useState();
  const [createConf, setCreateConf] = useState();
  const [attendConf, setAttendConf] = useState();
  const [presentConf, setPresentConf] = useState();
  const [exhibitConf, setExhibitConf] = useState();
  const [pageReady, setPageReady] = useState(false);
  const location = useLocation();

  const handleInputChange = (e) => {
    const whichConf = e.target.value
    console.log(whichConf)
    setWhichConf(whichConf)
  }

  // Save user to DB
  const saveUserToDB = () => {
    UserAPI.saveUser(user)
  }

  useEffect(() => {
    saveUserToDB();
    ConferenceAPI.getConferencesAttending(user.email).then(resp => {
      const attArr = resp.data
      const sortedAtt = attArr.sort((a, b) => (a.startDate > b.startDate) ? 1 : -1)
      if (sortedAtt.length > 0) {
        return (
          setAttendConf(sortedAtt)
        )
      } else {
        return (
          <h3>We're sorry, you don't seem to be registered for any conferences at this time.</h3>
        )
      }
    })

    ConferenceAPI.getConferencesByEmail(user.email).then(resp => {
      const createArr = resp.data
      const sortedCreate = createArr.sort((a, b) => (a.startDate > b.startDate) ? 1 : -1)
      if (sortedCreate.length > 0) {
        return (
          setCreateConf(sortedCreate)
        )
      } else {
        return (
          <h3>We're sorry, you don't seem to have created any conferences at this time.</h3>
        )
      }
    })

    ConferenceAPI.getConferencesPresenting(user.email).then(resp => {
      const presentArr = resp.data
      const sortedPresent = presentArr.sort((a, b) => (a.startDate > b.startDate) ? 1 : -1)
      if (sortedPresent.length > 0) {
        return (
          setPresentConf(sortedPresent)
        )
      } else {
        return (
          <h3>We're sorry, you don't seem to be presenting at any conferences at this time.</h3>
        )
      }
    })

    ConferenceAPI.getConferencesExhibiting(user.email).then(resp => {
      const exhibitArr = resp.data
      const sortedExhibit = exhibitArr.sort((a, b) => (a.startDate > b.startDate) ? 1 : -1)
      if (sortedExhibit.length > 0) {
        return (
          setExhibitConf(sortedExhibit)
        )
      } else {
        return (
          <h3>We're sorry, you don't seem to be exhibiting at any conferences at this time.</h3>
        )
      }
    })
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
                  <ToggleButton type="radio" id="attendingConf" name="whichConf" value={1} checked={whichConf === 1} onChange={handleInputChange}>
                    Attending
                  </ToggleButton>
                  <ToggleButton type="radio" id="createdConf" name="whichConf" value={2} checked={whichConf === 2} onChange={handleInputChange}>
                    Created
                  </ToggleButton>
                  <ToggleButton type="radio" id="exhibitingConf" name="whichConf" value={3} checked={whichConf === 3} onChange={handleInputChange}>
                    Exhibiting
                  </ToggleButton>
                  <ToggleButton type="radio" id="presentingConf" name="whichConf" value={4} checked={whichConf === 4} onChange={handleInputChange}>
                    Presenting
                  </ToggleButton>
                  <ToggleButton type="radio" id="pastConf" name="whichConf" value={5} checked={whichConf === 5} onChange={handleInputChange}>
                    Past conferences
                  </ToggleButton>
                </ButtonGroup>
              </Col>
              <Col sm={2}></Col>
              <Col sm={2}>
                <Link to="/new_conference" className={location.pathname === "/new_conference" ? "link active" : "link"}>
                  <Button data-toggle="popover" title="Create a new conference">New Conference</Button>
                </Link>
              </Col>
            </Row>
            {whichConf === 1 &&
              <Conference conference={attendConf} />
            }
            {whichConf === 2 &&
              <Conference conference={createConf} />
            }
            {whichConf === 3 &&
              <Conference conference={exhibitConf} />
            }
            {whichConf === 4 &&
              <Conference conference={presentConf} />
            }
          </Container >
        )
      }
    </>
  )
}

export default Profile;