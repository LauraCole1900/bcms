import React from "react";
import Moment from "react-moment";
import { Row, Col, Button, ButtonGroup, Table } from "react-bootstrap";

const SchedGrid = (props) => {


  return (
    <>
      <Table striped border="true" hover responsive>
        <tr>
          <th className="schHead"></th>
          {props.schedule.schedRooms.map((room, ridx) => (
            <th key={ridx} value={room.value} className="schHead center">{room}</th>))}
        </tr>
        {props.schedule.schedTimes.map((time, tidx) => (
          <tr key={tidx}>
            <th className="schHead center" value={time.value}>{time}</th>
            {props.schedule.schedRooms.map((room, rdidx) => (
              <td data-room={room} data-time={time}></td>))}
          </tr>
        ))}
      </Table>
    </>
  )

}

export default SchedGrid;