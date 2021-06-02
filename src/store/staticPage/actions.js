import { staticPage } from 'services/staticPage';
import { mutation } from './mutations';
import { showErrorNotification } from 'store/notification/actions';
import { showSpinner } from '../spinnerOverlay/actions';

export const getFaqPage = payload => async dispatch => {
  dispatch(mutation.getFaqPageRequest());
  dispatch(showSpinner(true));
  const data = await staticPage.getFaqPage(payload);
  if (data.success) {
    dispatch(mutation.getFaqPageSuccess(data.data));
    dispatch(showSpinner(false));
  } else {
    dispatch(mutation.getFaqPageFail());
    dispatch(showSpinner(false));
    console.log(data.message);
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};
