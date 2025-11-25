import axios from 'utils/axios';

const getHealthConditions = payload => {
  return axios.get('/health-condition', { params: payload })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const HealthCondition = {
  getHealthConditions
};
