const getPatientsRequest = () => ({
  type: 'GET_PATIENTS_REQUEST'
});

const getPatientsSuccess = (data) => ({
  type: 'GET_PATIENTS_SUCCESS',
  data
});

const getPatientsFail = () => ({
  type: 'GET_PATIENTS_FAIL'
});

export const mutation = {
  getPatientsRequest,
  getPatientsSuccess,
  getPatientsFail
};
