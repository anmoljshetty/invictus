// LogoCarousel.jsx

import React from 'react';
import './Home.css'; // Uses the same CSS file for animation styles
import logo1 from "../assets/logo1.jpg"
import logo2 from "../assets/logo2.jpg"
import logo3 from "../assets/logo3.jpg"
import logo4 from "../assets/logo4.jpg"
import logo5 from "../assets/logo5.jpeg"
import logo6 from "../assets/logo6.jpeg"
import logo7 from "../assets/logo7.jpg"

// Dummy list of 7 logo paths (Assume these are in your /public/assets folder)
const logos = [
    logo1, 
    logo2, 
    logo3, 
    logo4, 
    logo5, 
    logo6, 
    logo7,
];

function LogoCarousel() {
    // To create the infinite loop effect, we duplicate the logos.
    const duplicatedLogos = [...logos, ...logos];

    return (
        <div className="logo-carousel-container">
            <div className="logo-carousel-track">
                {duplicatedLogos.map((src, index) => (
                    // Use index + 1 to keep keys unique for the duplicated items
                    <div className="logo-slide" key={index}>
                        <img src={src} alt={`Partner Logo ${index % logos.length + 1}`} className="partner-logo" style={{height: "20px"}}/>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LogoCarousel;