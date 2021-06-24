import axios from 'utils/admin-axios';

const getPublishPrivacyPolicy = () => {
  return axios.get('/user-privacy-policy')
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const PrivacyPolicy = {
  getPublishPrivacyPolicy
};
