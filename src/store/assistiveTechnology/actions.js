import { mutation } from './mutations';
import { AssistiveTechnology } from 'services/assistiveTechnology';
import { showSpinner } from 'store/spinnerOverlay/actions';
import {
  showErrorNotification,
  showSuccessNotification
} from 'store/notification/actions';

export const getAssistiveTechnologies = payload => async dispatch => {
  dispatch(mutation.getAssistiveTechnologiesSuccess());
  dispatch(showSpinner(true));
  const data = await AssistiveTechnology.getAssistiveTechnologies(payload);
  if (data.success) {
    dispatch(mutation.getAssistiveTechnologiesSuccess(data.data, payload));
    dispatch(showSpinner(false));
    return data.info;
  } else {
    dispatch(mutation.getAssistiveTechnologiesFail());
    dispatch(showSpinner(false));
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const getPatientAssistiveTechnologies = payload => async dispatch => {
  dispatch(mutation.getPatientAssistiveTechnologiesRequest());
  dispatch(showSpinner(true));
  const data = await AssistiveTechnology.getPatientAssistiveTechnologies(payload);
  if (data.success) {
    dispatch(mutation.getPatientAssistiveTechnologiesSuccess(data.data, payload));
    dispatch(showSpinner(false));
    return data.info;
  } else {
    dispatch(mutation.getPatientAssistiveTechnologiesFail());
    dispatch(showSpinner(false));
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const createPatientAssistiveTechnology = payload => async (dispatch) => {
  dispatch(mutation.createPatientAssistiveTechnologyRequest());
  dispatch(showSpinner(true));
  const data = await AssistiveTechnology.createPatientAssistiveTechnology(payload);
  if (data.success) {
    dispatch(mutation.createPatientAssistiveTechnologySuccess());
    dispatch(getPatientAssistiveTechnologies());
    dispatch(showSuccessNotification('toast_title.new_assistive_technology', data.message));
    dispatch(showSpinner(false));
    return true;
  } else {
    dispatch(mutation.createPatientAssistiveTechnologyFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
    dispatch(showSpinner(false));
    return false;
  }
};

export const updatePatientAssistiveTechnology = (id, payload) => async (dispatch) => {
  dispatch(mutation.updatePatientAssistiveTechnologyRequest());
  const data = await AssistiveTechnology.updatePatientAssistiveTechnology(id, payload);
  if (data.success) {
    dispatch(mutation.updatePatientAssistiveTechnologySuccess());
    dispatch(getPatientAssistiveTechnologies());
    dispatch(showSuccessNotification('toast_title.edit_assistive_technology', data.message));
    return true;
  } else {
    dispatch(mutation.updatePatientAssistiveTechnologyFail());
    dispatch(showErrorNotification('toast_title.edit_assistive_technology', data.message));
    return false;
  }
};

export const deletePatientAssistiveTechnology = (id) => async (dispatch) => {
  dispatch(mutation.deletePatientAssistiveTechnologiesRequest());
  const data = await AssistiveTechnology.deletePatientAssistiveTechnology(id);
  if (data.success) {
    dispatch(mutation.deletePatientAssistiveTechnologiesSuccess());
    dispatch(getPatientAssistiveTechnologies());
    dispatch(showSuccessNotification('toast_title.delete_assistive_technology', data.message));
    return true;
  } else {
    dispatch(mutation.deletePatientAssistiveTechnologiesFail());
    dispatch(showErrorNotification('toast_title.delete_assistive_technology', data.message));
    return false;
  }
};
