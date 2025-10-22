// src/App.jsx
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "./Navbar";
import ProjectCard from "./ProjectCard";
import Skills from "./Skills";
import Resume from "./Resume";
import Contact from "./Contact";
import "./App.css";

function App() {
  const { scrollYProgress } = useScroll();
  const name = "Miguel Orellana";
  const letters = Array.from(name);

  // Precompute random transforms for each letter
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

  const projects = [
    {
      videoSrc: "/videos/project1.mp4",
      title: "8-bit Music Game",
      description:
        "An interactive game teaching absolute pitch using 8-bit sounds.",
    },
    {
      videoSrc: "/videos/project2.mp4",
      title: "Portfolio Demo",
      description:
        "This portfolio built with React and Framer Motion, featuring animations and interactive projects.",
    },
  ];

  return (
    <div className="container">
      {/* Navbar */}
      <Navbar />

      {/* Intro Section */}
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

      {/* About Section */}
      <section className="about" id="about">
        <h2>About Me</h2>
        <p>
          I am a fourth year at the University of Chicago. I am graduating with
          a bachelors in Computer Science and Cognitive Science with a passion
          in UI/UX design. I love creating interesting and usable programs to
          work with. This is what I've worked on!
        </p>
      </section>

      {/* Projects Section */}
      <section className="projects" id="projects">
        <h2>Projects</h2>
        <div className="project-grid">
          {projects.map((proj, i) => (
            <ProjectCard
              key={i}
              videoSrc={proj.videoSrc}
              title={proj.title}
              description={proj.description}
            />
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <Skills />

      {/* Resume Download Section */}
      <Resume />

      {/* Contact Section */}
      <Contact id="contact" />
    </div>
  );
}

export default App;