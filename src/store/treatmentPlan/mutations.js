const createTreatmentPlanRequest = () => ({
  type: 'CREATE_TREATMENT_PLAN_REQUEST'
});

const createTreatmentPlanSuccess = () => ({
  type: 'CREATE_TREATMENT_PLAN_SUCCESS'
});

const createTreatmentPlanFail = () => ({
  type: 'CREATE_TREATMENT_PLAN_FAIL'
});

const updateTreatmentPlanRequest = () => ({
  type: 'UPDATE_TREATMENT_PLAN_REQUEST'
});

const updateTreatmentPlanSuccess = (id, data) => ({
  type: 'UPDATE_TREATMENT_PLAN_SUCCESS',
  id,
  data
});

const updateTreatmentPlanFail = () => ({
  type: 'UPDATE_TREATMENT_PLAN_FAIL'
});

const getTreatmentPlansRequest = () => ({
  type: 'GET_TREATMENT_PLANS_REQUEST'
});

const getTreatmentPlansSuccess = (data) => ({
  type: 'GET_TREATMENT_PLANS_SUCCESS',
  data
});

const getTreatmentPlansFail = () => ({
  type: 'GET_TREATMENT_PLANS_FAIL'
});

const getTreatmentPlansDetailRequest = () => ({
  type: 'GET_TREATMENT_PLANS_DETAIL_REQUEST'
});

const getTreatmentPlansDetailSuccess = (data) => ({
  type: 'GET_TREATMENT_PLANS_DETAIL_SUCCESS',
  data
});

const getTreatmentPlansDetailFail = () => ({
  type: 'GET_TREATMENT_PLANS_DETAIL_FAIL'
});

const deleteTreatmentPlansRequest = () => ({
  type: 'DELETE_TREATMENT_PLANS_REQUEST'
});

const deleteTreatmentPlansSuccess = (data) => ({
  type: 'DELETE_TREATMENT_PLANS_SUCCESS',
  data
});

const deleteTreatmentPlansFail = () => ({
  type: 'DELETE_TREATMENT_PLANS_FAIL'
});

const getPresetTreatmentPlansRequest = () => ({
  type: 'GET_PRESET_TREATMENT_PLANS_REQUEST'
});

const getPresetTreatmentPlansSuccess = (data) => ({
  type: 'GET_PRESET_TREATMENT_PLANS_SUCCESS',
  data
});

const getPresetTreatmentPlansFail = () => ({
  type: 'GET_PRESET_TREATMENT_PLANS_FAIL'
});

const downloadTreatmentPlanRequest = () => ({
  type: 'DOWNLOAD_TREATMENT_PLAN_REQUEST'
});

const downloadTreatmentPlanSuccess = () => ({
  type: 'DOWNLOAD_TREATMENT_PLAN_SUCCESS'
});

const downloadTreatmentPlanFail = () => ({
  type: 'DOWNLOAD_TREATMENT_PLAN_FAIL'
});

const addDataPreview = (data) => ({
  type: 'ADD_DATA_PREVIEW',
  data
});

export const mutation = {
  createTreatmentPlanRequest,
  createTreatmentPlanSuccess,
  createTreatmentPlanFail,
  updateTreatmentPlanRequest,
  updateTreatmentPlanSuccess,
  updateTreatmentPlanFail,
  getTreatmentPlansRequest,
  getTreatmentPlansSuccess,
  getTreatmentPlansFail,
  getTreatmentPlansDetailRequest,
  getTreatmentPlansDetailSuccess,
  getTreatmentPlansDetailFail,
  deleteTreatmentPlansRequest,
  deleteTreatmentPlansSuccess,
  deleteTreatmentPlansFail,
  getPresetTreatmentPlansRequest,
  getPresetTreatmentPlansSuccess,
  getPresetTreatmentPlansFail,
  downloadTreatmentPlanRequest,
  downloadTreatmentPlanSuccess,
  downloadTreatmentPlanFail,
  addDataPreview
};
