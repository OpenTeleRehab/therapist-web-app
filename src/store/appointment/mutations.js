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

export const mutation = {
  getAppointmentsFail,
  getAppointmentsRequest,
  getAppointmentsSuccess
};
