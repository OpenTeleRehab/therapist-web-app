import { Survey } from 'services/survey';
import { mutation } from './mutations';
import { showErrorNotification, showSuccessNotification } from 'store/notification/actions';

export const getPublishSurvey = (payload) => async (dispatch) => {
  dispatch(mutation.getPublishSurveyRequest());
  const data = await Survey.getPublishSurvey(payload);
  if (data) {
    dispatch(mutation.getPublishSurveySuccess(data.data));
  } else {
    dispatch(mutation.getPublishSurveyFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const submitSurvey = payload => async (dispatch) => {
  dispatch(mutation.submitSurveyRequest());
  const data = await Survey.submitSurvey(payload);
  if (data.success) {
    dispatch(showSuccessNotification('toast_title.submit_survey', data.message));
    return true;
  } else {
    dispatch(mutation.submitSurveyFail());
    dispatch(showErrorNotification('toast_title.submit_survey', data.message));
    return false;
  }
};

export const skipSurvey = payload => async (dispatch) => {
  dispatch(mutation.skipSurveyRequest());
  const data = await Survey.skipSurvey(payload);
  if (data.success) {
    dispatch(showSuccessNotification('toast_title.skip_survey', data.message));
    return true;
  } else {
    dispatch(mutation.skipSurveyFail());
    dispatch(showErrorNotification('toast_title.skip_survey', data.message));
    return false;
  }
};
