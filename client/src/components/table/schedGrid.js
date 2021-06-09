import React from "react";
import { Row, Col, Button, ButtonGroup, Table } from "react-bootstrap";

const SchedGrid = (props) => {

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
                <td key={rdidx} data-room={room} data-time={time}></td>))}
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )

}

export default SchedGrid;