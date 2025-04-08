import { Questionnaire } from 'services/questionnaire';
import { mutation } from './mutations';
import { showErrorNotification, showSuccessNotification } from 'store/notification/actions';
import { showSpinner } from 'store/spinnerOverlay/actions';

export const getQuestionnaires = payload => async dispatch => {
  dispatch(mutation.getQuestionnairesRequest());
  const data = await Questionnaire.getQuestionnaires(payload);
  if (data.success) {
    dispatch(mutation.getQuestionnairesSuccess(data.data, payload, data.info));
  } else {
    dispatch(mutation.getQuestionnairesFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const updateFavorite = (id, payload) => async (dispatch, getState) => {
  dispatch(mutation.updateFavoriteRequest());
  const data = await Questionnaire.updateFavorite(id, payload);
  if (data.success) {
    dispatch(mutation.updateFavoriteSuccess());
    const filters = getState().questionnaire.filters;
    dispatch(getQuestionnaires({ ...filters, therapist_id: payload.therapist_id }));
    dispatch(showSuccessNotification('toast_title.update_questionnaire', data.message));
    return true;
  } else {
    dispatch(mutation.updateFavoriteFail());
    dispatch(showErrorNotification('toast_title.update_questionnaire', data.message));
    return false;
  }
};

export const getQuestionnaire = (id, language) => async dispatch => {
  dispatch(mutation.getQuestionnaireRequest());
  dispatch(showSpinner(true));
  const data = await Questionnaire.getQuestionnaire(id, language);
  if (data) {
    dispatch(mutation.getQuestionnaireSuccess(data.data));
    dispatch(showSpinner(false));
  } else {
    dispatch(mutation.getQuestionnaireFail());
    dispatch(showSpinner(false));
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const createQuestionnaire = (payload) => async dispatch => {
  dispatch(mutation.createQuestionnaireRequest());
  const data = await Questionnaire.createQuestionnaire(payload);
  if (data.success) {
    dispatch(mutation.createQuestionnaireSuccess());
    dispatch(showSuccessNotification('toast_title.new_questionnaire', data.message));
    return true;
  } else {
    dispatch(mutation.createQuestionnaireFail());
    dispatch(showErrorNotification('toast_title.new_questionnaire', data.message));
    return false;
  }
};

export const translateQuestionnaire = (payload) => async dispatch => {
  dispatch(mutation.translateQuestionnaireRequest());
  const data = await Questionnaire.translateQuestionnaire(payload);
  if (data.success) {
    dispatch(mutation.translateQuestionnaireSuccess());
    dispatch(showSuccessNotification('toast_title.translate_questionnaire', data.message));
    return true;
  } else {
    dispatch(mutation.translateQuestionnaireFail());
    dispatch(showErrorNotification('toast_title.translate_questionnaire', data.message));
    return false;
  }
};

export const updateQuestionnaire = (id, payload) => async dispatch => {
  dispatch(mutation.updateQuestionnaireRequest());
  const data = await Questionnaire.updateQuestionnaire(id, payload);
  if (data.success) {
    dispatch(mutation.updateQuestionnaireSuccess());
    dispatch(showSuccessNotification('toast_title.update_questionnaire', data.message));
    return true;
  } else {
    dispatch(mutation.updateQuestionnaireFail());
    dispatch(showErrorNotification('toast_title.update_questionnaire', data.message));
    return false;
  }
};

export const deleteQuestionnaire = id => async (dispatch, getState) => {
  dispatch(mutation.deleteQuestionnaireRequest());
  const data = await Questionnaire.deleteQuestionnaire(id);
  if (data.success) {
    dispatch(mutation.deleteQuestionnaireSuccess());
    const filters = getState().questionnaire.filters;
    dispatch(getQuestionnaires(filters));
    dispatch(showSuccessNotification('toast_title.delete_questionnaire', data.message));
    return true;
  } else {
    dispatch(mutation.deleteQuestionnaireFail());
    dispatch(showErrorNotification('toast_title.delete_questionnaire', data.message));
    return false;
  }
};

export const downloadQuestionnaireResults = (language) => async dispatch => {
  dispatch(mutation.downloadQuestionnaireResultsRequest());
  const data = await Questionnaire.downloadQuestionnaireResults(language);
  if (data) {
    dispatch(mutation.downloadQuestionnaireResultsSuccess());
    dispatch(showSuccessNotification('toast_title.export', data.message));
    return data.data;
  } else {
    dispatch(mutation.downloadQuestionnaireResultsFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
    return false;
  }
};

export const clearFilterQuestionnaires = () => async dispatch => {
  dispatch(mutation.clearFilterQuestionnairesRequest());
};
