import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from './axios/axiosConfig';
import './css/AddCourse.css';
import Loading from './Loading';

const AddCourse = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [videos, setVideos] = useState([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [errorMsg, setErrMsg] = useState('');

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    // Check if the selected file is an image (e.g., JPEG, PNG, or GIF)
    if (selectedImage && selectedImage.type.startsWith('image/')) {
      setErrMsg('');
      setImage(selectedImage);
    } else {
      // alert('Please select a valid image file (JPEG, PNG, or GIF).');
      setErrMsg('Please select a valid image file (JPEG, PNG, or GIF).');
    }
  };

  const handleVideoChange = (e) => {
    var selectedVideos = e.target.files;
    var error = false;
    console.log("selctedVideos", selectedVideos)
    // Check if the selected file is a video (e.g., MP4)
    if (selectedVideos) {
      for(const file of selectedVideos){
        if (file && file.type.startsWith('video/')) {
        } else {
          error = true
        }
      }
    }
    if(error==true){
      setErrMsg('Please select a valid video file (MP4).');
    }else{
      setErrMsg('')
      setVideos([...selectedVideos]);
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleCatChange = (e) => {
    setCategory(e.target.value);
  };

  const handleDurationChange = (e) => {
    setDuration(e.target.value)
  }

  const handleDesChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("videos",videos)

    if (image == null) {
      setErrMsg("Please select course image");
    }
    else if (videos.length == 0) {
      setErrMsg("Please upload source content");
    } else {
      setIsLoading(true)

      const formData = new FormData();
      formData.append('name', name);
      formData.append('category', category);
      formData.append('duration', duration);
      formData.append('description', description);
      if(localStorage.getItem('currentUser')){
        formData.append('owner', JSON.parse(localStorage.getItem('currentUser'))?._id)
      }
      formData.append('image', image);
      // formData.append('video', videos)
      for (let i = 0; i < videos.length; i++) {
        formData.append('video', videos[i]);
      }
  
      try {
        await axios.post('/upload', formData, 
          {headers: {
            'Content-Type': 'multipart/form-data',
        }});
        setIsLoading(false);
        // alert('File uploaded successfully.');
        navigate('/')
      } catch (error) {
        setIsLoading(false);
        console.error(error);
        alert('Error uploading file.');
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Upload Course Content</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="image" className="label">
            Select Course image:
          </label>
          <label htmlFor="image" className={`custom-file-upload ${image != null ? 'blue' : 'blue'}`}>
            {image ? image.name : 'Upload image'}
          </label>
          <input
            type="file"
            name='image'
            id="image"
            accept="image/*"
            className="input-file"
            onChange={handleImageChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="video" className="label">
            Course content:
          </label>
          <label htmlFor="video" className={`custom-file-upload ${videos.length > 0 ? 'blue' : 'blue'}`}>
            {videos.length > 0 ? `${videos[0].name} (${videos.length})` : 'Upload videos'}
          </label>
          <input
            type="file"
            name='video'
            id="video"
            accept="video/*"
            multiple
            className="input-file"
            onChange={handleVideoChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="name" className="label">Course Name:</label>
          <input type="text" name='name' id="name" value={name} onChange={handleNameChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="category" className="label">Category:</label>
          <input type="text" name='category' id="category" value={category} onChange={handleCatChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="duration" className="label">Duration(Months) :</label>
          <input type="number" step={1} min={1} max={12} style={{ width: '190px' }} name='duration' id="duration" value={duration} onChange={handleDurationChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="description" className="label">Description:</label>
          <textarea  name='description' rows={3} cols={25} style={{resize:'horizontal'}} id="description" value={description} onChange={handleDesChange} required/>
          {/* <input type="textarea" columns={3} name='description' id="description" value={description} onChange={handleDesChange} required /> */}
        </div>
        <div className="button-container">
          <button type="submit" className="button">
            Upload
          </button>
          {isLoading && <Loading />}
        </div>
      </form>
      <div className='err-msg'>{errorMsg}</div>
    </div>
  );
};

export default AddCourse;
