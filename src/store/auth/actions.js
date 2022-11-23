import { Auth } from 'services/auth';
import { mutation } from './mutations';
import {
  showErrorNotification,
  showSuccessNotification
} from 'store/notification/actions';
import { getTranslations } from 'store/translation/actions';
import { clearFilterQuestionnaires } from 'store/questionnaire/actions';
import { clearFilterEducationMaterials } from 'store/educationMaterial/actions';
import { clearFilterExercises } from 'store/exercise/actions';

// Actions
export const getProfile = () => async dispatch => {
  dispatch(mutation.getProfileRequest());
  const data = await Auth.getProfile();
  if (data && data.data) {
    dispatch(mutation.getProfileSuccess(data.data));
    return data;
  } else {
    dispatch(mutation.getProfileFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const updateProfile = (id, payload) => async dispatch => {
  dispatch(mutation.updateProfileRequest());
  const data = await Auth.updateProfile(payload);
  if (data.success) {
    dispatch(mutation.updateProfileSuccess());
    dispatch(getTranslations(payload.language_id));
    dispatch(getProfile());
    dispatch(clearFilterQuestionnaires());
    dispatch(clearFilterEducationMaterials());
    dispatch(clearFilterExercises());
    dispatch(showSuccessNotification('toast_title.update_profile', data.message));
    return true;
  } else {
    dispatch(mutation.updatePasswordFail());
    dispatch(showErrorNotification('toast_title.update_profile', data.message));
    return false;
  }
};

export const updatePassword = payload => async dispatch => {
  dispatch(mutation.updatePasswordRequest());
  const data = await Auth.updatePassword(payload);
  if (data.success) {
    dispatch(mutation.updatePasswordSuccess());
    dispatch(showSuccessNotification('toast_title.change_password', 'success_message.change_password_success'));
    return true;
  } else {
    dispatch(mutation.updatePasswordFail());
    dispatch(showErrorNotification('toast_title.change_password', data.message));
    return false;
  }
};
