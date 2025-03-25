import { superset } from 'services/superset';
import { mutation } from './mutations';
import {
  showErrorNotification
} from 'store/notification/actions';

export const getGuestToken = () => async dispatch => {
  dispatch(mutation.getGuestTokenRequest());
  const data = await superset.getGuestToken();
  if (data.success) {
    dispatch(mutation.getGuestTokenSuccess(data.data));
    return data;
  } else {
    dispatch(mutation.getGuestTokenFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};
