import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

function App() {

  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className={darkMode ? "app dark" : "app light"}>

      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <Routes>
        <Route path="/" element={<Home darkMode={darkMode} />} />
        <Route path="/projects" element={<Projects darkMode={darkMode} />} />
        <Route path="/contact" element={<Contact darkMode={darkMode} />} />
        <Route path="*" element={<NotFound darkMode={darkMode} />} />
      </Routes>

    </div>
  );
}

export default App;