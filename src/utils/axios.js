import axios from 'axios';

// Add a request interceptor
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL
});

export default axiosInstance;
