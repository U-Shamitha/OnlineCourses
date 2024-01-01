import React, { useState } from 'react';
import {Routes, Route, Link} from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faFolder, faHome, faUser, faAdd, faStar } from '@fortawesome/free-solid-svg-icons';

import './css/Home.css';

import Sidebar from './Sidebar';
import Header from './Header';
import AddCourse from './AddCourse';
import CourseList from './CourseList';
import VideoList from './VideoList';
import CourseContent from './CousreContent';
import Login from './Login';
import Register from './Register';
import UserProfile from './UserProfile';
import UpdateCourse from './UpdateCourse';
import UpdateProfile from './UpdateProfile';
import FavouriteCourses from './FavouriteCourses';

function Home() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="app">
      <div className={`menu-icons ${isSidebarOpen ? 'hide' : ''}`} >
        <FontAwesomeIcon icon={faBars} className='menu-icon' onClick={toggleSidebar} />
        <Link to="/"><FontAwesomeIcon icon={faHome} className='menu-icon'/></Link>
        <Link to="/addCourse"><FontAwesomeIcon icon={faAdd} className='menu-icon' /></Link>
        <Link to="/favCourses"><FontAwesomeIcon icon={faStar} className='menu-icon' /></Link>
        <Link to="/profile"><FontAwesomeIcon icon={faUser} className='menu-icon' /></Link>
      </div>
      <div className={`backdrop ${isSidebarOpen ? 'open' : ''}`} onClick={toggleSidebar}></div>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`content ${isSidebarOpen ? 'shifted' : ''}`}>
        <Header/>
        <div className='main-content'>
          <Routes>
            <Route path="/addCourse" element={<AddCourse/>} />
            <Route path="/favCourses" element={<FavouriteCourses/>}/>
            <Route path="/updateCourse" element={<UpdateCourse/>} />
            <Route path="/" element={<CourseList/>} />
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/profile" element={<UserProfile/>}/>
            <Route path="/updateProfile" element={<UpdateProfile/>}/>
            <Route path="/videoList" element={<VideoList/>}/>
            <Route path="/courseContent" element={<CourseContent course={JSON.parse(localStorage.getItem('selectedCourse'))}/>}/>
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Home;
