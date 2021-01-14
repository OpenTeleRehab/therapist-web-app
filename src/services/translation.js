import axios from 'utils/admin-axios';

const getTranslations = () => {
  return axios.get('/translation/i18n/therapist_portal')
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const Translation = {
  getTranslations
};
