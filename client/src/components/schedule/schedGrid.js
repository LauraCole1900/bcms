import React from "react";

const SchedGrid = (props) => {


  return (
    <>
      {props.sessions.map(sess => {
        <tr key={sess._id}></tr>
      })
    }
    </>
  )

}

export default SchedGrid;