import React from "react";
import { Table } from "react-bootstrap";
import { SchedSessCard } from "../cards";
import "./style.css";

const SchedGrid = (props) => {
  let thisSess;
  // Map over rooms and times to create headers
  // Map over sessions for each table cell
  // session.sessDate === dataset.date &&
  // (session.sessStart === dataset.starttime || session.sessEnd === dataset.endtime) &&
  // session.sessRoom === dataset.room
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

  const sessShow = (sess) => {
    const td = document.body.getElementsByTagName("td");
    console.log({ td })
    const date = this.parentNode.getAttribute("data-date").value;
    console.log({ date });
    // const thisSess = sess.filter(sess => (
    //   sess.sessDate === Element.parentNode.dataset.date &&
    //   sess.sessRoom === Element.parentNode.dataset.room &&
    //   (sess.sessStart === Element.parentNode.dataset.starttime || sess.sessEnd === Element.parentNode.dataset.endtime)
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