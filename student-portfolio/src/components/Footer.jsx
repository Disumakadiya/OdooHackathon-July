import React from 'react';

const Footer = ({ email, copyright }) => {
  return (
    <footer>
      <p>Contact: {email}</p>
      <p>{copyright}</p>
    </footer>
  );
};

export default Footer;
