import axios from 'utils/admin-axios';

const getTranslations = (lang) => {
  const params = { lang: lang };
  return axios.get('/translation/i18n/therapist_portal', { params })
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
