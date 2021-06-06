import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Row, Col, Button, ButtonGroup, Table } from "react-bootstrap";
import { ConferenceCard, UserCard } from "../cards";
import { ScheduleForm } from "../forms";
import SchedGrid from "../table/schedGrid.js";
import { ConferenceAPI, PresenterAPI, ScheduleAPI, SessionAPI } from "../../utils/api";
import "./style.css";

const Schedule = () => {
  // Generates a table for each day of the conference
  // Room identifiers across the top
  // Times down the side
  // Cells populate from SessionAPI: session cards? Not sure
  // Sessions that take more than one room (keynote, etc) should stretch across those rooms
  // User should be able to click on a table cell to edit that session
  // When editing, user is given a drop-down menu of sessions that already exist in the database?

  const { user, isAuthenticated } = useAuth0();
  const location = useLocation();
  const [conference, setConference] = useState();
  const [schedule, setSchedule] = useState();
  const [confReady, setConfReady] = useState(false);
  const [schedReady, setSchedReady] = useState(false);
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

  // Creates array of dates to match to schedule grids
  const createDateArr = async () => {
    let conf = await fetchConf(urlId);
    if (conf[0].numDays > 1) {
      for (var i = 0; i < conf[0].numDays; i++) {
        let thisDate = conf[0].startDate;
        let thisDateArr = thisDate.split("-");
        let day = JSON.parse(thisDateArr[2])
        day = day + i
        thisDateArr = thisDateArr.slice(0, 2).concat(JSON.stringify(day)).join("-");
        dateArr.push(thisDateArr);
        console.log(dateArr);
      }
    } else {
      dateArr.push(conf[0].startDate);
      console.log(dateArr);
    }
  }

  useEffect(() => {
    // fetchConf(urlId);
    fetchSched(urlId);
    createDateArr();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
    <>
      {confReady === true &&
        schedReady === true &&
        <Container>
          <Row>
            {isAuthenticated &&
              <Col sm={8}>
                <UserCard />
              </Col>}
          </Row>
          <Row>
            <Col sm={12}>
              <ConferenceCard conference={conference} />
            </Col>
          </Row>

          <Row>
            <Col sm={4}>
              <ButtonGroup data-toggle="popover">
                <Link to={`/details/${urlId}`} className={location.pathname === `/details/${urlId}` ? "link active" : "link"}>
                  <Button title="View details" className="button">Details</Button>
                </Link>
                <Link to={`/venue/${urlId}`} className={location.pathname === `/venue/${urlId}` ? "link active" : "link"}>
                  <Button title="Venue information" className="button">Venue</Button>
                </Link>
                <Link to={`/exhibits/${urlId}`} className={location.pathname === `/exhibits/${urlId}` ? "link active" : "link"}>
                  <Button title="Exhibit information" className="button">Exhibits</Button>
                </Link>
              </ButtonGroup>
            </Col>
          </Row>

          <Row>
            <Col sm={12} className="myConfs">
              <h1>{conference[0].confName} Schedule</h1>
            </Col>
          </Row>

          {isAuthenticated &&
            (user.email === conference[0].ownerEmail || conference[0].confAdmins.includes(user.email)) &&
            <Row>
              <ScheduleForm conference={conference[0]} schedule={schedule[0]} urlid={urlId} urltype={urlType} />
            </Row>
          }

          {/* <Row>
            <SchedGrid striped border="true" hover responsive schedule={schedule[0]} />
          </Row> */}
        </Container>}
    </>
  )
}

export default Schedule;