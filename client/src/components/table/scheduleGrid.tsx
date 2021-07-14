import React, { ReactElement } from "react";
import { Table } from "react-bootstrap";
import { SchedSessCard } from "../cards";
import { handleParseTime } from "../../utils/functions";
import { Session } from "../../utils/interfaces";
import "./style.css";

const ScheduleGrid = (props: any): ReactElement => {
  let thisSess: Array<Session>;
  let timesArr: Array<string>;

  const splitTimes = (times: string): Array<string> => {
    timesArr = times.split("-")
    return timesArr;
  }

  const filterSess = (sess: Array<Session>, room: string, time: string) => {
    const scheduleDate: string = props.date;
    const scheduleStart: string = splitTimes(time)[0];
    const scheduleEnd: string = splitTimes(time)[1];
    thisSess = sess.filter((sess: Session) => (
      sess.sessDate === scheduleDate &&
      sess.sessRoom === room &&
      (handleParseTime(sess.sessStart) === scheduleStart || handleParseTime(sess.sessEnd) === scheduleEnd)
    ))
    return thisSess;
  }


  return (
    <>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th className="schHead"></th>
            {props.schedule.schedRooms.map((room: string, roomidx: number) => (
              <th key={roomidx} className="schHead center">{room}</th>))}
          </tr>
        </thead>
        <tbody>
          {props.schedule.schedTimes.map((time: string, timeidx: number) => (
            <tr key={timeidx}>
              <th className="schHead center">{time}</th>
              {props.schedule.schedRooms.map((room: string, roomdataidx: number) => (
                <td key={roomdataidx} className="schedCells center">
                  <SchedSessCard
                    session={filterSess(props.sessions, room, time)}
                    presenters={props.presenters}
                    conference={props.conference}
                    room={room}
                    time={time}
                    startTime={timesArr[0]}
                    endTime={timesArr[1]}
                    date={props.date}
                    setRoom={props.setRoom}
                    setTime={props.setTime}
                    setStartTime={props.setStartTime}
                    setEndTime={props.setEndTime}
                    setThisDate={props.setThisDate}
                    setBtnName={props.setBtnName}
                    setThisSess={props.setThisSess}
                    setShowAssign={props.setShowAssign}
                    setShowDetails={props.setShowDetails}
                  />
                </td>
              ))}
              <th className="schHead center">{time}</th>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )

}

export default ScheduleGrid;