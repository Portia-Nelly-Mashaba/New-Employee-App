import React from 'react'
import { Link } from 'react-router-dom';


function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary shadow">
  <div className="container">
    <Link className="navbar-brand" to="/">eKasi Employee App</Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <Link className="nav-link active"  to="/home">Home</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/add">Add Employee</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/list">Employees</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/users">Users</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/">Login</Link>
        </li>
      </ul>
      
    </div>
  </div>
</nav>
    )
}

export default Navbar