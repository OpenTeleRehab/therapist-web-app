import { EducationMaterial } from 'services/educationMaterial';
import { mutation } from './mutations';
import { showErrorNotification } from 'store/notification/actions';

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

export const clearFilterEducationMaterials = () => async dispatch => {
  dispatch(mutation.clearFilterEducationMaterialsRequest());
};
