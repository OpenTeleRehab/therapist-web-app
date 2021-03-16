import { Appointment } from 'services/appointment';
import { mutation } from './mutations';
import {
  showErrorNotification
} from 'store/notification/actions';

export const getAppointments = payload => async dispatch => {
  dispatch(mutation.getAppointmentsRequest());
  const data = await Appointment.getAppointments(payload);
  if (data.success) {
    dispatch(mutation.getAppointmentsSuccess(data.data));
  } else {
    dispatch(mutation.getAppointmentsFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};
