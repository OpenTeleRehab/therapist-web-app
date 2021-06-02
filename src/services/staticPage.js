import axios from 'utils/admin-axios';

const getFaqPage = (payload) => {
  return axios.get('/page/static-page-data', { params: payload })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const staticPage = {
  getFaqPage
};
