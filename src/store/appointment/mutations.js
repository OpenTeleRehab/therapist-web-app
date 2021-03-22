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

export const mutation = {
  getAppointmentsFail,
  getAppointmentsRequest,
  getAppointmentsSuccess,
  createAppointmentRequest,
  createAppointmentSuccess,
  createAppointmentFail,
  updateAppointmentRequest,
  updateAppointmentSuccess,
  updateAppointmentFail
};
