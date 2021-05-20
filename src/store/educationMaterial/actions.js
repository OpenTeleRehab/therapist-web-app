import { EducationMaterial } from 'services/educationMaterial';
import { mutation } from './mutations';
import { showErrorNotification, showSuccessNotification } from 'store/notification/actions';
import { showSpinner } from 'store/spinnerOverlay/actions';

export const getEducationMaterials = payload => async dispatch => {
  dispatch(mutation.getEducationMaterialsRequest());
  const data = await EducationMaterial.getEducationMaterials(payload);
  if (data.success) {
    dispatch(mutation.getEducationMaterialsSuccess(data.data, payload));
    return data.info;
  } else {
    dispatch(mutation.getEducationMaterialsFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const getEducationMaterial = (id, language) => async dispatch => {
  dispatch(mutation.getEducationMaterialRequest());
  dispatch(showSpinner(true));
  const data = await EducationMaterial.getEducationMaterial(id, language);
  if (data) {
    dispatch(mutation.getEducationMaterialSuccess(data.data));
    dispatch(showSpinner(false));
  } else {
    dispatch(mutation.getEducationMaterialFail());
    dispatch(showSpinner(false));
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const updateFavorite = (id, payload) => async (dispatch, getState) => {
  dispatch(mutation.updateFavoriteRequest());
  const data = await EducationMaterial.updateFavorite(id, payload);
  if (data.success) {
    dispatch(mutation.updateFavoriteSuccess());
    const filters = getState().educationMaterial.filters;
    dispatch(getEducationMaterials({ ...filters, therapist_id: payload.therapist_id }));
    return true;
  } else {
    dispatch(mutation.updateFavoriteFail());
    return false;
  }
};

export const createEducationMaterial = (payload) => async dispatch => {
  dispatch(mutation.createEducationMaterialRequest());
  const data = await EducationMaterial.createEducationMaterial(payload);
  if (data.success) {
    dispatch(mutation.createEducationMaterialSuccess());
    dispatch(showSuccessNotification('toast_title.new_education_material', data.message));
    return true;
  } else {
    dispatch(mutation.createEducationMaterialFail());
    dispatch(showErrorNotification('toast_title.new_education_material', data.message));
    return false;
  }
};

export const updateEducationMaterial = (id, payload, mediaUploads) => async dispatch => {
  dispatch(mutation.updateEducationMaterialRequest());
  const data = await EducationMaterial.updateEducationMaterial(id, payload, mediaUploads);
  if (data.success) {
    dispatch(mutation.updateEducationMaterialSuccess());
    dispatch(showSuccessNotification('toast_title.update_education_material', data.message));
    return true;
  } else {
    dispatch(mutation.updateEducationMaterialFail());
    dispatch(showErrorNotification('toast_title.update_education_material', data.message));
    return false;
  }
};

export const deleteEducationMaterial = id => async (dispatch, getState) => {
  dispatch(mutation.deleteEducationMaterialRequest());
  const data = await EducationMaterial.deleteEducationMaterial(id);
  if (data.success) {
    dispatch(mutation.deleteEducationMaterialSuccess());
    const filters = getState().educationMaterial.filters;
    dispatch(getEducationMaterials(filters));
    dispatch(showSuccessNotification('toast_title.delete_education_material', data.message));
    return true;
  } else {
    dispatch(mutation.deleteEducationMaterialFail());
    dispatch(showErrorNotification('toast_title.delete_education_material', data.message));
    return false;
  }
};

export const clearFilterEducationMaterials = () => async dispatch => {
  dispatch(mutation.clearFilterEducationMaterialsRequest());
};
