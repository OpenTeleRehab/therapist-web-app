import { Setting } from 'services/setting';
import { mutation } from './mutations';
import {
  showErrorNotification
} from 'store/notification/actions';

export const getLanguages = () => async dispatch => {
  dispatch(mutation.getLanguagesRequest());
  const data = await Setting.getLanguage();
  if (data.success) {
    dispatch(mutation.getLanguagesSuccess(data.data));
  } else {
    dispatch(mutation.getLanguagesFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};
