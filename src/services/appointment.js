import axios from 'utils/axios';
import { getCountryIsoCode } from 'utils/country';

const getAppointments = payload => {
  return axios.get('/appointment', { params: payload, headers: { country: getCountryIsoCode() } })
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
  return axios.post('/appointment', payload, { headers: { country: getCountryIsoCode() } })
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
  return axios.put(`/appointment/${id}`, payload, { headers: { country: getCountryIsoCode() } })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const updateAppointmentStatus = (id, payload) => {
  return axios.post(`/appointment/updateStatus/${id}`, payload, { headers: { country: getCountryIsoCode() } })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const deleteAppointment = id => {
  return axios.delete(`/appointment/${id}`, { headers: { country: getCountryIsoCode() } })
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
  updateAppointment,
  updateAppointmentStatus,
  deleteAppointment
};
