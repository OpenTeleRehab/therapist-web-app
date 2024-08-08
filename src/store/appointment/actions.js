import { Appointment } from 'services/appointment';
import { mutation } from './mutations';
import {
  showErrorNotification,
  showSuccessNotification
} from 'store/notification/actions';
import { showSpinner } from '../spinnerOverlay/actions';

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

export const createAppointment = (payload, filter) => async (dispatch) => {
  dispatch(mutation.createAppointmentRequest());
  dispatch(showSpinner(true));
  const data = await Appointment.createAppointment(payload);
  if (data.success) {
    dispatch(mutation.createAppointmentSuccess());
    dispatch(getAppointments(filter));
    dispatch(showSuccessNotification('toast_title.new_appointment', data.message));
    dispatch(showSpinner(false));
    return true;
  } else {
    dispatch(mutation.createAppointmentFail());
    dispatch(showErrorNotification('toast_title.new_appointment', data.message));
    dispatch(showSpinner(false));
    return false;
  }
};

export const updateAppointment = (id, payload, filter) => async (dispatch) => {
  dispatch(mutation.updateAppointmentRequest());
  const data = await Appointment.updateAppointment(id, payload);
  if (data.success) {
    dispatch(mutation.updateAppointmentSuccess());
    dispatch(getAppointments(filter));
    dispatch(showSuccessNotification('toast_title.edit_appointment', data.message));
    return true;
  } else {
    dispatch(mutation.updateAppointmentFail());
    dispatch(showErrorNotification('toast_title.edit_appointment', data.message));
    return false;
  }
};

export const updateAppointmentStatus = (id, payload, filter) => async (dispatch) => {
  dispatch(mutation.updateAppointmentStatusRequest());
  const data = await Appointment.updateAppointmentStatus(id, payload);
  if (data.success) {
    dispatch(mutation.updateAppointmentStatusSuccess());
    dispatch(getAppointments(filter));
    return true;
  } else {
    dispatch(mutation.updateAppointmentStatusFail());
    return false;
  }
};

export const updateAppointmentUnread = (payload) => async (dispatch) => {
  dispatch(mutation.updateAppointmentUnreadRequest());
  const data = await Appointment.updateAppointmentUnread(payload);
  if (data.success) {
    dispatch(mutation.updateAppointmentUnreadSuccess());
    return true;
  } else {
    dispatch(mutation.updateAppointmentUnreadFail());
    return false;
  }
};

export const deleteAppointment = (id, filter) => async (dispatch) => {
  dispatch(mutation.deleteAppointmentRequest());
  const data = await Appointment.deleteAppointment(id);
  if (data.success) {
    dispatch(mutation.deleteAppointmentSuccess());
    dispatch(getAppointments(filter));
    dispatch(showSuccessNotification('toast_title.cancel_appointment', data.message));
    return true;
  } else {
    dispatch(mutation.deleteAppointmentFail());
    dispatch(showErrorNotification('toast_title.cancel_appointment', data.message));
    return false;
  }
};
