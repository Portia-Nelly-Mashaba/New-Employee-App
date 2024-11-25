import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Create = () => {
  const [array, setArray] = useState([]);
  const [inputdata, setInputdata] = useState({
    firstname: '',
    lastName: '',
    identity: '',
    email: '',
    address: '',
    age: '',
    position: '',
    image: null,
  });

  // Fetch existing employees to get the next ID
  useEffect(() => {
    fetch('http://localhost:8001/employees')
      .then((res) => res.json())
      .then((data) => {
        setArray(data);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  // Update state for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputdata({ ...inputdata, [name]: value });
  };

  // Handle file upload and convert to Base64
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInputdata({ ...inputdata, image: reader.result }); // Store Base64
      };
      reader.readAsDataURL(file); // Convert to Base64
    }
  };

  // Add new employee
  const addInputdata = (e) => {
    e.preventDefault();

    const newEmployee = {
        firstname: inputdata.firstname,
      lastName: inputdata.lastName,
      identity: inputdata.identity,
      email: inputdata.email,
      address: inputdata.address,
      age: inputdata.age,
      position: inputdata.position,
      image: inputdata.image,
    };

    fetch('http://localhost:8001/employees', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newEmployee),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to add employee.');
        }
        return res.json();
      })
      .then((createdEmployee) => {
        setArray((prevArray) => [...prevArray, createdEmployee]);
        // Clear form fields
        setInputdata({
            firstname: '',
          lastName: '',
          identity: '',
          email: '',
          address: '',
          age: '',
          position: '',
          image: null,
        });
        console.log('Employee added successfully:', createdEmployee);
      })
      .catch((error) => console.error('Error adding employee:', error));
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="card col-md-10 col-lg-8">
          <div className="card-header">
            <h4>New Employee Registration Form</h4>
          </div>
          <form className="row g-3 mt-3" onSubmit={addInputdata}>
            <div className="col-6">
              <input
                name="firstName"
                type="text"
                value={inputdata.firstname}
                className="form-control"
                placeholder="Enter First Name"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-6">
              <input
                name="lastName"
                type="text"
                value={inputdata.lastName}
                className="form-control"
                placeholder="Enter Last Name"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-6">
              <input
                name="identity"
                type="number"
                value={inputdata.identity}
                className="form-control"
                placeholder="Enter Identity Number"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-6">
              <input
                name="email"
                type="email"
                value={inputdata.email}
                className="form-control"
                placeholder="Enter Email Address"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-2">
              <input
                name="age"
                type="number"
                value={inputdata.age}
                className="form-control"
                placeholder="Enter Age"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-10">
              <input
                name="address"
                type="text"
                value={inputdata.address}
                className="form-control"
                placeholder="Enter Address"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-6">
              <select
                name="position"
                className="form-select"
                value={inputdata.position}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Position</option>
                <option value="Manager">Manager</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Junior Developer">Junior Developer</option>
                <option value="Senior Developer">Senior Developer</option>
              </select>
            </div>
            <div className="col-md-6">
              <input
                name="image"
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            <div className="col-12 mb-3 mt-5">
              <button type="submit" className="btn btn-primary me-3">
                Save [+]
              </button>
              <Link to="/home" className="btn btn-dark">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Create;
