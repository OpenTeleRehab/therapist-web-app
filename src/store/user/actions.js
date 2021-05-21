import { User } from 'services/user';
import { mutation } from './mutations';
import { getTranslate } from 'react-localize-redux';

import {
  showErrorNotification,
  showSuccessNotification
} from 'store/notification/actions';
import { showSpinner } from 'store/spinnerOverlay/actions';

// Actions
export const createUser = payload => async (dispatch, getState) => {
  dispatch(mutation.createUserRequest());
  dispatch(showSpinner(true));
  const data = await User.createUser(payload);
  if (data.success) {
    dispatch(mutation.createUserSuccess());
    const filters = getState().user.filters;
    dispatch(getUsers(filters));
    dispatch(showSuccessNotification('toast_title.new_patient_account', data.message));
    dispatch(showSpinner(false));
    return true;
  } else {
    dispatch(mutation.createUserFail());
    dispatch(showErrorNotification('toast_title.new_patient_account', data.message));
    dispatch(showSpinner(false));
    return false;
  }
};

export const getUsers = payload => async dispatch => {
  dispatch(mutation.getUsersRequest());
  const data = await User.getUsers(payload);
  if (data.success) {
    dispatch(mutation.getUsersSuccess(data.data, payload));
    return data.info;
  } else {
    dispatch(mutation.getUsersFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const updateUser = (id, payload) => async (dispatch, getState) => {
  dispatch(mutation.updateUserRequest());
  const data = await User.updateUser(id, payload);
  if (data.success) {
    dispatch(mutation.updateUserSuccess());
    const filters = getState().user.filters;
    dispatch(getUsers(filters));
    dispatch(showSuccessNotification('toast_title.edit_patient_account', data.message));
    return true;
  } else {
    dispatch(mutation.updateUserFail());
    dispatch(showErrorNotification('toast_title.edit_patient_account', data.message));
    return false;
  }
};

export const activateDeactivateAccount = (id, enabled) => async (dispatch, getState) => {
  dispatch(mutation.activateDeactivateRequest());
  const data = await User.activateDeactivateAccount(id, enabled);
  const translate = getTranslate(getState().localize);
  if (data.success) {
    dispatch(mutation.activateDeactivateSuccess());
    const filters = getState().user.filters;
    dispatch(getUsers(filters));
    dispatch(showSuccessNotification('toast_title.activate_deactivate_patient_account', data.message, { status: data.enabled ? translate('patient.activate') : translate('patient.deactivate') }));
    return true;
  } else {
    dispatch(mutation.activateDeactivateFail());
    dispatch(
      showErrorNotification('toast_title.activate_deactivate_patient_account', data.message));
    return false;
  }
};

export const deleteAccount = (id) => async (dispatch, getState) => {
  dispatch(mutation.deleteRequest());
  const data = await User.deleteAccount(id);
  if (data.success) {
    dispatch(mutation.deleteSuccess());
    const filters = getState().user.filters;
    dispatch(getUsers(filters));
    dispatch(showSuccessNotification('toast_title.delete_patient_account', data.message));
    return true;
  } else {
    dispatch(mutation.deleteFail());
    dispatch(
      showErrorNotification('toast_title.delete_patient_account', data.message));
    return false;
  }
};
