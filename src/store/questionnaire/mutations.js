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

const updateFavoriteRequest = () => ({
  type: 'UPDATE_FAVORITE_REQUEST'
});

const updateFavoriteSuccess = () => ({
  type: 'UPDATE_FAVORITE_SUCCESS'
});

const updateFavoriteFail = () => ({
  type: 'UPDATE_FAVORITE_FAIL'
});

export const mutation = {
  getQuestionnairesRequest,
  getQuestionnairesSuccess,
  getQuestionnairesFail,
  clearFilterQuestionnairesRequest,
  updateFavoriteRequest,
  updateFavoriteSuccess,
  updateFavoriteFail
};
