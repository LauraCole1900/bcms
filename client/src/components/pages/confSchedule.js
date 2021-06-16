import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Row, Col, Button, ButtonGroup, Table } from "react-bootstrap";
import Moment from "react-moment";
import { ConferenceCard, UserCard } from "../cards";
import { ScheduleForm } from "../forms";
import SchedGrid from "../table/schedGrid.js";
import { Sidenav } from "../navbar";
import { ConferenceAPI, PresenterAPI, ScheduleAPI, SessionAPI } from "../../utils/api";
import "./style.css";

const Schedule = () => {
  // Generates a table for each day of the conference - DONE
  // Room identifiers across the top - DONE
  // Times down the side - DONE
  // Cells populate from SessionAPI: session cards? Not sure
  // Sessions that take more than one room (keynote, etc) should stretch across those rooms
  // Sessions that take more than one time block (registration, etc.) should stretch across those times
  // Registration: need to figure out how to determine if timeblock is after start time and before end time to include in merge
  // User should be able to click on a table cell to edit that session
  // When editing, user is given a drop-down menu of sessions that already exist in the database?

  const { user, isAuthenticated } = useAuth0();
  const location = useLocation();
  const [conference, setConference] = useState();
  const [presenters, setPresenters] = useState();
  const [sessions, setSessions] = useState();
  const [schedule, setSchedule] = useState();
  const [dates, setDates] = useState([]);
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
  // 

  const fetchConf = async (id) => {
    return ConferenceAPI.getConferenceById(id)
      .then(resp => {
        console.log("from confSched fetchConf", resp.data)
        const confObj = resp.data;
        setConference(confObj)
        setConfReady(true);
        return confObj;
      })
      .catch(err => {
        console.log(err)
        return false
      })
  }

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

  const fetchSched = async (id) => {
    await ScheduleAPI.getScheduleByConfId(id)
      .then(resp => {
        console.log("from confSched fetchSched", resp.data)
        const schedObj = resp.data;
        setSchedule(schedObj)
        setSchedReady(true);
      })
      .catch(err => console.log(err));
  }

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
    let conf = await fetchConf(urlId);
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
            console.log({ dateArr });
            setDates(dateArr);
            setDateReady(true)
            return dateArr;
          }
        }
    }
  }

  useEffect(() => {
    fetchPres(urlId);
    fetchSched(urlId);
    fetchSess(urlId);
    createDateArr();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
    <>
      {confReady === true &&
        presReady === true &&
        schedReady === true &&
        sessReady === true &&
        dateReady === true &&
        <Container>
          <Row>
            {isAuthenticated
              ? <Col sm={4}>
                <UserCard />
              </Col>
              : <Col sm={2}></Col>}

            <Col sm={8}>
              <ConferenceCard conference={conference} />
            </Col>
          </Row>

          <Row>
            <Col sm={2} className="nomargin">
              <Sidenav conference={conference} />
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
                    <ScheduleForm conference={conference[0]} schedule={schedule[0]} urlid={urlId} urltype={urlType} />
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
                        <SchedGrid schedule={schedule[0]} sessions={sessions} presenters={presenters} conference={conference[0]} date={date} i={idx} />
                      </Row>
                    </React.Fragment>
                  ))}
                </>
                : <h3>We can't seem to find a schedule for this conference. If you think this is an error, please contact us.</h3>}

            </Col>
          </Row>

        </Container>}
    </>
  )
}

export default Schedule;