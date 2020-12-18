import axios from 'utils/axios';

const getProfile = username => {
  return axios.get(`/user/profile/${username}`)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const updateProfile = (id, payload) => {
  return axios.put(`/user/update-information/${id}`, payload)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const updatePassword = (username, payload) => {
  return axios.put(`/user/update-password/${username}`, payload)
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
