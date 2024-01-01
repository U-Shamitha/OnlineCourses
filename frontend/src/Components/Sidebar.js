import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faFolder, faHome, faUser } from '@fortawesome/free-solid-svg-icons';

import './css/Sidebar.css';
import { Link } from 'react-router-dom';



const Sidebar = ({ isOpen, toggleSidebar }) => {
    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <button className="close-button" onClick={toggleSidebar}>
          X
        </button>
        <ul>
        <Link to="/">
          <li>
            {isOpen ? (
              <FontAwesomeIcon icon={faHome}  className= 'open sidebar-icon'/>
            ) : (
              <FontAwesomeIcon icon={faHome}  className='closed sidebar-icon' /> /* Show icon even when closed */
            )}
            <span>Home</span>
          </li>
          </Link>
          <Link to="/addCourse">
          <li>
            {isOpen ? (
              <FontAwesomeIcon icon={faAdd}  className='open sidebar-icon' />
            ) : (
              <FontAwesomeIcon icon={faAdd}  className='closed sidebar-icon' /> /* Show icon even when closed */
            )}
            <span>Add Course</span>
          </li>
          </Link>
          <Link to="/profile">
          <li>
            {isOpen ? (
              <FontAwesomeIcon icon={faUser}  className='open sidebar-icon' />
            ) : (
              <FontAwesomeIcon icon={faUser}  className='closed sidebar-icon' /> /* Show icon even when closed */
            )}
            <span>User</span>
          </li>
          </Link>
        </ul>
      </div>
    );
};

export default Sidebar;