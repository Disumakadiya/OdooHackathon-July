import React from 'react';

const Header = ({ studentName, profileImage }) => {
  return (
    <header>
      <img src={profileImage} alt="Profile" />
      <h1>{studentName}</h1>
    </header>
  );
};

export default Header;
