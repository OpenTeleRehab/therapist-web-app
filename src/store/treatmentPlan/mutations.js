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

export const mutation = {
  createTreatmentPlanRequest,
  createTreatmentPlanSuccess,
  createTreatmentPlanFail,
  updateTreatmentPlanRequest,
  updateTreatmentPlanSuccess,
  updateTreatmentPlanFail,
  getTreatmentPlansRequest,
  getTreatmentPlansSuccess,
  getTreatmentPlansFail
};
