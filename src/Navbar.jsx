import "./Navbar.css";

function Navbar() {
  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="navbar">
      <ul>
        <li>
          <a href="#intro" onClick={(e) => scrollToSection(e, 'intro')}>Intro</a>
        </li>
        <li>
          <a href="#about" onClick={(e) => scrollToSection(e, 'about')}>About</a>
        </li>
        <li>
          <a href="#projects" onClick={(e) => scrollToSection(e, 'projects')}>Projects</a>
        </li>
        <li>
          <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')}>Contact</a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;