import React from "react";

const SchedGrid = (props) => {


  return (
    <>
      {props.sessions.map(sess => {
        <tr key={sess._id}>
          <td></td>
        </tr>
      })
    }
    </>
  )

}

export default SchedGrid;