import { TreatmentPlan } from 'services/treatmentPlan';
import { mutation } from './mutations';
import {
  showErrorNotification,
  showSuccessNotification
} from 'store/notification/actions';

// Actions
export const createTreatmentPlan = payload => async (dispatch) => {
  dispatch(mutation.createTreatmentPlanRequest());
  const data = await TreatmentPlan.createTreatmentPlan(payload);
  if (data.success) {
    dispatch(mutation.createTreatmentPlanSuccess());
    dispatch(showSuccessNotification('toast_title.new_treatment_plan', data.message));
    return true;
  } else {
    dispatch(mutation.createTreatmentPlanFail());
    dispatch(showErrorNotification('toast_title.new_treatment_plan', data.message));
    return false;
  }
};

export const updateTreatmentPlan = (id, payload) => async dispatch => {
  dispatch(mutation.updateTreatmentPlanRequest());
  const data = await TreatmentPlan.updateTreatmentPlan(id, payload);
  if (data.success) {
    dispatch(mutation.updateTreatmentPlanSuccess());
    dispatch(getTreatmentPlans());
    dispatch(showSuccessNotification('toast_title.update_treatment_plan', data.message));
    return true;
  } else {
    dispatch(mutation.updateTreatmentPlanFail());
    dispatch(showErrorNotification('toast_title.update_treatment_plan', data.message));
    return false;
  }
};

export const getTreatmentPlans = payload => async dispatch => {
  dispatch(mutation.getTreatmentPlansRequest());
  const data = await TreatmentPlan.getTreatmentPlans(payload);
  if (data.success) {
    dispatch(mutation.getTreatmentPlansSuccess(data.data, payload));
    return data.info;
  } else {
    dispatch(mutation.getTreatmentPlansFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};
