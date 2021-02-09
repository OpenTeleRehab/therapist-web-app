import { Questionnaire } from 'services/questionnaire';
import { mutation } from './mutations';
import { showErrorNotification } from 'store/notification/actions';

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
