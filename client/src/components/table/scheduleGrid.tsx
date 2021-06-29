import React, { ReactElement } from "react";
import { Table } from "react-bootstrap";
import { SchedSessCard } from "../cards";
import "./style.css";

interface Session {
  confId: string,
  sessName: string,
  sessPresEmails: string[],
  sessDate: string,
  sessStart: string,
  sessEnd: string,
  sessDesc: string,
  sessEquipConfirm: string,
  sessEquipProvide: string,
  sessEquip: string[],
  sessKeynote: string,
  sessPanel: string,
  sessRoom: string,
  sessAccepted: string,
  _id: string
}

const ScheduleGrid = (props: any): ReactElement => {
  let thisSess: Session[];
  let timesArr: string[];

  const splitTimes = (times: string): string[] => {
    timesArr = times.split("-")
    return timesArr;
  }

  // Parses time to 12-hour
  const parseTime = (time: any): string | void => {
    const timeArr: [number, string] = time.split(":");
    let hours: number = timeArr[0];
    let minutes: any = timeArr[1];
    const ampm: string = hours >= 12 ? "pm" : "am"
    hours = hours % 12;
    hours = hours ? hours : 12
    minutes = minutes < 10 ? "0" + minutes.slice(-1) : minutes;
    const timeStr: string = `${hours}:${minutes}${ampm}`
    return timeStr
  };

  const filterSess = (sess: Session[], room: string, time: string) => {
    const scheduleDate: string = props.date;
    const scheduleStart: string = splitTimes(time)[0];
    const scheduleEnd: string = splitTimes(time)[1];
    thisSess = sess.filter((sess: Session) => (
      sess.sessDate === scheduleDate &&
      sess.sessRoom === room &&
      (parseTime(sess.sessStart) === scheduleStart || parseTime(sess.sessEnd) === scheduleEnd)
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
                  <SchedSessCard session={filterSess(props.sessions, room, time)} allSess={props.sessions} presenters={props.presenters} conference={props.conference} room={room} time={time} startTime={timesArr[0]} endTime={timesArr[1]} date={props.date} urlid={props.urlid} urltype={props.urltype} showSuccess={props.showSuccess} setShowSuccess={props.setShowSuccess} />
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