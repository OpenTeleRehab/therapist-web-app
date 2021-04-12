import axios from 'utils/patient-axios';
import { getCountryIsoCode } from 'utils/country';

const createUser = payload => {
  return axios.post('/patient', payload, { headers: { country: getCountryIsoCode() } })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const updateUser = (id, payload) => {
  return axios.put(`/patient/${id}`, payload, { headers: { country: getCountryIsoCode() } })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const getUsers = payload => {
  return axios.get('/patient', { params: payload, headers: { country: getCountryIsoCode() } })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const User = {
  createUser,
  getUsers,
  updateUser
};
