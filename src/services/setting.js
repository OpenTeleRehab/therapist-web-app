import axios from 'utils/admin-axios';

const getSettings = payload => {
  return axios.get('/settings', { params: payload })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const Setting = {
  getSettings
};
