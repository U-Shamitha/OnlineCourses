import React, { useState, useEffect } from 'react';
import axios from './axios/axiosConfig';

import './css/CourseCard.css'
import VideoCard from './VideoCard';
import { useNavigate } from 'react-router-dom';

function CourseContent() {
    const [course, setCourse] = useState(null);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavourite, setIsFavourite] = useState(false);

    const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/courseContent/${JSON.parse(localStorage.getItem('selectedCourse'))}`) // Make a GET request to your backend API
      .then((response) => {
        console.log("selected course", response.data)
        console.log(response.data._id)
        console.log(JSON.parse(localStorage.getItem("currentUser")).favouriteCourses.some((favcourse) => favcourse.courseId==response.data._id))
        setIsFavourite(JSON.parse(localStorage.getItem("currentUser")).favouriteCourses.some((favcourse) => favcourse.courseId==response.data._id))
        const blob = new Blob([Int8Array.from(response.data.image.data.data)], { type: response.data.image.contentType });
        setImage(window.URL.createObjectURL(blob));
        setCourse(response.data)
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  },[]);

  const handleAddCourseToFav = () => {
    axios.post(`updateUserFav/add/${JSON.parse(localStorage.getItem("currentUser"))._id}`, {newFavouriteCourse:  {courseId: course._id, courseName: course.name}})
    .then((res) => {
      localStorage.setItem('currentUser', JSON.stringify(res.data.user))
      navigate('/favCourses');
    })
    .catch((error) =>{
        console.log(error);
        alert(error);
    })
  }

  const handleRemoveCourseToFav = () => {
    axios.post(`updateUserFav/remove/${JSON.parse(localStorage.getItem("currentUser"))._id}`, {newFavouriteCourse:  {courseId: course._id, courseName: course.name}})
    .then((res) => {
      localStorage.setItem('currentUser', JSON.stringify(res.data.user))
      navigate('/favCourses');
    })
    .catch((error) =>{
        console.log(error);
        alert(error);
    })
  }


  return (
    <div>
      <h2 className='courseContent-heading'>Course Details</h2>
      <div className='course-details-con '>
        {!loading ? (course && 
          <>
          <div className='detail1'>
          <img src={image} />
          <span className='detail1-2'>
            <p>{course.category}</p>
            <p>{course.duration} months</p>
            {localStorage.getItem('currentUser') && !isFavourite && <button className="register-btn" type="button" onClick={handleAddCourseToFav}>Add To Favourites</button>}
            {localStorage.getItem('currentUser') && isFavourite && <button className="register-btn" type="button" onClick={handleRemoveCourseToFav}>Remove from Favourites</button>}
            {/* <p>{course.owner}</p> */}
          </span>
          </div>
          <div>
          <p style={{lineHeight:'1.5'}} >{course.description}</p>
          </div>
          </>) :
          'Loading...'
        }
      </div>
      <h2 className='courseContent-heading'>Course Playlist</h2>
      <div className="videos-grid">
        {course && course.videos.map((video, index) => (
          <VideoCard key={index} video={video} />
        ))}
      </div>
    </div>
  );
}

export default CourseContent
