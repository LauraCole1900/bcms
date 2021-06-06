import React from "react";

const SchedGrid = ({ schedule }) => {


  return (
    <>
      {schedule.map(sched => {
        <tr key={sched._id}>
          <td></td>
        </tr>
      })
    }
    </>
  )

}

export default SchedGrid;