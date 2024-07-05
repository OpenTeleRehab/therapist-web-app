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

const getTransferPatientRequest = () => ({
  type: 'GET_TRANSFER_PATIENT_REQUEST'
});

const getTransferPatientSuccess = (data) => ({
  type: 'GET_TRANSFER_PATIENT_SUCCESS',
  data
});

const getTransferPatientFail = () => ({
  type: 'GET_TRANSFER_PATIENT_FAIL'
});

export const mutation = {
  getPatientsRequest,
  getPatientsSuccess,
  getPatientsFail,
  getTransferPatientRequest,
  getTransferPatientSuccess,
  getTransferPatientFail
};
