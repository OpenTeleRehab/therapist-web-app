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

const getPatient = id => {
  return axios.get(`/patient/id/${id}`, { headers: { country: getCountryIsoCode() } })
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

const getPatientsForChatroom = payload => {
  if (window.userAbortController !== undefined) {
    // TODO: remove condition after refactor getChatRooms action
    if (!payload.disableAbortController) {
      window.userAbortController.abort();
    }
  }

  window.userAbortController = new AbortController();

  return axios.get('/patient/list-for-chatroom', {
    params: payload,
    signal: window.userAbortController.signal,
    headers: { country: getCountryIsoCode() }
  })
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
  getPatient,
  getPatientsByIds,
  getPatientsForChatroom
};
