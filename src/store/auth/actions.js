import { Auth } from 'services/auth';
import { mutation } from './mutations';
import keycloak from 'utils/keycloak';
import {
  showErrorNotification,
  showSuccessNotification
} from 'store/notification/actions';

// Actions
export const getProfile = () => async dispatch => {
  dispatch(mutation.getProfileRequest(true));
  if (keycloak.authenticated) {
    const tokenParsed = keycloak.tokenParsed;
    const username = tokenParsed.preferred_username;
    const data = await Auth.getProfile(username);
    if (data) {
      dispatch(mutation.getProfileSuccess(data.data));
    } else {
      dispatch(mutation.getProfileFail());
      dispatch(showErrorNotification('toast_title.error_message', data.message));
    }
  }
};

export const updateProfile = (id, payload) => async dispatch => {
  dispatch(mutation.updateProfileRequest());
  if (keycloak.authenticated) {
    const data = await Auth.updateProfile(id, payload);
    if (data.success) {
      dispatch(mutation.updateProfileSuccess());
      dispatch(showSuccessNotification('toast_title.update_profile', 'success_message.update_profile_success'));
      dispatch(getProfile());
      return true;
    } else {
      dispatch(mutation.updatePasswordFail());
      dispatch(showErrorNotification('toast_title.update_profile', data.message));
      return false;
    }
  }
};

export const updatePassword = (payload) => async dispatch => {
  dispatch(mutation.updatePasswordRequest());
  if (keycloak.authenticated) {
    const tokenParsed = keycloak.tokenParsed;
    const username = tokenParsed.preferred_username;
    const userId = tokenParsed.sub;
    const data = await Auth.updatePassword(username, { ...payload, user_id: userId });
    if (data.success) {
      dispatch(mutation.updatePasswordSuccess());
      dispatch(showSuccessNotification('toast_title.change_password', 'success_message.change_password_success'));
      return true;
    } else {
      dispatch(mutation.updatePasswordFail());
      dispatch(showErrorNotification('toast_title.change_password', data.message));
      return false;
    }
  }
};
