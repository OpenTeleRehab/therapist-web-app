import axios from 'utils/patient-axios';

const getPatients = therapistId => {
  return axios.get('/patient/list/by-therapist-id', { params: therapistId })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const Patient = {
  getPatients
};
