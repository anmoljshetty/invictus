import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
// Assuming you have utility functions for handling success/error messages
import { handleError, handleSuccess } from "../utils"; 
import '../Auth.css'; // Uses the split-screen, dark theme CSS

function Signup() {
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  
  // Handles input changes and updates component state
  const handleChange = (e) => {
    const { name, value } = e.target;
    const copySignupInfo = { ...signupInfo };
    copySignupInfo[name] = value;
    setSignupInfo(copySignupInfo);
  };

  // Handles form submission and API call
  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password } = signupInfo;
    
    if (!name || !email || !password) {
      return handleError("name, email and password are required");
    }
    
    try {
      const url = `https://invictus-api.vercel.app/auth/signup`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupInfo),
      });
      
      const result = await response.json();
      const { success, message, error } = result;
      
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else if (error) {
        // Handle validation errors from backend (e.g., Joi validation)
        const details = error?.details[0].message;
        handleError(details);
      } else if (!success) {
        // Handle general errors (e.g., user already exists)
        handleError(message);
      }
    } catch (err) {
      handleError("Network error: Could not reach the server.");
    }
  };
  
  return (
    <div className="auth-page">
      {/* LEFT HALF: Image Container (Styled in Auth.css) */}
      <div className="auth-image-container"></div>
      
      {/* RIGHT HALF: Form Container (Styled in Auth.css) */}
      <div className="auth-form-container">
        <h1>Signup</h1>
        <form onSubmit={handleSignup}>
          <div>
            <label htmlFor="name">Name</label>
            <input
              onChange={handleChange}
              type="text"
              name="name"
              autoFocus
              value={signupInfo.name}
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              onChange={handleChange}
              type="email"
              name="email"
              value={signupInfo.email}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              onChange={handleChange}
              type="password"
              name="password"
              value={signupInfo.password}
            />
          </div>
          <button type="submit">Signup</button>
          <span>
            Already have an account ?<Link to="/login">Login</Link>
          </span>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Signup;