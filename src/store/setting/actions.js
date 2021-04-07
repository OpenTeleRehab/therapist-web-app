import { Setting } from 'services/setting';
import { mutation } from './mutations';
import {
  showErrorNotification
} from 'store/notification/actions';

export const getSettings = () => async dispatch => {
  dispatch(mutation.getSettingsRequest());
  const data = await Setting.getSettings();
  if (data.success) {
    dispatch(mutation.getSettingsSuccess(data.data));
  } else {
    dispatch(mutation.getSettingsFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};
