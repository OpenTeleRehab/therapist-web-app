import { HealthConditionGroup } from 'services/healthConditionGroups';
import { mutation } from './mutations';
import {
  showErrorNotification
} from 'store/notification/actions';

export const getHealthConditionGroups = payload => async dispatch => {
  dispatch(mutation.getHealthConditionGroupsRequest());
  const data = await HealthConditionGroup.getHealthConditionGroups(payload);
  if (data.success) {
    dispatch(mutation.getHealthConditionGroupsSuccess(data.data));
  } else {
    dispatch(mutation.getHealthConditionGroupsFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};
