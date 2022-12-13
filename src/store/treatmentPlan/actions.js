import { TreatmentPlan } from 'services/treatmentPlan';
import { mutation } from './mutations';
import { saveAs } from 'file-saver';
import _ from 'lodash';
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
    dispatch(showErrorNotification('toast_title.new_treatment_plan', data.message, { number: data.limit }));
    return false;
  }
};

export const updateTreatmentPlan = (id, payload) => async dispatch => {
  dispatch(mutation.updateTreatmentPlanRequest());
  const data = await TreatmentPlan.updateTreatmentPlan(id, payload);
  if (data.success) {
    dispatch(mutation.updateTreatmentPlanSuccess(id, payload));
    dispatch(showSuccessNotification('toast_title.update_treatment_plan', data.message));
    return true;
  } else {
    dispatch(mutation.updateTreatmentPlanFail());
    dispatch(showErrorNotification('toast_title.update_treatment_plan', data.message, { number: data.limit }));
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

export const getTreatmentPlansDetail = payload => async dispatch => {
  dispatch(mutation.getTreatmentPlansDetailRequest());
  const data = await TreatmentPlan.getTreatmentPlansDetail(payload);
  if (data.success) {
    dispatch(mutation.getTreatmentPlansDetailSuccess(data.data));
    return data.info;
  } else {
    dispatch(mutation.getTreatmentPlansDetailFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const deleteTreatmentPlans = id => async (dispatch, getState) => {
  dispatch(mutation.deleteTreatmentPlansRequest());
  const data = await TreatmentPlan.deleteTreatmentPlan(id);
  if (data.success) {
    dispatch(mutation.deleteTreatmentPlansSuccess());
    dispatch(showSuccessNotification('toast_title.delete_treatment_plan', data.message));
    return true;
  } else {
    dispatch(mutation.deleteTreatmentPlansFail());
    dispatch(showErrorNotification('toast_title.delete_treatment_plan', data.message));
    return false;
  }
};

export const getPresetTreatmentPlans = payload => async dispatch => {
  dispatch(mutation.getPresetTreatmentPlansRequest());
  const data = await TreatmentPlan.getTreatmentPlans(payload);
  if (data.success) {
    dispatch(mutation.getPresetTreatmentPlansSuccess(data.data, payload));
    return data.info;
  } else {
    dispatch(mutation.getPresetTreatmentPlansFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const downloadTreatmentPlan = id => async (dispatch) => {
  dispatch(mutation.downloadTreatmentPlanRequest());
  const res = await TreatmentPlan.downloadTreatmentPlan(id);
  if (res) {
    dispatch(mutation.downloadTreatmentPlanSuccess());
    saveAs(res, 'treatment_plan.pdf');
    return true;
  } else {
    dispatch(mutation.downloadTreatmentPlanFail());
    dispatch(showErrorNotification('toast_title.error_message', res.message));
    return false;
  }
};

export const addExerciseDataPreview = (id) => (dispatch, getState) => {
  const exercise = _.find(getState().exercise.exercises, { id });
  const { previewData } = getState().treatmentPlan.treatmentPlansDetail;
  const indexOfData = _.findIndex(previewData.exercises, { id });

  if (indexOfData === -1 && exercise) {
    const newPreviewData = {
      ...previewData,
      exercises: [...previewData.exercises, exercise]
    };

    dispatch(mutation.addDataPreview(newPreviewData));
  }
};

export const addMaterialDataPreview = (id) => (dispatch, getState) => {
  const material = _.find(getState().educationMaterial.educationMaterials, { id });
  const { previewData } = getState().treatmentPlan.treatmentPlansDetail;
  const indexOfData = _.findIndex(previewData.materials, { id });

  if (indexOfData === -1 && material) {
    const newPreviewData = {
      ...previewData,
      materials: [...previewData.materials, material]
    };

    dispatch(mutation.addDataPreview(newPreviewData));
  }
};

export const addQuestionnaireDataPreview = (id) => (dispatch, getState) => {
  const questionnaire = _.find(getState().questionnaire.questionnaires, { id });
  const { previewData } = getState().treatmentPlan.treatmentPlansDetail;
  const indexOfData = _.findIndex(previewData.questionnaires, { id });

  if (indexOfData === -1 && questionnaire) {
    const newPreviewData = {
      ...previewData,
      questionnaires: [...previewData.questionnaires, questionnaire]
    };

    dispatch(mutation.addDataPreview(newPreviewData));
  }
};

export const addPresetDataPreview = (id) => async (dispatch, getState) => {
  const data = await TreatmentPlan.getTreatmentPlansDetail({ id, type: 'preset' });
  if (data.success) {
    const { previewData: presetPreviewData } = data.data;
    const { previewData } = getState().treatmentPlan.treatmentPlansDetail;

    const newPreviewData = {
      exercises: _.unionBy(previewData.exercises, presetPreviewData.exercises, 'id'),
      materials: _.unionBy(previewData.materials, presetPreviewData.materials, 'id'),
      questionnaires: _.unionBy(previewData.questionnaires, presetPreviewData.questionnaires, 'id')
    };

    dispatch(mutation.addDataPreview(newPreviewData));
  } else {
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};
