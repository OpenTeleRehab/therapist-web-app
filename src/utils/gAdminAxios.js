import axios from 'axios';

export default axios.create({
  baseURL: process.env.REACT_APP_API_GLOBAL_ADMIN_URL
});
