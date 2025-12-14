// Home.jsx (UPDATED)

import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { handleError, handleSuccess } from "../utils";
import { ToastContainer } from "react-toastify";
import shoeVideo from "../assets/shoe-video.mp4";
import Motivation from "../components/MotivationIntro";
import Ronaldo from "./ronaldo.jpg";
import Kohli from "./Kohli.png";
import "./Home.css";
import LogoCarousel from "./LogoCarousel"; // <-- NEW IMPORT

function Home() {
  // FIX: Added useState back if it was missing
  const [loggedInUser, setLoggedInUser] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoggedInUser(localStorage.getItem("loggedInUser"));
  }, []);

  const handleLogout = (e) => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    handleSuccess("User Loggedout");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  return (
    <>
      <div className="home-container">
        {/* Navigation */}
        <nav className="navbar">
          <span className="mainLogo">INVICTUS</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </nav>

        {/* Welcome Section (with expanded text) */}
        <section className="welcome-section">
          <h1 className="welcome-title">
            Welcome, {loggedInUser}! Step Into Excellence.
          </h1>
          <div className="buildup-container">
            <p className="buildup">
              You are witnessing the digital headquarters of one of the premier athletic footwear suppliers on the planet earth. We believe that peak performance starts from the ground up. At INVICTUS, we don't just sell sneakers; we engineer collections that embody the ultimate fusion of aerodynamic design, explosive energy return, and rugged durability. From lightweight trainers for the marathon track to high-traction gear for the rugged trail, every pair fuels a legacy of champions. Scroll down to ignite the revolution in your training and find the perfect pair that powers your next victory.
            </p>
          </div>
        </section>

        {/* 🔥 NEW CAROUSEL SECTION 🔥 */}
        <LogoCarousel />
        <h1 className="Announce">LOOK WHAT OUR AMBASSADORS GOT TO SAY</h1>
        <div className="wrapper">
          <Motivation
            message="Talent without working hard is nothing"
            image={Ronaldo}
            direction="right"
          />
          <Motivation
            message="Whatever you want to do, do with full passion, and work really hard towards it."
            image={Kohli}
            direction="left"
          />
          <Motivation
            message="I feel like people are expecting me to fail, therefore, I expect myself to win."
            image="https://d3cm515ijfiu6w.cloudfront.net/wp-content/uploads/2023/06/05122007/lewis-hamilton-smiling-cap-planetf1.jpg"
            direction="right"
          />
          <Motivation
            message="Krishna Ronaldo is my sporting idol"
            image="https://images.news18.com/ibnlive/uploads/2025/05/Neeraj-Chopra-NC-Classic-2025-2025-05-cb9fb2b95eabb95f91777408118138e7.jpg"
            direction="left"
          ></Motivation>
        </div>

        {/* Video Section with Background */}
        <section className="video-section">
          <div className="video-background">
            <video autoPlay loop muted playsInline className="background-video">
              <source src={shoeVideo} type="video/mp4" />
            </video>
            <div className="video-overlay"></div>
          </div>
          <div className="video-content">
            <button className="view-products-btn">
              <Link to="/products">View our products</Link>
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <p>&copy; <small>2025 <span className="footer-logo">INVICTUS</span>. All rights reserved.</small></p>
        </footer>
      </div>
      <ToastContainer />
    </>
  );
}

export default Home;
