const getQuestionnairesRequest = () => ({
  type: 'GET_QUESTIONNAIRES_REQUEST'
});

const getQuestionnairesSuccess = (data, filters) => ({
  type: 'GET_QUESTIONNAIRES_SUCCESS',
  data,
  filters
});

const getQuestionnairesFail = () => ({
  type: 'GET_QUESTIONNAIRES_FAIL'
});

export const mutation = {
  getQuestionnairesRequest,
  getQuestionnairesSuccess,
  getQuestionnairesFail
};
