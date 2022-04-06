import axios from 'utils/gAdminAxios';

const getLanguages = () => {
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

export const Language = {
  getLanguages
};
