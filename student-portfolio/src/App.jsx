import React from 'react';
import Header from './components/Header';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Footer from './components/Footer';
import './App.css';

function App() {
  // Replace these placeholder values with your own data
  
  // Student Name
  const studentName = "YOUR NAME HERE";
  
  // Profile Image
  const profileImage = "/profile.jpg";
  
  // About
  const aboutText = "Write your introduction here.";
  
  // Skills
  const skillList = [
    "Skill 1",
    "Skill 2",
    "Skill 3",
    "Skill 4"
  ];
  
  // Projects
  const projects = [
    {
      title: "Project 1",
      description: "Write project description here."
    },
    {
      title: "Project 2",
      description: "Write project description here."
    },
    {
      title: "Project 3",
      description: "Write project description here."
    }
  ];
  
  // Email
  const email = "your@email.com";
  
  // Footer
  const copyright = "© 2026 Your Name";

  return (
    <div className="app-container">
      <Header studentName={studentName} profileImage={profileImage} />
      <About aboutText={aboutText} />
      <Skills skillList={skillList} />
      <Projects projects={projects} />
      <Footer email={email} copyright={copyright} />
    </div>
  );
}

export default App;
