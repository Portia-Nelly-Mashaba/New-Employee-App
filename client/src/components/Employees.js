import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Employees = () => {
  const [employees, setEmployees] = useState([]);

  // Fetch employees on component mount
  useEffect(() => {
    fetch("http://localhost:8001/employees")
      .then((res) => res.json())
      .then((data) => {
        setEmployees(data); // Set fetched employees to state
      })
      .catch((error) => console.error("Error fetching employees:", error));
  }, []);

  // Delete an employee by ID
  const deleteEmployee = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      fetch(`http://localhost:8001/delete-employees/${id}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to delete employee.");
          }
          // Remove deleted employee from state
          setEmployees((prevEmployees) =>
            prevEmployees.filter((employee) => employee.id !== id)
          );
          alert("Employee deleted successfully!");
        })
        .catch((error) => {
          console.error("Error deleting employee:", error);
          alert("Failed to delete the employee. Please try again.");
        });
    }
  };

  // Render the table with employees
  return (
    <div className="container mt-5">
      <div style={{ textAlign: "right" }}>
        <Link to="/add" className="btn btn-info mb-3" style={{ color: "white" }}>
          Add Data
        </Link>
      </div>
      <table className="table table-bordered" style={{ tableLayout: "fixed" }}>
        <thead className="table-dark">
          <tr>
            <th scope="col" style={{ width: "5%" }}>#</th>
            <th scope="col">Name</th>
            <th scope="col">Surname</th>
            <th scope="col" style={{ width: "5%" }}>Age</th>
            <th scope="col">ID No</th>
            <th scope="col">Email</th>
            <th scope="col">Position</th>
            <th scope="col">Photo</th>
            <th scope="col" style={{ width: "10%" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map((employee, index) => (
              <tr key={employee.id || index}>
                <th scope="row">{index + 1}</th>
                <td>{employee.firstName}</td>
                <td>{employee.lastName}</td>
                <td>{employee.age}</td>
                <td>{employee.identity}</td>
                <td>{employee.email}</td>
                <td>{employee.position}</td>
                <td>
                  {employee.image ? (
                    <img
                      src={employee.image}
                      alt={`${employee.firstName}'s profile`}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    "No Photo"
                  )}
                </td>
                <td className="d-flex justify-content-center">
                  {/* Edit button */}
                  <button className="btn btn-info me-2" style={{ color: "white" }}>
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                  {/* Delete button */}
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteEmployee(employee.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center">
                No employees found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Employees;
