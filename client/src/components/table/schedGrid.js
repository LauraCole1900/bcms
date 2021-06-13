import React from "react";
import { Table } from "react-bootstrap";

const SchedGrid = (props) => {
  // Map over rooms and times to create headers
  // Map over sessions for each table cell
  // session.sessDate === dataset.date &&
  // (session.sessStart === dataset.startTime || session.sessEnd === dataset.endTime) &&
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

  const sessAssign = (e) => {
    const { name, value, dataset } = e.target;

  }


  return (
    <>
      <Table striped border="true" hover responsive>
        <thead>
          <tr>
            <th className="schHead"></th>
            {props.schedule.schedRooms.map((room, ridx) => (
              <th key={ridx} value={room.value} className="schHead center">{room}</th>))}
          </tr>
        </thead>
        <tbody>
          {props.schedule.schedTimes.map((time, tidx) => (
            <tr key={tidx}>
              <th className="schHead center" value={time.value}>{time}</th>
              {props.schedule.schedRooms.map((room, rdidx) => (
                <td key={rdidx} data-room={room} data-startTime={splitTimes(time)[0]} data-endTime={splitTimes(time)[1]} data-date={props.dates[props.i]}></td>))}
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )

}

export default SchedGrid;