import React from "react";
import "./style.css";

const AttendeeTable = (data) => {
  return (
    <>
      {data.map(e => {
        <tr key={e._id}>
          <td>{e.familyName} + {e.givenName}</td>
          <td>{e.email}</td>
          <td>{e.phone}</td>
          <td>{e.employerName}</td>
          <td>{e.emergencyContactName}</td>
          <td>{e.emergencyContactPhone}</td>
          <td>{e.allergies}</td>
          <td>{e.isAdmin}</td>
        </tr>
      })
      }
    </>
  )
}

export default AttendeeTable;

// function TableData(props) {
//   return (
//     <tbody>
//       {props.employeesArr.map(employee => (
//         <tr key={employee.id}>
//           <td>{employee.id}</td>
//           <td>{employee.lastName}, {employee.firstName}</td>
//           <td>{employee.role}</td>
//           <td>{employee.department}</td>
//           <td>{employee.phone}</td>
//           <td>{employee.email}</td>
//           <td>{employee.hireDate}</td>
//         </tr>
//       ))}
//     </tbody>
//   )
// }