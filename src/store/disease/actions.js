import { Disease } from 'services/disease';
import { mutation } from './mutations';
import {
  showErrorNotification
} from 'store/notification/actions';

export const getDiseases = payload => async dispatch => {
  dispatch(mutation.getDiseasesRequest());
  const data = await Disease.getDiseases(payload);
  if (data.success) {
    dispatch(mutation.getDiseasesSuccess(data.data));
  } else {
    dispatch(mutation.getDiseasesFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};
