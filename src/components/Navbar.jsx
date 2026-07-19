import { NavLink } from "react-router-dom";

function Navbar({ darkMode, setDarkMode }) {

  return (

    <nav>

      <div className="nav-links">

        <NavLink to="/">Home</NavLink>

        <NavLink to="/projects">Projects</NavLink>

        <NavLink to="/contact">Contact</NavLink>

      </div>

      <button
        className="theme-btn"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? "☀ Light" : "🌙 Dark"}
      </button>

    </nav>

  );

}

export default Navbar;