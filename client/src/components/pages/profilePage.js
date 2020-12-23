import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Row, Col, Button, Card, Image, ButtonGroup, ToggleButton } from "react-bootstrap";
import Conference from "../conferenceCard";
import API from "../../utils/api";
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

  //Save user to DB
  // const saveUserToDB = () => {
  //   API.saveUser(user)
  // }

  useEffect(() => {
    // saveUserToDB();
    API.getConferencesAttending(user.email).then(resp => {
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
    setPageReady(true);

    API.getConferencesByEmail(user.email).then(resp => {
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

    API.getConferencesPresenting(user.email).then(resp => {
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

    API.getConferencesExhibiting(user.email).then(resp => {
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
  }, [])

  return (
    <>
      { pageReady === true &&
        isAuthenticated && (
          <Container>
            <Row>
              <Col sm={4}></Col>
              <Card>
                <Row>
                  <Col sm={4}>
                    <Image fluid className="profilePic" src={user.picture} alt="Profile picture" />
                  </Col>
                  <Col sm={8}>
                    <h1>{user.name}</h1>
                    <h3>{user.email}</h3>
                  </Col>
                </Row>
              </Card>
              <Col sm={4}></Col>
            </Row>
            <Row>
              <div className="myConfs">
                <h1>My Conferences</h1>
              </div>
            </Row>
            <Row>
              <Col sm={6}>
                <ButtonGroup toggle defaultValue={1}>
                  <ToggleButton type="radio" name="whichConf" value={1} checked={whichConf === 1} onChange={handleInputChange}>
                    Attending
              </ToggleButton>
                  <ToggleButton type="radio" name="whichConf" value={2} checked={whichConf === 2} onChange={handleInputChange}>
                    Created
              </ToggleButton>
                  <ToggleButton type="radio" name="whichConf" value={3} checked={whichConf === 3} onChange={handleInputChange}>
                    Exhibiting
              </ToggleButton>
                  <ToggleButton type="radio" name="whichConf" value={4} checked={whichConf === 4} onChange={handleInputChange}>
                    Presenting
              </ToggleButton>
                </ButtonGroup>
              </Col>
              <Col sm={4}></Col>
              <Col sm={2}>
                <Link to="/new_conference" className={location.pathname === "/create_conference" ? "link active" : "link"}>
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