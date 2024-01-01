import React from 'react';

import './css/Header.css'
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {

  const navigate = useNavigate();

  // Add an event listener for the "storage" event on the window object
  window.addEventListener('storage', function (e) {
    if (e.key === 'currentUser') {
      navigate(0);
      console.log('LocalStorage data changed:', e.newValue);
    }
  });

  return (
    <header>
      <h2>Online Courses</h2>
      { !localStorage.getItem('currentUser') &&
      <span>
      <Link to="/register"><span className='white-text'>Register &nbsp; &nbsp;</span></Link>
      <Link to="/login"><span className='white-text' >Login &nbsp; &nbsp;</span></Link>
      </span>
      }
    </header>
  );
};

export default Header;
