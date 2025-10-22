import "./Resume.css";

function Resume() {
  return (
    <section className="resume" id="resume">
      <h2>Resume</h2>
      <a href="/resume.pdf" download className="resume-btn">
        Download Resume
      </a>
    </section>
  );
}

export default Resume;
