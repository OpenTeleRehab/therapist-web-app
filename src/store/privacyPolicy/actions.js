import { PrivacyPolicy } from 'services/privacyPolicy';
import { mutation } from './mutations';
import {
  showErrorNotification
} from 'store/notification/actions';

export const getPublishPrivacyPolicy = payload => async dispatch => {
  dispatch(mutation.getPublishPrivacyPolicyRequest());
  const res = await PrivacyPolicy.getPublishPrivacyPolicy(payload);
  if (res) {
    dispatch(mutation.getPublishPrivacyPolicySuccess(res.data));
  } else {
    dispatch(mutation.getPublishPrivacyPolicyFail());
    dispatch(showErrorNotification('toast_title.error_message', res.message));
  }
};
