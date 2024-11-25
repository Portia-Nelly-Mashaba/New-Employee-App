import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  // State variables for form fields and response
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Default role
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send POST request to register endpoint
      const response = await axios.post("http://localhost:8001/register", {
        email,
        password,
        role,
      });

      // Update message state with success response
      setMessage(`User registered successfully! Role: ${response.data.role}`);
      navigate('/home')
    } catch (error) {
      // Update message state with error response
      setMessage(
        error.response?.data?.message || "An error occurred during registration."
      );
    }
  };

  return (
    <section
      className="vh-100 d-flex align-items-center"
      style={{ backgroundColor: "#ffffff" }}
    >
      <div className="container h-100">
        <div className="row justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card rounded-3 shadow-sm">
              <div className="card-body p-5">
                <h2 className="text-center mb-4">Create Account</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-info text-white">
                    Register
                  </button>
                </form>
                {/* Message Display */}
                {message && (
                  <div className="mt-4 alert alert-info text-center">
                    {message}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
