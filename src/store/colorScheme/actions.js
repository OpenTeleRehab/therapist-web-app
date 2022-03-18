import { colorScheme } from 'services/colorScheme';
import { mutation } from './mutations';
import {
  showErrorNotification
} from 'store/notification/actions';
import { showSpinner } from '../spinnerOverlay/actions';

export const getColorScheme = () => async dispatch => {
  dispatch(mutation.getColorSchemeRequest());
  dispatch(showSpinner(true));
  const data = await colorScheme.getColorScheme();
  if (data.success) {
    dispatch(mutation.getColorSchemeSuccess(data.data));
    dispatch(showSpinner(false));
  } else {
    dispatch(mutation.getColorSchemeFail());
    dispatch(showSpinner(false));
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};
