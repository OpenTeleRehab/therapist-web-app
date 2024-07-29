import { Patient } from 'services/patient';
import { mutation } from './mutations';

import { showErrorNotification } from 'store/notification/actions';

export const getPatients = payload => async dispatch => {
  dispatch(mutation.getPatientsRequest());
  const data = await Patient.getPatients(payload);
  if (data.success) {
    dispatch(mutation.getPatientsSuccess(data.data));
    return data.info;
  } else {
    dispatch(mutation.getPatientsFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const getPatient = id => async dispatch => {
  dispatch(mutation.getPatientRequest());
  const data = await Patient.getPatient(id);
  if (data) {
    dispatch(mutation.getPatientSuccess(data));
    return data;
  } else {
    dispatch(mutation.getPatientFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const getPatientsByIds = payload => async dispatch => {
  const data = await Patient.getPatientsByIds(payload);
  if (data.success) {
    return data.data;
  } else {
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};
