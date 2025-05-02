import React from 'react';
import '../css/Header.css';
import logo from '../assets/image/logo2.png';

const Header = () => {
  const token = localStorage.getItem('token');

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <header className="pc-home-header">
      <img src={logo} alt="logo" className="pc-home-logo" />
      <nav className="pc-home-nav">
        <a href="/pchome">HOME</a>
        <a href="/news">NEWS</a>
        <a href={token ? "/board" : "/login"}>COMMUNITY</a>
        <a href="/map">MAP</a>
        {token && (
          <a href="/pchome" onClick={handleLogout} className="logout-button">
            LOGOUT
          </a>
        )}
      </nav>
    </header>
  );
};

export default Header;