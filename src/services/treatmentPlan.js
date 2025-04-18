import { isCancel } from 'axios';
import axios from 'utils/axios';
import { getCountryIsoCode } from 'utils/country';
import { TYPE } from '../variables/treatmentPlan';

const createTreatmentPlan = payload => {
  let config = ['/treatment-plan', payload];

  if (payload.type !== TYPE.preset) {
    config = ['/patient-treatment-plan', payload, { headers: { country: getCountryIsoCode() } }];
  }

  return axios.post(...config)
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
  let config = [`/treatment-plan/${id}`, payload];

  if (payload.type !== TYPE.preset) {
    config = [`/patient-treatment-plan/${id}`, payload, { headers: { country: getCountryIsoCode() } }];
  }

  return axios.put(...config)
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
  if (window.tpAbortController !== undefined) {
    window.tpAbortController.abort();
  }

  window.tpAbortController = new AbortController();

  let config = ['/treatment-plan', { params: payload, signal: window.tpAbortController.signal }];

  if (payload.type !== TYPE.preset) {
    config = ['/patient-treatment-plan', {
      params: payload,
      signal: window.tpAbortController.signal,
      headers: {
        country: getCountryIsoCode()
      }
    }];
  }

  return axios.get(...config)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      if (isCancel(e)) {
        return e;
      }
      return e.response.data;
    });
};

const getTreatmentPlansDetail = payload => {
  let config = ['/treatment-plan/get-treatment-plan-detail', { params: payload }];

  if (payload.type !== TYPE.preset) {
    config = ['/patient-treatment-plan/get-treatment-plan-detail', { params: payload, headers: { country: getCountryIsoCode() } }];
  }

  return axios.get(...config)
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

const downloadTreatmentPlan = id => {
  return axios.get(`/treatment-plan/export/${id}`, { responseType: 'blob' })
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
  deleteTreatmentPlan,
  downloadTreatmentPlan
};
