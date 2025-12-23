import axios from 'utils/axios';

const getGuidances = (payload) => {
  const query = new URLSearchParams(payload);
  return axios.get('guidance-page', { params: query })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const Guidance = {
  getGuidances
};
