import axios from 'utils/admin-axios';

const getTranslations = languageId => {
  const param = languageId ? `?lang=${languageId}` : '';
  return axios.get('/translation/i18n/therapist_portal' + param)
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
