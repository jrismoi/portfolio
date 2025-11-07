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
      videoSrc: "/videos/game-vid.mp4",
      title: "8-bit Music Game",
      description:
        "An 8-bit retro game testing whether absolute pitch can be 'trained.' Players match musical pitches to screen positions. Built with JavaScript and live servers.",
    },
    {
      videoSrc: "/videos/app-vid.mp4",
      title: "Robust Gesture iOS App",
      description:
        "An iPhone app comparing shake and tilt gesture robustness. Outputs accelerometer and gyroscope data as CSV. Built with Swift and SwiftUI.",
    },
    {
      videoSrc: "/videos/calculator.mp4",
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
              {char}
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
          Science, passionate about UI/UX design and creative interactive systems. Here’s what I’ve
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
              const style = {
                transform: `translateX(${offset * 360}px) scale(${isActive ? 1 : 0.85})`,
                opacity: isActive ? 1 : 0.4,
                zIndex: isActive ? 10 : 1,
              };

              return (
                <motion.div
                  key={index}
                  className="carousel-item"
                  animate={style}
                  transition={{ type: "spring", stiffness: 80, damping: 15 }}
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
