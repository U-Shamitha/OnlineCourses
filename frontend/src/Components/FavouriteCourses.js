import React, { useState, useEffect } from 'react';
import axios from './axios/axiosConfig';
import CourseCard from './CourseCard';

import './css/CourseCard.css'

function FavouriteCourses(props) {
  const [query, setQuery] = useState('');
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    axios.get(`/favouriteCourses/${JSON.parse(localStorage.getItem('currentUser'))._id}`) // Make a GET request to your backend API
      .then((response) => {
        setCourses(response.data.favouriteCourses);
        setFilteredCourses(response.data.favouriteCourses);
      })
      .catch((error) => {
        console.error(error);
      });

  }, []);

  const handleSearch = () => {
    const filteredCourses = courses.filter((course) => {
      if (course.category.toString().toLowerCase().includes(query.toLowerCase()) || 
          // course.duration.toString().toLowerCase().includes(query.toLowerCase()) ||
          course.name.toString().toLowerCase().includes(query.toLowerCase())) {
        return true;
      } else {
        return false;
      }
    });

    setFilteredCourses(filteredCourses);
  }

  return (
    <div>
      <div className='courseList-header'>
        <h2>Your Favourite Courses</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className='search-btn' onClick={handleSearch}>Search</button>
        </div>
      </div>
      <div className="courses-grid">
        {filteredCourses.map((course, index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div>
    </div>
  );
}

export default FavouriteCourses;
