import axios from 'axios';

// Add a request interceptor
const patientaxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_PATIENT_API_BASE_URL
});

export default patientaxiosInstance;
