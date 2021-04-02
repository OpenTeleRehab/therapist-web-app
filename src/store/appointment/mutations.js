const getAppointmentsRequest = () => ({
  type: 'GET_APPOINTMENTS_REQUEST'
});

const getAppointmentsSuccess = (data) => ({
  type: 'GET_APPOINTMENTS_SUCCESS',
  data
});

const getAppointmentsFail = () => ({
  type: 'GET_APPOINTMENTS_FAIL'
});

const createAppointmentRequest = () => ({
  type: 'CREATE_APPOINTMENT_REQUEST'
});

const createAppointmentSuccess = () => ({
  type: 'CREATE_APPOINTMENT_SUCCESS'
});

const createAppointmentFail = () => ({
  type: 'CREATE_APPOINTMENT_FAIL'
});

const updateAppointmentRequest = () => ({
  type: 'UPDATE_APPOINTMENT_REQUEST'
});

const updateAppointmentSuccess = () => ({
  type: 'UPDATE_APPOINTMENT_SUCCESS'
});

const updateAppointmentFail = () => ({
  type: 'UPDATE_APPOINTMENT_FAIL'
});

const updateAppointmentStatusRequest = () => ({
  type: 'UPDATE_APPOINTMENT_STATUS_REQUEST'
});

const updateAppointmentStatusSuccess = () => ({
  type: 'UPDATE_APPOINTMENT_STATUS_SUCCESS'
});

const updateAppointmentStatusFail = () => ({
  type: 'UPDATE_APPOINTMENT_STATUS_FAIL'
});

const deleteAppointmentRequest = () => ({
  type: 'DELETE_APPOINTMENT_REQUEST'
});

const deleteAppointmentSuccess = (data) => ({
  type: 'DELETE_APPOINTMENT_SUCCESS',
  data
});

const deleteAppointmentFail = () => ({
  type: 'DELETE_APPOINTMENT_FAIL'
});

const deleteAppointmentRequestRequest = () => ({
  type: 'DELETE_APPOINTMENT_REQUEST_REQUEST'
});

const deleteAppointmentRequestSuccess = () => ({
  type: 'DELETE_APPOINTMENT_REQUEST_SUCCESS'
});

const deleteAppointmentRequestFail = () => ({
  type: 'DELETE_APPOINTMENT_REQUEST_FAIL'
});

export const mutation = {
  getAppointmentsFail,
  getAppointmentsRequest,
  getAppointmentsSuccess,
  createAppointmentRequest,
  createAppointmentSuccess,
  createAppointmentFail,
  updateAppointmentRequest,
  updateAppointmentSuccess,
  updateAppointmentFail,
  updateAppointmentStatusRequest,
  updateAppointmentStatusSuccess,
  updateAppointmentStatusFail,
  deleteAppointmentRequest,
  deleteAppointmentSuccess,
  deleteAppointmentFail,
  deleteAppointmentRequestRequest,
  deleteAppointmentRequestSuccess,
  deleteAppointmentRequestFail
};
