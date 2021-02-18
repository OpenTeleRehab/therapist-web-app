import axios from 'utils/admin-axios';

const getQuestionnaires = payload => {
  return axios.get('/questionnaire', { params: payload })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const getQuestionnairesByIds = (materialIds, lang) => {
  const params = { questionnaire_ids: materialIds, lang: lang };
  return axios.get('questionnaire/list/by-ids', { params })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const Questionnaire = {
  getQuestionnaires,
  getQuestionnairesByIds
};
