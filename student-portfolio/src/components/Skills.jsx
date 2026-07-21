import React from 'react';

const Skills = ({ skillList }) => {
  return (
    <section>
      <h2>Skills</h2>
      <ul className="skills-list">
        {skillList.map((skill, index) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>
    </section>
  );
};

export default Skills;
