import axios from 'utils/patient-axios';

const getAppointments = payload => {
  return axios.get('/appointment', { params: payload })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const Appointment = {
  getAppointments
};
