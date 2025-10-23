import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
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
      
      {/* Clicking expands permanently */}
      <div className="project-title" onClick={() => setExpanded(true)}>
        {title} 
        {!expanded && <span className="arrow">⌄</span>}
      </div>

      {/* Smooth animation for description */}
      <AnimatePresence>
        {expanded && (
          <motion.p
            className="project-description"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: "0.5rem" }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {description}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default ProjectCard;