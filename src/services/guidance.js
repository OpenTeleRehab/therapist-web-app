import axios from 'utils/axios';

const getGuidances = (lang) => {
  return axios.get(`guidance-page?lang=${lang}`)
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
