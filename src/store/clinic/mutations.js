const getClinicsRequest = () => ({
  type: 'GET_CLINICS_REQUEST'
});

const getClinicsSuccess = (data) => ({
  type: 'GET_CLINICS_SUCCESS',
  data
});

const getClinicsFail = () => ({
  type: 'GET_CLINICS_FAIL'
});

export const mutation = {
  getClinicsFail,
  getClinicsRequest,
  getClinicsSuccess
};
