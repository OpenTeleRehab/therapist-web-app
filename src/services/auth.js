import axios from 'utils/axios';

const getProfile = () => {
  return axios.get('/user/profile')
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const updateProfile = payload => {
  return axios.put('/user/update-information', payload)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const updatePassword = payload => {
  return axios.put('/user/update-password', payload)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const Auth = {
  getProfile,
  updateProfile,
  updatePassword
};
