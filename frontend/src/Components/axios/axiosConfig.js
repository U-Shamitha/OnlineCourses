import axios from 'axios';

const instance = axios.create({
  // baseURL: 'http://localhost:5000', // Set your base URL here
  baseURL: 'https://onlinecourses-server.onrender.com'
});

export default instance;
