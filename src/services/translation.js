import axios from 'utils/gAdminAxios';

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

const getTranslationAlertSms = (lang, key) => {
  const params = { lang: lang, key: key };
  return axios.get('/translation/by-key/i18n/therapist_portal', { params })
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
  getTranslations,
  getTranslationAlertSms
};
