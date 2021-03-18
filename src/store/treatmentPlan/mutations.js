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

const updateTreatmentPlanSuccess = () => ({
  type: 'UPDATE_TREATMENT_PLAN_SUCCESS'
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
  deleteTreatmentPlansFail
};
