import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import "./ProjectCard.css";

function ProjectCard({ videoSrc, title, description }) {
  const [expanded, setExpanded] = useState(false);
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
      <div className="project-title" onClick={() => setExpanded(!expanded)}>
        {title} <span className="arrow">{expanded ? "⌃" : "⌄"}</span>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.p
            className="project-description"
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: "auto", opacity: 1, marginTop: "0.5rem" }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ duration: 0.4 }}
          >
            {description}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default ProjectCard;