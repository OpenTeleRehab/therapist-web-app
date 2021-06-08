import axios from 'utils/admin-axios';

const getDiseases = () => {
  return axios.get('/disease')
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const Disease = {
  getDiseases
};
