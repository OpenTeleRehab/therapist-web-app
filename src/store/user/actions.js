import { User } from 'services/user';
import { mutation } from './mutations';

import {
  showErrorNotification,
  showSuccessNotification
} from 'store/notification/actions';

// Actions
export const createUser = payload => async (dispatch, getState) => {
  dispatch(mutation.createUserRequest());
  const data = await User.createUser(payload);
  if (data.success) {
    dispatch(mutation.createUserSuccess());
    dispatch(showSuccessNotification('toast_title.new_patient_account', data.message));
    return true;
  } else {
    dispatch(mutation.createUserFail());
    dispatch(showErrorNotification('New patient account', data.message));
    return false;
  }
};

export const getUsers = payload => async dispatch => {
  dispatch(mutation.getUsersRequest());
  // dispatch(showSpinner(true));
  const data = await User.getUsers(payload);
  if (data.success) {
    dispatch(mutation.getUsersSuccess(data.data, payload));
    // dispatch(showSpinner(false));
    return data.info;
  } else {
    dispatch(mutation.getUsersFail());
    // dispatch(showSpinner(false));
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const updateUser = (id, payload) => async (dispatch, getState) => {
  dispatch(mutation.updateUserRequest());
  const data = await User.updateUser(id, payload);
  if (data.success) {
    dispatch(mutation.updateUserSuccess());
    dispatch(getUsers());
    dispatch(showSuccessNotification('toast_title.patient_admin_account', data.message));
    return true;
  } else {
    dispatch(mutation.updateUserFail());
    dispatch(showErrorNotification('toast_title.edit_patient_account', data.message));
    return false;
  }
};
