import axios from 'utils/axios';

const getDiseases = payload => {
  return axios.get('/disease', { params: payload })
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
