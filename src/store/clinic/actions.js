import { Clinic } from 'services/clinic';
import { mutation } from './mutations';
import {
  showErrorNotification
} from 'store/notification/actions';

export const getClinics = (countryId) => async dispatch => {
  dispatch(mutation.getClinicsRequest());
  const data = await Clinic.getClinics(countryId);
  if (data.success) {
    dispatch(mutation.getClinicsSuccess(data.data));
  } else {
    dispatch(mutation.getClinicsFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};
