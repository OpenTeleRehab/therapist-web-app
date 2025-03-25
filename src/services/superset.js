import axios from 'utils/axios';

const getGuestToken = () => {
  return axios.get('/superset-guest-token')
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const superset = { getGuestToken };
