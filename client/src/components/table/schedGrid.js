import React from "react";
import Moment from "react-moment";
import { Row, Col, Button, ButtonGroup, Table } from "react-bootstrap";

const SchedGrid = (props) => {


  return (
    <>
      {props.schedule.map((sched, idx) => (
        <>
          <tr key={idx}>
            <th></th>
            {sched.schedRooms.map((room, ridx) => (
              <th key={ridx} value={room.value} className="tHead" scope="column">{room}</th>
            ))}
          </tr>
        </>
      ))
      }
    </>
  )

}

export default SchedGrid;