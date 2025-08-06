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

const getPatientRequest = () => ({
  type: 'GET_PATIENT_REQUEST'
});

const getPatientSuccess = (data) => ({
  type: 'GET_PATIENT_SUCCESS',
  data
});

const getPatientFail = () => ({
  type: 'GET_PATIENT_FAIL'
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

const getPatientsForChatroomRequest = () => ({
  type: 'GET_PATIENTS_CHATROOM_REQUEST'
});

const getPatientsForChatroomSuccess = (data) => ({
  type: 'GET_PATIENTS_CHATROOM_SUCCESS',
  data
});

const getPatientsForChatroomFail = () => ({
  type: 'GET_PATIENTS_CHATROOM_FAIL'
});

export const mutation = {
  getPatientsRequest,
  getPatientsSuccess,
  getPatientsFail,
  getPatientRequest,
  getPatientSuccess,
  getPatientFail,
  getTransferPatientRequest,
  getTransferPatientSuccess,
  getTransferPatientFail,
  getPatientsForChatroomRequest,
  getPatientsForChatroomSuccess,
  getPatientsForChatroomFail
};
