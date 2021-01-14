import axios from 'axios';

// Add a request interceptor
const adminaxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_ADMIN_API_BASE_URL
});

adminaxiosInstance.interceptors.request.use((config) => {
  const { lang } = window;
  if (lang) {
    config.params = { ...config.params, lang };
  }
  return config;
});

export default adminaxiosInstance;
