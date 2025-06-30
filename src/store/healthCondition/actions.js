import { HealthCondition } from 'services/healthConditions';
import { mutation } from './mutations';
import {
  showErrorNotification
} from 'store/notification/actions';

export const getHealthConditions = payload => async dispatch => {
  dispatch(mutation.getHealthConditionsRequest());
  const data = await HealthCondition.getHealthConditions(payload);
  if (data.success) {
    dispatch(mutation.getHealthConditionsSuccess(data.data));
  } else {
    dispatch(mutation.getHealthConditionsFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};
