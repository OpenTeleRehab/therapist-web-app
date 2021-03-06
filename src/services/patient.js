import axios from 'utils/patient-axios';
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

export const Patient = {
  getPatients
};
