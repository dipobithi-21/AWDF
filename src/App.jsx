import Header from "./components/Header";
import About from "./components/About";
import Skills from "./components/Skills";
import Footer from "./components/Footer";
import "./styles.css";

function App() {
  const skills = [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Git"
  ];

  return (
    <div className="container">
      <Header name="Dipobithi" />
      <About />
      <Skills skillList={skills} />
      <Footer email="dipobithi@example.com" />
    </div>
  );
}

export default App;