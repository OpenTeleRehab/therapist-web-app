import axios from 'utils/admin-axios';

const getPublishPrivacyPolicy = payload => {
  return axios.get('/public/user-privacy-policy', { params: payload })
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
