import axios from 'utils/axios';

const createTreatmentPlan = payload => {
  return axios.post('/treatment-plan', payload)
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
  return axios.put(`/treatment-plan/${id}`, payload)
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
  return axios.get('/treatment-plan', { params: payload })
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
