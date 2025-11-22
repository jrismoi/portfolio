// src/App.jsx
import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "./Navbar";
import ProjectCard from "./ProjectCard";
import Skills from "./Skills";
import Resume from "./Resume";
import Contact from "./Contact";
import BackgroundCanvas from "./BackgroundCanvas";
import "./App.css";

function App() {
  const { scrollYProgress } = useScroll();
  const name = "Miguel Orellana";
  const letters = Array.from(name);

  // Randomized letter transforms
  const letterTransforms = letters.map(() => {
    const randomX = Math.random() * 200 - 100;
    const randomY = Math.random() * 200 - 100;
    const randomRotate = Math.random() * 120 - 60;
    return { randomX, randomY, randomRotate };
  });

  const xTransforms = letterTransforms.map((t) =>
    useTransform(scrollYProgress, [0, 0.4], [0, t.randomX])
  );
  const yTransforms = letterTransforms.map((t) =>
    useTransform(scrollYProgress, [0, 0.4], [0, t.randomY])
  );
  const rotateTransforms = letterTransforms.map((t) =>
    useTransform(scrollYProgress, [0, 0.4], [0, t.randomRotate])
  );
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  // Project data
  const projects = [
    {
      videoSrc: `${import.meta.env.BASE_URL}videos/game-vid.mp4`,
      title: "8-bit Music Game",
      description:
        "An 8-bit retro game testing whether absolute pitch can be 'trained.' Players match musical pitches to screen positions. Built with JavaScript and live servers.",
    },
    {
      videoSrc: `${import.meta.env.BASE_URL}videos/vr-proj.mp4`,
      title: "VR Scuba Simulator",
      description: "Built in Unity. Has plenty of features such as menu that gets brought up with hand signals. Features such as arrow with navigation showing up in user interface and a keyboard to 'call' crewmates.",
    },
    {
      videoSrc: `${import.meta.env.BASE_URL}videos/app-vid.mp4`,
      title: "Robust Gesture iOS App",
      description:
        "An iPhone app comparing shake and tilt gesture robustness. Outputs accelerometer and gyroscope data as CSV. Built with Swift and SwiftUI.",
    },
    {
      videoSrc: `${import.meta.env.BASE_URL}videos/calculator.mp4`,
      title: "Calculator App",
      description: "A simple, responsive calculator app for desktop and mobile devices.",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(1);
  const nextProject = () => setCurrentIndex((prev) => (prev + 1) % projects.length);
  const prevProject = () => setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);

  return (
    <div className="container">
      <BackgroundCanvas />
      <Navbar />

      {/* Intro */}
      <section className="intro" id="intro">
        <h1 className="intro-line white-text">Hello, my name is</h1>
        <h1 className="intro-line green-text">
          {letters.map((char, i) => (
            <motion.span
                key={i}
                style={{
                display: "inline-block",
                x: xTransforms[i],
                y: yTransforms[i],
                rotate: rotateTransforms[i],
                opacity,
                }}
                className={char === " " ? "space" : ""}
            >
                {char === " " ? "\u00A0" : char} {/* non-breaking space */}
            </motion.span>
            ))}
        </h1>
        <motion.div
          className="scroll-indicator"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          ⬇
        </motion.div>
      </section>

      {/* About */}
      <section className="about" id="about">
        <h2>About Me</h2>
        <p>
          I am a fourth-year at the University of Chicago pursuing Computer Science and Cognitive
          Science, passionate about UI/UX design and creative interactive systems. Here's what I've
          worked on!
        </p>
      </section>

      {/* Projects */}
      <section className="projects" id="projects">
        <h2>Projects</h2>
        <div className="project-carousel">
          <button className="nav-button left" onClick={prevProject}>
            ←
          </button>

          <div className="carousel-track">
            {projects.map((project, index) => {
              const offset = index - currentIndex;
              const isActive = offset === 0;
              
              // Show cards in range: left (-1), center (0), right (1)
              // Also handle wrapping for infinite scroll effect
              let displayOffset = offset;
              
              // Wrap around logic for seamless infinite scroll
              if (offset < -1) {
                displayOffset = offset + projects.length;
              } else if (offset > 1) {
                displayOffset = offset - projects.length;
              }
              
              const isVisible = Math.abs(displayOffset) <= 1;
              
              const style = {
                transform: `translateX(${displayOffset * 420}px) scale(${isActive ? 1 : 0.85})`,
                opacity: isActive ? 1 : 0.5,
                zIndex: isActive ? 10 : 1,
                pointerEvents: isActive ? 'auto' : 'none',
              };

              return (
                <motion.div
                  key={index}
                  className="carousel-item"
                  animate={style}
                  transition={{ type: "spring", stiffness: 70, damping: 20 }}
                  style={{ display: isVisible ? 'block' : 'none' }}
                >
                  <ProjectCard
                    videoSrc={project.videoSrc}
                    title={project.title}
                    description={project.description}
                  />
                </motion.div>
              );
            })}
          </div>

          <button className="nav-button right" onClick={nextProject}>
            →
          </button>
        </div>
      </section>

      <Skills />
      <Resume />
      <Contact id="contact" />
    </div>
  );
}

export default App;