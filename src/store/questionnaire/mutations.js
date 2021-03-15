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

const clearFilterQuestionnairesRequest = () => ({
  type: 'CLEAR_FILTER_QUESTIONNAIRES_REQUEST'
});

export const mutation = {
  getQuestionnairesRequest,
  getQuestionnairesSuccess,
  getQuestionnairesFail,
  clearFilterQuestionnairesRequest
};
