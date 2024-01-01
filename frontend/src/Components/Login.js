import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from './axios/axiosConfig';


import './css/Register.css'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
        const res = await axios.post('/api/login', {email, password});
        if(res.data.user!=null){
            localStorage.setItem('currentUser', JSON.stringify(res.data.user))
        }else{
            alert(res.data.error);
        }
        navigate('/');
      } catch (error) {
        console.error(error);
        alert(error);
      }
    console.log('Registration submitted:', email, password);
    console.log('Login submitted:', email, password);
  };

  return (
    <div className="registration-page">
      <h2>Login</h2>
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
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className='register-btn' type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Login;
