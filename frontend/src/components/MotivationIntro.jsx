// MotivationIntro.jsx
import "./MotivationIntro.css";

function MotivationIntro({ message, image, direction}) {
    let fade = direction == "right" ? "left" : "right";
    const bgStyle = {
        backgroundImage: `
            linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.9)), 
            linear-gradient(to ${fade}, rgba(0, 0, 0, 1) 0%, transparent 100%), 
            url(${image})
            `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "grayscale(100%)",
        WebkitFilter: "grayscale(100%)",
    };
    return (
        <>
            {/* 🔥 FIX 1: Removed the empty <img /> tag entirely */}
            <section style={bgStyle} className={direction} >
                <p className="quote">‘‘{message}’’</p>
            </section>
        </>
    );
}
export default MotivationIntro;