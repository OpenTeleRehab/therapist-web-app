import axios from 'utils/axios';
import { getCountryIsoCode } from 'utils/country';

const getPatients = payload => {
  return axios.get('/patient/list/by-therapist-id', { params: payload, headers: { country: getCountryIsoCode() } })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const getPatientsByIds = payload => {
  return axios.get('/patient/list/by-ids', { params: payload, headers: { country: getCountryIsoCode() } })
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
  getPatients,
  getPatientsByIds
};
