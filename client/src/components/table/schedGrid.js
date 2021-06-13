import React from "react";
import { Table } from "react-bootstrap";
import { SchedSessCard } from "../cards";
import "./style.css";

const SchedGrid = (props) => {
  let thisSess;
  // Map over rooms and times to create headers
  // Map over sessions for each table cell
  // session.sessDate === dataset.date &&
  // session.sessRoom === dataset.room &&
  // (session.sessStart === dataset.starttime || session.sessEnd === dataset.endtime)
  // Assign that session to that table cell
  // Merge cells if a single session takes up multiple adjacent cells

  // Assign by click:
  // onClick, list of sessions comes up
  // Choose session
  // On selection, session.sessRoom, session.sessStart and session.sessEnd update in database
  // Need to parse times?

  const splitTimes = (times) => {
    const timesArr = times.split("-")
    return timesArr;
  }

  // Parses time to 12-hour
  const parseTime = (time) => {
    const timeArr = time.split(":");
    let hours = timeArr[0];
    let minutes = timeArr[1];
    const ampm = hours >= 12 ? "pm" : "am"
    hours = hours % 12;
    hours = hours ? hours : 12
    minutes = minutes < 10 ? "0" + minutes.slice(-1) : minutes;
    const timeStr = `${hours}:${minutes}${ampm}`
    return timeStr
  };

  const sessShow = (sess) => {
    const sessionStart = parseTime(sess.sessStart)
    const sessionEnd = parseTime(sess.sessEnd)
    const td = document.body.getElementsByTagName("td");
    console.log({ td })
    const date = this.parentNode.getAttribute("data-date").value;
    console.log({ date });
    // const thisSess = sess.filter(sess => (
    //   sess.sessDate === Element.parentNode.dataset.date &&
    //   sess.sessRoom === Element.parentNode.dataset.room &&
    //   (sessionStart === Element.parentNode.dataset.starttime || sessionEnd === Element.parentNode.dataset.endtime)
    // ))
    // console.log(thisSess);
    // return thisSess;
  }

  const sessAssign = (e) => {
    const { name, value, dataset } = e.target;

  }


  return (
    <>
      <Table striped border="true" hover responsive>
        <thead>
          <tr>
            <th className="schHead"></th>
            {props.schedule.schedRooms.map((room, roomidx) => (
              <th key={roomidx} value={room.value} className="schHead center">{room}</th>))}
          </tr>
        </thead>
        <tbody>
          {props.schedule.schedTimes.map((time, timeidx) => (
            <tr key={timeidx}>
              <th className="schHead center" value={time.value}>{time}</th>
              {props.schedule.schedRooms.map((room, roomdataidx) => (
                <td key={roomdataidx} className="schedCells" data-room={room} data-starttime={splitTimes(time)[0]} data-endtime={splitTimes(time)[1]} data-date={props.dates[props.i]}>
                  {/* <SchedSessCard session={props.sessions} presenter={props.presenter} /> */}
                </td>))}
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )

}

export default SchedGrid;