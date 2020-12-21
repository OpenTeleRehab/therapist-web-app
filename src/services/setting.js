import axios from 'utils/admin-axios';

const getLanguage = () => {
  return axios.get('/language')
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
  getLanguage
};
