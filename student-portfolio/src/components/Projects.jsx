import React from 'react';

const Projects = ({ projects }) => {
  return (
    <section>
      <h2>Projects</h2>
      <div>
        {projects.map((project, index) => (
          <div key={index} className="card">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
