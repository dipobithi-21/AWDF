import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";

function Projects() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchRepositories = () => {
    setLoading(true);
    setError("");

    fetch("https://api.github.com/users/dipobithi-21/repos")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch repositories.");
        }
        return response.json();
      })
      .then((data) => {
        setRepos(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRepositories();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={fetchRepositories}
      />
    );
  }

  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">

      <h2>My GitHub Repositories</h2>

      <input
        type="text"
        placeholder="Search repositories..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="project-grid">

        {filteredRepos.map((repo) => (
          <div className="project-card" key={repo.id}>

            <h3>{repo.name}</h3>

            <p>⭐ Stars: {repo.stargazers_count}</p>

            <a
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
            >
              View Repository
            </a>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Projects;