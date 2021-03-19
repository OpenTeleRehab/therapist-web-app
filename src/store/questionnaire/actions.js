import { Questionnaire } from 'services/questionnaire';
import { mutation } from './mutations';
import { showErrorNotification, showSuccessNotification } from 'store/notification/actions';

export const getQuestionnaires = payload => async dispatch => {
  dispatch(mutation.getQuestionnairesRequest());
  const data = await Questionnaire.getQuestionnaires(payload);
  if (data.success) {
    dispatch(mutation.getQuestionnairesSuccess(data.data, payload));
    return data.info;
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

export const clearFilterQuestionnaires = () => async dispatch => {
  dispatch(mutation.clearFilterQuestionnairesRequest());
};
