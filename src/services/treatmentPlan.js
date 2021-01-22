import axios from 'utils/axios';
import axiosPatient from 'utils/patient-axios';

const createTreatmentPlan = payload => {
  const httpRequest = payload.type === 'preset' ? axios : axiosPatient;
  return httpRequest.post('/treatment-plan', payload)
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
  const httpRequest = payload.type === 'preset' ? axios : axiosPatient;
  return httpRequest.put(`/treatment-plan/${id}`, payload)
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
  const httpRequest = payload.type === 'preset' ? axios : axiosPatient;
  return httpRequest.get('/treatment-plan', { params: payload })
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
  getTreatmentPlans
};
