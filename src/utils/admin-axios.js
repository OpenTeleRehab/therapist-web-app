import axios from 'axios';

// Add a request interceptor
const adminaxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_ADMIN_API_BASE_URL
});

export default adminaxiosInstance;
