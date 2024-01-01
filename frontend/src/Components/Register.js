import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from './axios/axiosConfig';

import './css/Register.css'

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    try {
        const res = await axios.post('/api/register', {name: name, email: email, password: password});
        console.log("res", res.data.user)
        if(res.data.user!=null){
            localStorage.setItem('currentUser', JSON.stringify(res.data.user))
            navigate('/');
        }else{
            alert("Registration failed");
        }
      } catch (error) {
        console.error(error);
        alert('Error uploading file.');
      }
    console.log('Registration submitted:', name, email, password);
  };

  return (
    <div className="registration-page">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="register-btn" type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Register;
