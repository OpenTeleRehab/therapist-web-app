const createPatientAssistiveTechnologyRequest = () => ({
  type: 'CREATE_PATIENT_ASSISTIVE_TECHNOLOGY_REQUEST'
});

const createPatientAssistiveTechnologySuccess = () => ({
  type: 'CREATE_PATIENT_ASSISTIVE_TECHNOLOGY_SUCCESS'
});

const createPatientAssistiveTechnologyFail = () => ({
  type: 'CREATE_PATIENT_ASSISTIVE_TECHNOLOGY_FAIL'
});

const updatePatientAssistiveTechnologyRequest = () => ({
  type: 'UPDATE_PATIENT_ASSISTIVE_TECHNOLOGY_REQUEST'
});

const updatePatientAssistiveTechnologySuccess = () => ({
  type: 'UPDATE_PATIENT_ASSISTIVE_TECHNOLOGY_SUCCESS'
});

const updatePatientAssistiveTechnologyFail = () => ({
  type: 'UPDATE_PATIENT_ASSISTIVE_TECHNOLOGY_FAIL'
});

const getAssistiveTechnologiesRequest = () => ({
  type: 'GET_ASSISTIVE_TECHNOLOGIES_REQUEST'
});

const getAssistiveTechnologiesSuccess = (data) => ({
  type: 'GET_ASSISTIVE_TECHNOLOGIES_SUCCESS',
  data
});

const getAssistiveTechnologiesFail = () => ({
  type: 'GET_ASSISTIVE_TECHNOLOGIES_FAIL'
});

const getPatientAssistiveTechnologiesRequest = () => ({
  type: 'GET_PATIENT_ASSISTIVE_TECHNOLOGIES_REQUEST'
});

const getPatientAssistiveTechnologiesSuccess = (data) => ({
  type: 'GET_PATIENT_ASSISTIVE_TECHNOLOGIES_SUCCESS',
  data
});

const getPatientAssistiveTechnologiesFail = () => ({
  type: 'GET_PATIENT_ASSISTIVE_TECHNOLOGIES_FAIL'
});

const deletePatientAssistiveTechnologiesRequest = () => ({
  type: 'DELETE_PATIENT_ASSISTIVE_TECHNOLOGIES_REQUEST'
});

const deletePatientAssistiveTechnologiesSuccess = (data) => ({
  type: 'DELETE_PATIENT_ASSISTIVE_TECHNOLOGIES_SUCCESS',
  data
});

const deletePatientAssistiveTechnologiesFail = () => ({
  type: 'DELETE_PATIENT_ASSISTIVE_TECHNOLOGIES_FAIL'
});

export const mutation = {
  createPatientAssistiveTechnologyRequest,
  createPatientAssistiveTechnologySuccess,
  createPatientAssistiveTechnologyFail,
  updatePatientAssistiveTechnologyRequest,
  updatePatientAssistiveTechnologySuccess,
  updatePatientAssistiveTechnologyFail,
  getAssistiveTechnologiesRequest,
  getAssistiveTechnologiesSuccess,
  getAssistiveTechnologiesFail,
  getPatientAssistiveTechnologiesRequest,
  getPatientAssistiveTechnologiesSuccess,
  getPatientAssistiveTechnologiesFail,
  deletePatientAssistiveTechnologiesRequest,
  deletePatientAssistiveTechnologiesSuccess,
  deletePatientAssistiveTechnologiesFail
};
