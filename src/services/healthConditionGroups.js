import axios from 'utils/axios';

const getHealthConditionGroups = payload => {
  return axios.get('/health-condition-group', { params: payload })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const HealthConditionGroup = {
  getHealthConditionGroups
};
