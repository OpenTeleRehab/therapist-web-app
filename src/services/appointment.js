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

const createAppointment = payload => {
  return axios.post('/appointment', payload)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const updateAppointment = (id, payload) => {
  return axios.put(`/appointment/${id}`, payload)
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
  getAppointments,
  createAppointment,
  updateAppointment
};
