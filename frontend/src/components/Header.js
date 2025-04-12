import React from 'react';
import '../css/Header.css';
import logo from '../assets/image/logo2.png';

const Header = () => {
  return (
    <header className="pc-home-header">
      <img src={logo} alt="logo" className="pc-home-logo" />
      <nav className="pc-home-nav">
        <a href="#">HOME</a>
        <a href="#">SEARCH</a>
        <a href="#">COMMUNITY</a>
        <a href="#">MAP</a>
      </nav>
    </header>
  );
};

export default Header;