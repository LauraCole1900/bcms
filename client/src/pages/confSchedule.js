import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Row, Col } from "react-bootstrap";
import Moment from "react-moment";
import { ConferenceCard, UserCard } from "../components/cards";
import { ScheduleForm } from "../components/forms";
import { ScheduleGrid } from "../components/table";
import { Sidenav } from "../components/navbar";
import { AssignModal, ConfirmModal, ErrorModal, SessionModal, SuccessModal } from "../components/modals";
import { AttendeeAPI, ConferenceAPI, ExhibitorAPI, PresenterAPI, ScheduleAPI, SessionAPI } from "../utils/api";
import { handleConfCancel, handleDeleteById, handleFetchOne, handleUnreg } from "../utils/functions";
import "./style.css";

// TO DO
// Move AssignModal here
// Move SessionModal here?
// Reconnect functionality via props

const Schedule = () => {
  // Sessions that take more than one room (keynote, etc) should stretch across those rooms
  // Sessions that take more than one time block (registration, etc.) should stretch across those times
  // Registration: need to figure out how to determine if timeblock is after start time and before end time to include in merge

  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const [conference, setConference] = useState();
  const [presenters, setPresenters] = useState();
  const [sessions, setSessions] = useState();
  const [schedule, setSchedule] = useState();
  const [dates, setDates] = useState([]);
  const [errThrown, setErrThrown] = useState();
  const [btnName, setBtnName] = useState();
  const [thisId, setThisId] = useState();
  const [thisName, setThisName] = useState();
  const [thisSess, setThisSess] = useState();
  const [room, setRoom] = useState("");
  const [thisDate, setThisDate] = useState();
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [time, setTime] = useState("");
  const [confReady, setConfReady] = useState(false);
  const [presReady, setPresReady] = useState(false);
  const [schedReady, setSchedReady] = useState(false);
  const [sessReady, setSessReady] = useState(false);
  const [dateReady, setDateReady] = useState(false);
  const dateArr = [];

  // Grabs conference ID from URL
  const urlArray = window.location.href.split("/")
  const urlId = urlArray[urlArray.length - 1]
  const urlType = urlArray[urlArray.length - 2]

  // Modal variables
  const [showAssign, setShowAssign] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showErr, setShowErr] = useState(false);

  // Sets boolean to show or hide relevant modal
  const handleShowAssign = () => setShowAssign(true);
  const handleHideAssign = () => setShowAssign(false);
  const handleHideConfirm = () => setShowConfirm(false);
  const handleShowDetails = () => setShowDetails(true);
  const handleHideDetails = () => setShowDetails(false);
  const handleShowSuccess = () => setShowSuccess(true);
  const handleHideSuccess = () => setShowSuccess(false);
  const handleShowErr = () => setShowErr(true);
  const handleHideErr = () => setShowErr(false);

  // GETs presenters by confId
  const fetchPres = async (id) => {
    await PresenterAPI.getPresentersByConf(id)
      .then(resp => {
        console.log("from confSched fetchPres", resp.data)
        const presObj = resp.data;
        const filteredPres = presObj.filter(pres => pres.presAccepted === "yes")
        setPresenters(filteredPres);
        setPresReady(true);
      })
      .catch(err => console.log(err));
  }

  // GETs sessions by confId
  const fetchSess = async (id) => {
    await SessionAPI.getSessions(id)
      .then(resp => {
        console.log("from confSched fetchSess", resp.data)
        const sessArr = resp.data;
        const filteredSess = sessArr.filter(sess => sess.sessAccepted === "yes")
        setSessions(filteredSess);
        setSessReady(true);
      })
  }

  // Creates array of dates to map over to create schedule grids
  const createDateArr = async () => {
    // GETs conference
    let conf = await handleFetchOne(ConferenceAPI.getConferenceById, urlId, setConference);
    switch (conf[0].numDays) {
      case 1:
        dateArr.push(conf[0].startDate);
        console.log({ dateArr });
        setDates(dateArr);
        setDateReady(true);
        return dateArr;
      default:
        for (var i = 0; i < conf[0].numDays; i++) {
          let thisDate = conf[0].startDate;
          let thisDateArr = thisDate.split("-");
          let day = JSON.parse(thisDateArr[2])
          day = day + i
          thisDateArr = thisDateArr.slice(0, 2).concat(JSON.stringify(day)).join("-");
          dateArr.push(thisDateArr);
          if (dateArr.length === conf[0].numDays) {
            setDates(dateArr);
            setDateReady(true)
            return dateArr;
          }
        }
    }
  }

  useEffect(() => {
    fetchPres(urlId);
    handleFetchOne(ScheduleAPI.getScheduleByConfId, urlId, setSchedule);
    fetchSess(urlId);
    createDateArr();

    setConfReady(true);
    setSchedReady(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSuccess])


  return (
    <>
      {confReady === true &&
        presReady === true &&
        schedReady === true &&
        sessReady === true &&
        dateReady === true &&
        <Container>
          <Row>

            {!isAuthenticated &&
              <Row>
                <h1 className="regRemind">Please <Link to={window.location.origin} className="login" onClick={() => loginWithRedirect()}>log in</Link> to register for this conference.</h1>
              </Row>}

            {isAuthenticated
              ? <Col sm={4}>
                <UserCard />
              </Col>
              : <Col sm={2}></Col>}

            <Col sm={8}>
              <ConferenceCard
                conference={conference}
                setConference={setConference}
                setBtnName={setBtnName}
                setShowConfirm={setShowConfirm}
                setThisId={setThisId}
                setThisName={setThisName}
              />
            </Col>
          </Row>

          <Row>
            <Col sm={2} className="nomargin">
              <Sidenav
                conference={conference}
                showSuccess={showSuccess}
                setShowSuccess={setShowSuccess}
              />
            </Col>

            <Col sm={10}>
              <Row>
                <Col sm={12} className="myConfs formPad">
                  <h1>{conference[0].confName} Schedule</h1>
                </Col>
              </Row>

              {isAuthenticated &&
                (user.email === conference[0].ownerEmail || conference[0].confAdmins.includes(user.email)) &&
                <Row className="formPad">
                  <Col sm={10}>
                    <ScheduleForm
                      conference={conference}
                      schedule={schedule[0]}
                      urlid={urlId}
                      urltype={urlType}
                      showSuccess={showSuccess}
                      setShowSuccess={setShowSuccess}
                    />
                  </Col>
                </Row>
              }

              {schedule.length > 0
                ? <>
                  {dates.map((date, idx) => (
                    <React.Fragment key={idx}>
                      <Row className="formPad">
                        <h2 className="flexCenter"><Moment format="ddd, D MMM YYYY" withTitle>{date}</Moment></h2>
                      </Row>
                      <Row className="formPad">
                        <ScheduleGrid
                          schedule={schedule[0]}
                          sessions={sessions}
                          presenters={presenters}
                          conference={conference}
                          date={date}
                          setTime={setTime}
                          setThisDate={setThisDate}
                          setStartTime={setStartTime}
                          setEndTime={setEndTime}
                          setRoom={setRoom}
                          setThisSess={setThisSess}
                          setBtnName={setBtnName}
                          i={idx}
                          urlid={urlId}
                          urltype={urlType}
                          showSuccess={showSuccess}
                          setShowAssign={setShowAssign}
                          setShowDetails={setShowDetails}
                        />
                      </Row>
                    </React.Fragment>
                  ))}
                </>
                : <h3>We can't seem to find a schedule for this conference. If you think this is an error, please contact us.</h3>}

            </Col>
          </Row>

          {/* Information I need to lift:
            Button name
            Conference object
            Card object if different (session, etc.)
            */}

          {thisSess !== undefined &&
            <SessionModal
              allsess={sessions}
              session={thisSess}
              presenter={presenters}
              conference={conference}
              show={showDetails === true}
              hide={() => handleHideDetails()}
            />}

          <AssignModal
            allSess={sessions}
            conference={conference}
            room={room}
            startTime={startTime}
            endTime={endTime}
            date={thisDate}
            setThisSess={setThisSess}
            setBtnName={setBtnName}
            errThrown={errThrown}
            setErrThrown={setErrThrown}
            handleShowError={handleShowErr}
            handleShowSuccess={handleShowSuccess}
            show={showAssign === true}
            hide={() => handleHideAssign()}
            urlid={urlId}
            urltype={urlType}
          />

          <ConfirmModal
            btnname={btnName}
            confname={thisName}
            urlid={urlId}
            cancelconf={() => handleConfCancel(
              AttendeeAPI.getAttendees,
              ExhibitorAPI.getExhibitors,
              thisId,
              conference,
              handleHideConfirm,
              handleShowSuccess,
              setErrThrown,
              handleShowErr
            )}
            // cancelpres={() => handlePresInactive(
            //   thisId
            // )}
            // deletesess={() => handleSessDelete(
            //   thisId
            // )}
            unregatt={() => handleUnreg(
              AttendeeAPI.unregisterAttendee,
              thisId,
              user.email,
              handleHideConfirm,
              handleShowSuccess,
              setErrThrown,
              handleShowErr
            )}
            unregexh={() => handleUnreg(
              ExhibitorAPI.deleteExhibitor,
              thisId,
              user.email,
              handleHideConfirm,
              setErrThrown,
              handleShowErr
            )}
            show={showConfirm === true}
            hide={() => handleHideConfirm()}
          />

          <SuccessModal
            conference={conference}
            session={thisSess}
            confname={thisName}
            confid={urlId}
            urlid={urlId}
            urltype={urlType}
            btnname={btnName}
            show={showSuccess === true}
            hide={() => handleHideSuccess()}
          />

          <ErrorModal
            conference={conference[0]}
            session={thisSess}
            urlid={urlId}
            urltype={urlType}
            confname={conference[0].confName}
            errmsg={errThrown}
            btnname={btnName}
            show={showErr === true}
            hide={() => handleHideErr()}
          />

        </Container>}
    </>
  )
}

export default Schedule;