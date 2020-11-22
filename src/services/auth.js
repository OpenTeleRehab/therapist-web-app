import axios from 'utils/axios';

const getProfile = username => {
  return axios.get(`/profile/${username}`)
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
  getProfile
};
