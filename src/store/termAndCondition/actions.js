import { TermAndCondition } from 'services/termAndCondition';
import { mutation } from './mutations';
import {
  showErrorNotification
} from 'store/notification/actions';
import {
  showSpinner
} from 'store/spinnerOverlay/actions';

export const getPublishTermCondition = () => async dispatch => {
  dispatch(mutation.getPublishTermConditionRequest());
  dispatch(showSpinner(true));
  const data = await TermAndCondition.getPublishTermConditionPage();
  if (data) {
    dispatch(mutation.getPublishTermConditionSuccess(data.data));
    dispatch(showSpinner(false));
  } else {
    dispatch(mutation.getPublishTermConditionFail());
    dispatch(showSpinner(false));
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};
