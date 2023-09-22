import { isCancel } from 'axios';
import axios from 'utils/axios';
import { getCountryIsoCode } from 'utils/country';

const getAssistiveTechnologies = payload => {
  return axios.get('/assistive-technologies/list/get-all', {
    params: payload
  }).then(
    res => {
      return res.data;
    }
  ).catch((e) => {
    return e.response.data;
  });
};

const getPatientAssistiveTechnologies = payload => {
  if (window.abortController !== undefined) {
    window.abortController.abort();
  }
  window.abortController = new AbortController();

  return axios.get('/patient-assistive-technologies', {
    params: payload,
    signal: window.abortController.signal,
    headers: { country: getCountryIsoCode() }
  }).then(
    res => {
      return res.data;
    }
  ).catch((e) => {
    if (isCancel(e)) {
      return e;
    }
    return e.response.data;
  });
};

const createPatientAssistiveTechnology = payload => {
  return axios.post('/patient-assistive-technologies', payload, { headers: { country: getCountryIsoCode() } })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const updatePatientAssistiveTechnology = (id, payload) => {
  return axios.put(`/patient-assistive-technologies/${id}`, payload, { headers: { country: getCountryIsoCode() } })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const deletePatientAssistiveTechnology = id => {
  return axios.delete(`/patient-assistive-technologies/${id}`, { headers: { country: getCountryIsoCode() } })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const AssistiveTechnology = {
  getAssistiveTechnologies,
  getPatientAssistiveTechnologies,
  createPatientAssistiveTechnology,
  updatePatientAssistiveTechnology,
  deletePatientAssistiveTechnology
};
