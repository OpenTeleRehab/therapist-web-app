import { Patient } from 'services/patient';
import { mutation } from './mutations';

import { showErrorNotification } from 'store/notification/actions';

export const getPatients = therapistId => async dispatch => {
  dispatch(mutation.getPatientsRequest());
  const data = await Patient.getPatients(therapistId);
  if (data.success) {
    dispatch(mutation.getPatientsSuccess(data.data));
    return data.info;
  } else {
    dispatch(mutation.getPatientsFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};
