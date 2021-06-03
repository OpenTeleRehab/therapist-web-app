import adminaxiosInstance from '../utils/admin-axios';
const getGuidances = (lang) => {
  return adminaxiosInstance.get(`guidance-page?lang=${lang}`)
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
