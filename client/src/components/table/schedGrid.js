import React from "react";
import Moment from "react-moment";
import { Row, Col, Button, ButtonGroup, Table } from "react-bootstrap";

const SchedGrid = (props) => {


  return (
    <>
      {props.schedule.schedRooms.map((sched, idx) => (
        <>
          <tr key={idx}>
            <th></th>

          </tr>
        </>
      ))
      }
    </>
  )

}

export default SchedGrid;