import axios from 'utils/axios';
import axiosPatient from 'utils/patient-axios';
import { getCountryIsoCode } from 'utils/country';
import { TYPE } from '../variables/treatmentPlan';

const createTreatmentPlan = payload => {
  let httpRequest = axios;
  let config = ['/treatment-plan', payload];
  if (payload.type !== TYPE.preset) {
    httpRequest = axiosPatient;
    config = ['/treatment-plan', payload, { headers: { country: getCountryIsoCode() } }];
  }
  return httpRequest.post(...config)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const updateTreatmentPlan = (id, payload) => {
  let httpRequest = axios;
  let config = [`/treatment-plan/${id}`, payload];
  if (payload.type !== TYPE.preset) {
    httpRequest = axiosPatient;
    config = [`/treatment-plan/${id}`, payload, { headers: { country: getCountryIsoCode() } }];
  }
  return httpRequest.put(...config)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const getTreatmentPlans = payload => {
  let httpRequest = axios;
  let config = ['/treatment-plan', { params: payload }];
  if (payload.type !== TYPE.preset) {
    httpRequest = axiosPatient;
    config = ['/treatment-plan', { params: payload, headers: { country: getCountryIsoCode() } }];
  }
  return httpRequest.get(...config)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const getTreatmentPlansDetail = payload => {
  let httpRequest = axios;
  let config = ['/treatment-plan/get-treatment-plan-detail', { params: payload }];
  if (payload.type !== TYPE.preset) {
    httpRequest = axiosPatient;
    config = ['/treatment-plan/get-treatment-plan-detail', { params: payload, headers: { country: getCountryIsoCode() } }];
  }
  return httpRequest.get(...config)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const deleteTreatmentPlan = id => {
  return axios.delete(`/treatment-plan/${id}`)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const TreatmentPlan = {
  createTreatmentPlan,
  updateTreatmentPlan,
  getTreatmentPlans,
  getTreatmentPlansDetail,
  deleteTreatmentPlan
};
