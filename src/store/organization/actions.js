import { Organization } from 'services/organization';
import { mutation } from './mutations';
import { showErrorNotification } from 'store/notification/actions';
import { showSpinner } from 'store/spinnerOverlay/actions';
export const getOrganizationTherapistAndMaxSms = orgName => async dispatch => {
  dispatch(mutation.getOrganizationTherapistAndMaxSmsRequest());
  dispatch(showSpinner(true));
  const data = await Organization.getTherapistAndMaxSms(orgName);
  if (data.success) {
    dispatch(mutation.getOrganizationTherapistAndMaxSmsSuccess(data.data));
    dispatch(showSpinner(false));
    return data.data;
  } else {
    dispatch(mutation.getOrganizationTherapistAndMaxSmsFail());
    dispatch(showSpinner(false));
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};
