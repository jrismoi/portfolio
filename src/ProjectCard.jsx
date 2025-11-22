// src/ProjectCard.jsx
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import "./ProjectCard.css";

function ProjectCard({ videoSrc, title, description }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className="project-card"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <video
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        className="project-video"
      ></video>
      <h3 className="project-title">{title}</h3>
      <p className="project-description">{description}</p>
    </motion.div>
  );
}

export default ProjectCard;