import React from 'react'

import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Employee Management System</h3>
            </div>
            <div className="card-body">
              <p>Welcome to the Employee Management System. Manage your employees efficiently.</p>
              <div className="row">
                <div className="col-md-6">
                  <Link to="/list" className="btn btn-primary btn-lg w-100 mb-3">View Employees</Link>
                </div>
                <div className="col-md-6">
                  <Link to="/add" className="btn btn-success btn-lg w-100 mb-3">Add New Employee</Link>
                </div>
              </div>
              <p>You can perform various operations such as adding, editing, and deleting employees.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
