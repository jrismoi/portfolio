import { motion } from "framer-motion";
import "./Skills.css";

function Skills() {
  const skills = [
    "React",
    "JavaScript",
    "HTML",
    "CSS",
    "Python",
    "Rust",
    "SQL",
    "UI/UX Design",
    "Git",
    "Swift",
    "C",
    "SML", 
  ];

  return (
    <section className="skills" id="skills">
      <h2>Skills & Technologies</h2>
      <div className="skills-grid">
        {skills.map((skill, index) => (
          <motion.div
            key={index}
            className="skill-badge"
            whileHover={{ scale: 1.1, boxShadow: "0 0 15px #61dafb" }}
            whileTap={{ scale: 0.95 }}
          >
            {skill}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default Skills;
