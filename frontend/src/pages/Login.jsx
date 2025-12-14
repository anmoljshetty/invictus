import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
// Assuming you have utility functions for handling success/error messages
import { handleError, handleSuccess } from "../utils";
import '../Auth.css'; // Uses the split-screen, dark theme CSS

function Login() {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  // Handles input changes and updates component state
  const handleChange = (e) => {
    const { name, value } = e.target;
    const copyLoginInfo = { ...loginInfo };
    copyLoginInfo[name] = value;
    setLoginInfo(copyLoginInfo);
  };

  // Handles form submission and API call
  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;
    
    if (!email || !password) {
      return handleError("email and password are required");
    }
    
    try {
      const url = `https://invictus-api.vercel.app/auth/login`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginInfo),
      });
      
      const result = await response.json();
      const { success, message, jwtToken, name, error } = result;
      
      if (success) {
        handleSuccess(message);
        // Store token and user name locally for session management
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("loggedInUser", name);
        
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } else if (error) {
        // Handle validation errors
        const details = error?.details[0].message;
        handleError(details);
      } else if (!success) {
        // Handle general errors (e.g., incorrect password)
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
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              onChange={handleChange}
              type="email"
              name="email"
              value={loginInfo.email}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              onChange={handleChange}
              type="password"
              name="password"
              value={loginInfo.password}
            />
          </div>
          <button type="submit">Login</button>
          <span>
            Doesn't have an account ?<Link to="/signup">Signup</Link>
          </span>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Login;