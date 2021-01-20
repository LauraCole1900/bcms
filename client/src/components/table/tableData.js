import React from "react";
import "./style.css";

const TableData = (data) => {
  return (
    <>
      {data.map(e => {
        <tr key={e._id}>
          <td>e.</td>
        </tr>
      })
      }
    </>
  )
}

function TableData(props) {
  return (
    <tbody>
      {props.employeesArr.map(employee => (
        <tr key={employee.id}>
          <td>{employee.id}</td>
          <td>{employee.lastName}, {employee.firstName}</td>
          <td>{employee.role}</td>
          <td>{employee.department}</td>
          <td>{employee.phone}</td>
          <td>{employee.email}</td>
          <td>{employee.hireDate}</td>
        </tr>
      ))}
    </tbody>
  )
}